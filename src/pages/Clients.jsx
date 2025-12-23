import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import Header from '../components/Layout/Header';
import Modal from '../components/Modal';
import PayInstallmentModal from '../components/PayInstallmentModal';

function Clients() {
    const projects = useStore(state => state.projects);
    const clients = useStore(state => state.clients);
    const bookings = useStore(state => state.bookings);
    const addClient = useStore(state => state.addClient);
    const deleteClient = useStore(state => state.deleteClient);
    const processBooking = useStore(state => state.processBooking);
    const { t } = useTranslation();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        clientName: '',
        clientCnic: '',
        clientPhone: '',
        clientAddress: '',
        plotId: '',
        totalAmount: 0,
        advanceAmount: 0,
        months: 12,
        paymentMethod: 'cash'
    });

    // Get all available plots
    const availablePlots = [];
    projects.forEach(project => {
        project.blocks.forEach(block => {
            block.plots.forEach(plot => {
                if (plot.status === 'available') {
                    availablePlots.push({
                        ...plot,
                        projectName: project.name,
                        blockName: block.name
                    });
                }
            });
        });
    });

    const handleSubmitBooking = (e) => {
        e.preventDefault();

        // Add or get client
        const client = addClient({
            name: bookingForm.clientName,
            cnic: bookingForm.clientCnic,
            phone: bookingForm.clientPhone,
            address: bookingForm.clientAddress
        });

        // Process booking
        const result = processBooking({
            clientId: client.id,
            plotId: bookingForm.plotId,
            totalAmount: parseFloat(bookingForm.totalAmount),
            advanceAmount: parseFloat(bookingForm.advanceAmount),
            months: parseInt(bookingForm.months),
            paymentMethod: bookingForm.paymentMethod
        });

        if (result.success) {
            setShowBookingModal(false);
            setBookingForm({
                clientName: '',
                clientCnic: '',
                clientPhone: '',
                clientAddress: '',
                plotId: '',
                totalAmount: 0,
                advanceAmount: 0,
                months: 12,
                paymentMethod: 'cash'
            });
        } else {
            alert(result.error);
        }
    };

    return (
        <>
            <Header
                title={t('clients')}
                subtitle="Manage bookings and client information"
                actions={
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-emerald-500/30 transition flex items-center"
                        >
                            <i className="fa-solid fa-money-bill-wave mr-2"></i> Pay Installment
                        </button>
                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-brand-500/30 transition flex items-center"
                        >
                            <i className="fa-solid fa-plus mr-2"></i> New Booking
                        </button>
                    </div>
                }
            />

            {/* Clients & Bookings List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Bookings</h3>
                    <div className="space-y-3">
                        {bookings.slice(0, 10).map(booking => {
                            const client = clients.find(c => c.id === booking.clientId);
                            return (
                                <div key={booking.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-slate-800">{client?.name}</p>
                                            <p className="text-sm text-slate-500">{client?.cnic}</p>
                                        </div>
                                        <span className="text-sm px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">
                                            Booked
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-600">
                                        <p>Plot: {booking.plotId.split('-').slice(1).join('-')}</p>
                                        <p>Amount: Rs. {booking.totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {bookings.length === 0 && (
                            <p className="text-slate-400 text-center py-8">No bookings yet</p>
                        )}
                    </div>
                </div>

                {/* All Clients */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">All Clients</h3>
                    <div className="space-y-3">
                        {clients.map(client => (
                            <div key={client.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-slate-800">{client.name}</p>
                                        <p className="text-sm text-slate-500">{client.cnic}</p>
                                        <p className="text-sm text-slate-600">{client.phone}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Delete client ${client.name}?`)) {
                                                const result = deleteClient(client.id);
                                                if (!result.success) {
                                                    alert(result.error);
                                                }
                                            }
                                        }}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        title="Delete Client"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {clients.length === 0 && (
                            <p className="text-slate-400 text-center py-8">No clients yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* New Booking Modal */}
            <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="New Booking" size="lg">
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                            <input
                                type="text"
                                value={bookingForm.clientName}
                                onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CNIC</label>
                            <input
                                type="text"
                                value={bookingForm.clientCnic}
                                onChange={(e) => setBookingForm({ ...bookingForm, clientCnic: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={bookingForm.clientPhone}
                                onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={bookingForm.clientAddress}
                                onChange={(e) => setBookingForm({ ...bookingForm, clientAddress: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Plot</label>
                        <select
                            value={bookingForm.plotId}
                            onChange={(e) => setBookingForm({ ...bookingForm, plotId: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                            <option value="">Choose a plot...</option>
                            {availablePlots.map(plot => (
                                <option key={plot.id} value={plot.id}>
                                    {plot.projectName} - Block {plot.blockName} - {plot.number} ({plot.size})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount</label>
                            <input
                                type="number"
                                value={bookingForm.totalAmount}
                                onChange={(e) => setBookingForm({ ...bookingForm, totalAmount: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Advance Payment</label>
                            <input
                                type="number"
                                value={bookingForm.advanceAmount}
                                onChange={(e) => setBookingForm({ ...bookingForm, advanceAmount: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Installments (Months)</label>
                            <input
                                type="number"
                                value={bookingForm.months}
                                onChange={(e) => setBookingForm({ ...bookingForm, months: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                            <select
                                value={bookingForm.paymentMethod}
                                onChange={(e) => setBookingForm({ ...bookingForm, paymentMethod: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            >
                                <option value="cash">Cash</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowBookingModal(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                        >
                            Create Booking
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Pay Installment Modal */}
            <PayInstallmentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
            />
        </>
    );
}

export default Clients;
