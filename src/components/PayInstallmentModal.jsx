import { useState } from 'react';
import { useStore } from '../store/useStore';
import Modal from './Modal';

function PayInstallmentModal({ isOpen, onClose }) {
    const bookings = useStore(state => state.bookings);
    const clients = useStore(state => state.clients);
    const projects = useStore(state => state.projects);
    const transactions = useStore(state => state.transactions);
    const addTransaction = useStore(state => state.addTransaction);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');

    // Get plot details
    const getPlotDetails = (plotId) => {
        let details = { projectName: '', blockName: '', plotNumber: '' };
        projects.forEach(project => {
            project.blocks.forEach(block => {
                const plot = block.plots.find(p => p.id === plotId);
                if (plot) {
                    details = {
                        projectName: project.name,
                        blockName: block.name,
                        plotNumber: plot.number
                    };
                }
            });
        });
        return details;
    };

    // Calculate payment schedule for a booking
    const getPaymentSchedule = (booking) => {
        const bookingTransactions = transactions.filter(t => t.bookingId === booking.id);
        const totalPaid = bookingTransactions.reduce((sum, t) => sum + t.amount, 0);

        const schedule = [];
        const remaining = booking.totalAmount - booking.advanceAmount;
        const monthlyAmount = remaining / booking.months;
        let currentDate = new Date(booking.date);

        // Advance payment
        schedule.push({
            no: 0,
            label: 'Advance',
            date: booking.date,
            amount: booking.advanceAmount,
            paid: true,
            isPaid: true
        });

        // Monthly installments
        for (let i = 1; i <= booking.months; i++) {
            currentDate = new Date(currentDate);
            currentDate.setMonth(currentDate.getMonth() + 1);

            const dueSoFar = booking.advanceAmount + (monthlyAmount * i);
            const isPaid = totalPaid >= dueSoFar;

            schedule.push({
                no: i,
                label: `Month ${i}`,
                date: currentDate.toISOString(),
                amount: monthlyAmount,
                paid: isPaid,
                isPaid: isPaid
            });
        }

        return {
            schedule,
            totalPaid,
            pending: booking.totalAmount - totalPaid,
            monthlyAmount
        };
    };

    // Filter bookings based on search
    const filteredBookings = bookings.filter(booking => {
        const client = clients.find(c => c.id === booking.clientId);
        const plotDetails = getPlotDetails(booking.plotId);
        const searchLower = searchTerm.toLowerCase();

        return (
            client?.name.toLowerCase().includes(searchLower) ||
            client?.cnic.includes(searchTerm) ||
            client?.phone.includes(searchTerm) ||
            plotDetails.plotNumber.toLowerCase().includes(searchLower)
        );
    }).map(booking => {
        const client = clients.find(c => c.id === booking.clientId);
        const plotDetails = getPlotDetails(booking.plotId);
        const paymentInfo = getPaymentSchedule(booking);

        return {
            booking,
            client,
            plotDetails,
            ...paymentInfo
        };
    }).filter(item => item.pending > 0); // Only show bookings with pending payments

    const handleSelectBooking = (item) => {
        setSelectedBooking(item);
        // Find first unpaid installment and set that as default
        const firstUnpaid = item.schedule.find(s => !s.isPaid);
        if (firstUnpaid) {
            setPaymentAmount(firstUnpaid.amount.toFixed(0));
        } else {
            setPaymentAmount(item.monthlyAmount.toFixed(0));
        }
    };

    const handlePayment = () => {
        if (!selectedBooking || !paymentAmount || parseFloat(paymentAmount) <= 0) {
            alert('Please enter a valid payment amount');
            return;
        }

        const amount = parseFloat(paymentAmount);
        if (amount > selectedBooking.pending) {
            alert('Payment amount cannot exceed pending amount');
            return;
        }

        // Add transaction
        const transaction = addTransaction({
            bookingId: selectedBooking.booking.id,
            amount: amount,
            type: 'installment',
            method: paymentMethod,
            date: new Date().toISOString()
        });

        // Generate and print thermal receipt
        generateThermalReceipt(selectedBooking, amount, paymentMethod);

        alert(`Payment of Rs. ${amount.toLocaleString()} received successfully!\nReceipt is being printed...`);

        // Reset
        setSelectedBooking(null);
        setPaymentAmount('');
        setSearchTerm('');
        onClose();
    };

    const generateThermalReceipt = (bookingInfo, paidAmount, method) => {
        const company = useStore.getState().company;
        const currentDate = new Date();

        const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          @page { size: 80mm 200mm; margin: 5mm; }
          body { 
            font-family: 'Courier New', monospace; 
            font-size: 11pt;
            line-height: 1.4;
            margin: 0;
            padding: 10px;
            width: 80mm;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .divider { 
            border-top: 1px dashed #000; 
            margin: 8px 0; 
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          .header {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .footer {
            margin-top: 10px;
            font-size: 9pt;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="center header">${company.name}</div>
        <div class="center" style="font-size: 9pt;">${company.email}</div>
        <div class="center" style="font-size: 9pt;">${company.phone}</div>
        <div class="divider"></div>
        
        <div class="center bold" style="font-size: 12pt; margin: 8px 0;">INSTALLMENT RECEIPT</div>
        
        <div class="divider"></div>
        
        <div class="row">
          <span>Date:</span>
          <span class="bold">${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}</span>
        </div>
        
        <div class="divider"></div>
        
        <div class="row">
          <span>Client:</span>
          <span class="bold">${bookingInfo.client.name}</span>
        </div>
        <div class="row">
          <span>CNIC:</span>
          <span>${bookingInfo.client.cnic}</span>
        </div>
        <div class="row">
          <span>Phone:</span>
          <span>${bookingInfo.client.phone}</span>
        </div>
        
        <div class="divider"></div>
        
        <div class="row">
          <span>Project:</span>
          <span>${bookingInfo.plotDetails.projectName}</span>
        </div>
        <div class="row">
          <span>Plot:</span>
          <span class="bold">${bookingInfo.plotDetails.plotNumber}</span>
        </div>
        
        <div class="divider"></div>
        
        <div class="row">
          <span>Total Amount:</span>
          <span>Rs. ${bookingInfo.booking.totalAmount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span>Previously Paid:</span>
          <span>Rs. ${bookingInfo.totalPaid.toLocaleString()}</span>
        </div>
        <div class="row">
          <span class="bold">Payment Now:</span>
          <span class="bold" style="font-size: 13pt;">Rs. ${paidAmount.toLocaleString()}</span>
        </div>
        <div class="row">
          <span>Payment Method:</span>
          <span style="text-transform: capitalize;">${method}</span>
        </div>
        
        <div class="divider"></div>
        
        <div class="row">
          <span>New Balance Paid:</span>
          <span class="bold">Rs. ${(bookingInfo.totalPaid + paidAmount).toLocaleString()}</span>
        </div>
        <div class="row">
          <span>Remaining:</span>
          <span class="bold">Rs. ${(bookingInfo.pending - paidAmount).toLocaleString()}</span>
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
          Thank you for your payment!<br/>
          Keep this receipt for your records
        </div>
      </body>
      </html>
    `;

        const printWindow = window.open('', '_blank', 'width=300,height=600');
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const handleQuickPay = (installment) => {
        if (installment.isPaid) {
            alert('This installment has already been paid');
            return;
        }

        setPaymentAmount(installment.amount.toFixed(0));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Pay Installment</h2>
                    <div className="text-sm text-slate-500">
                        <i className="fa-solid fa-info-circle mr-1"></i>
                        Search and process client payments
                    </div>
                </div>

                {!selectedBooking ? (
                    <>
                        {/* Search Section */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Search Client (Name, CNIC, Phone, or Plot Number)
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Type to search..."
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-lg"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {searchTerm && filteredBookings.length === 0 && (
                                <div className="text-center py-8 text-slate-400">
                                    <i className="fa-solid fa-search text-4xl mb-3"></i>
                                    <p>No clients found with pending payments</p>
                                </div>
                            )}

                            {searchTerm && filteredBookings.map((item) => (
                                <div
                                    key={item.booking.id}
                                    onClick={() => handleSelectBooking(item)}
                                    className="p-4 border-2 border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 cursor-pointer transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-slate-800">{item.client.name}</h3>
                                            <p className="text-sm text-slate-600">CNIC: {item.client.cnic}</p>
                                            <p className="text-sm text-slate-600">
                                                Plot: {item.plotDetails.projectName} - Block {item.plotDetails.blockName} - {item.plotDetails.plotNumber}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-500">Pending</div>
                                            <div className="text-2xl font-bold text-red-600">
                                                Rs. {item.pending.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                Monthly: Rs. {item.monthlyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Selected Client Payment Form */}
                        <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white p-6 rounded-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{selectedBooking.client.name}</h3>
                                    <p className="opacity-90">{selectedBooking.client.cnic}</p>
                                    <p className="opacity-90">
                                        {selectedBooking.plotDetails.projectName} - {selectedBooking.plotDetails.plotNumber}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="text-white hover:bg-white/20 px-3 py-1 rounded"
                                >
                                    <i className="fa-solid fa-arrow-left mr-2"></i> Back
                                </button>
                            </div>
                        </div>

                        {/* Payment Schedule */}
                        <div>
                            <h4 className="font-bold text-lg mb-3">
                                Payment Schedule - Click unpaid months to select amount
                            </h4>
                            <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                                {selectedBooking.schedule.map((installment) => (
                                    <div
                                        key={installment.no}
                                        onClick={() => handleQuickPay(installment)}
                                        className={`p-4 rounded-lg border-2 transition-all ${installment.isPaid
                                                ? 'bg-emerald-50 border-emerald-300 opacity-60 cursor-not-allowed'
                                                : paymentAmount === installment.amount.toFixed(0)
                                                    ? 'border-brand-600 bg-brand-100 shadow-lg cursor-pointer transform scale-105'
                                                    : 'border-slate-200 hover:border-brand-500 hover:bg-brand-50 cursor-pointer hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`font-bold ${installment.isPaid ? 'text-slate-500' : 'text-slate-700'}`}>
                                                {installment.label}
                                            </span>
                                            {installment.isPaid ? (
                                                <i className="fa-solid fa-check-circle text-emerald-600 text-xl"></i>
                                            ) : paymentAmount === installment.amount.toFixed(0) ? (
                                                <i className="fa-solid fa-circle-dot text-brand-600 text-xl animate-pulse"></i>
                                            ) : (
                                                <i className="fa-regular fa-circle text-slate-300 text-xl"></i>
                                            )}
                                        </div>
                                        <div className={`text-sm ${installment.isPaid ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                                            {new Date(installment.date).toLocaleDateString()}
                                        </div>
                                        <div className={`font-bold text-lg ${installment.isPaid ? 'text-slate-400' : ''}`}>
                                            Rs. {installment.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                            <div>
                                <div className="text-sm text-slate-500">Total Amount</div>
                                <div className="text-lg font-bold">Rs. {selectedBooking.booking.totalAmount.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500">Paid</div>
                                <div className="text-lg font-bold text-emerald-600">Rs. {selectedBooking.totalPaid.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500">Pending</div>
                                <div className="text-lg font-bold text-red-600">Rs. {selectedBooking.pending.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="border-t-2 pt-6">
                            <h4 className="font-bold text-lg mb-4">Receive Payment</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Amount</label>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-lg font-bold"
                                        placeholder="Enter amount"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => setPaymentAmount(selectedBooking.monthlyAmount.toFixed(0))}
                                            className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                                        >
                                            Monthly: Rs. {selectedBooking.monthlyAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </button>
                                        <button
                                            onClick={() => setPaymentAmount(selectedBooking.pending.toFixed(0))}
                                            className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                                        >
                                            Full: Rs. {selectedBooking.pending.toLocaleString()}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-lg"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="online">Online Payment</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform active:scale-95"
                            >
                                <i className="fa-solid fa-check-circle mr-2"></i>
                                Receive Payment of Rs. {paymentAmount ? parseFloat(paymentAmount).toLocaleString() : '0'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}

export default PayInstallmentModal;
