import { useState } from 'react';
import { useStore } from '../store/useStore';
import Modal from './Modal';

function PlotDetailsModal({ plotId, onClose }) {
    const bookings = useStore(state => state.bookings);
    const clients = useStore(state => state.clients);
    const transactions = useStore(state => state.transactions);
    const documents = useStore(state => state.documents);
    const addDocument = useStore(state => state.addDocument);
    const deleteDocument = useStore(state => state.deleteDocument);
    const transferPlot = useStore(state => state.transferPlot);
    const addClient = useStore(state => state.addClient);

    const [isTransferring, setIsTransferring] = useState(false);
    const [targetClientId, setTargetClientId] = useState('');
    const [isNewClient, setIsNewClient] = useState(false);
    const [newClientForm, setNewClientForm] = useState({
        name: '',
        cnic: '',
        phone: '',
        address: ''
    });

    const booking = bookings.find(b => b.plotId === plotId);
    if (!booking) return null;

    const client = clients.find(c => c.id === booking.clientId);
    const plotTransactions = transactions.filter(t => t.bookingId === booking.id);
    const totalPaid = plotTransactions.reduce((sum, t) => sum + t.amount, 0);
    const plotDocs = documents.filter(d => d.plotId === plotId);

    // Generate installment schedule
    const schedule = [];
    const remaining = booking.totalAmount - booking.advanceAmount;
    const monthly = remaining / booking.months;
    let currentDate = new Date(booking.date);

    schedule.push({
        no: 'Advance',
        date: booking.date,
        amount: booking.advanceAmount,
        paid: true
    });

    for (let i = 1; i <= booking.months; i++) {
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
        const dueSoFar = booking.advanceAmount + (monthly * i);
        const isPaid = totalPaid >= dueSoFar;

        schedule.push({
            no: i,
            date: currentDate.toISOString(),
            amount: monthly,
            paid: isPaid
        });
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                addDocument(plotId, file.name, event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="lg">
            <div className="max-h-[85vh] overflow-y-auto pr-2">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            Plot Details: {plotId.split('-').slice(1).join('-')}
                        </h3>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold uppercase tracking-wide">
                            Booked
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-center mb-2 border-b pb-1">
                            <h4 className="font-bold text-slate-700">Client Info</h4>
                            {!isTransferring && (
                                <button
                                    onClick={() => setIsTransferring(true)}
                                    className="text-xs bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded text-slate-700 transition"
                                >
                                    Transfer
                                </button>
                            )}
                        </div>

                        {isTransferring ? (
                            <div className="space-y-3">
                                <div className="flex space-x-4 border-b pb-2 mb-2">
                                    <button
                                        onClick={() => setIsNewClient(false)}
                                        className={`text-sm font-medium pb-1 ${!isNewClient ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}
                                    >
                                        Existing Client
                                    </button>
                                    <button
                                        onClick={() => setIsNewClient(true)}
                                        className={`text-sm font-medium pb-1 ${isNewClient ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}
                                    >
                                        New Client
                                    </button>
                                </div>

                                {!isNewClient ? (
                                    <select
                                        value={targetClientId}
                                        onChange={(e) => setTargetClientId(e.target.value)}
                                        className="w-full text-sm border rounded px-2 py-1"
                                    >
                                        <option value="">Select Client...</option>
                                        {clients.filter(c => c.id !== client?.id).map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.cnic})</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Client Name"
                                            value={newClientForm.name}
                                            onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                                            className="w-full text-sm border rounded px-2 py-1"
                                        />
                                        <input
                                            type="text"
                                            placeholder="CNIC"
                                            value={newClientForm.cnic}
                                            onChange={(e) => setNewClientForm({ ...newClientForm, cnic: e.target.value })}
                                            className="w-full text-sm border rounded px-2 py-1"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="tel"
                                                placeholder="Phone"
                                                value={newClientForm.phone}
                                                onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                                                className="w-full text-sm border rounded px-2 py-1"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Address"
                                                value={newClientForm.address}
                                                onChange={(e) => setNewClientForm({ ...newClientForm, address: e.target.value })}
                                                className="w-full text-sm border rounded px-2 py-1"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex space-x-2 pt-2">
                                    <button
                                        onClick={() => {
                                            if (isNewClient) {
                                                if (!newClientForm.name || !newClientForm.cnic) {
                                                    alert('Please fill at least Name and CNIC');
                                                    return;
                                                }
                                                if (confirm('Create new client and transfer plot?')) {
                                                    const newClient = addClient(newClientForm);
                                                    transferPlot(booking.id, newClient.id);
                                                    setIsTransferring(false);
                                                    setNewClientForm({ name: '', cnic: '', phone: '', address: '' });
                                                }
                                            } else {
                                                if (targetClientId) {
                                                    if (confirm('Transfer this plot ownership? Payment history will remain attached to this booking.')) {
                                                        transferPlot(booking.id, targetClientId);
                                                        setIsTransferring(false);
                                                        setTargetClientId('');
                                                    }
                                                }
                                            }
                                        }}
                                        disabled={!isNewClient && !targetClientId}
                                        className="flex-1 bg-brand-600 text-white text-xs py-1 rounded hover:bg-brand-700 disabled:opacity-50"
                                    >
                                        Confirm Transfer
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsTransferring(false);
                                            setTargetClientId('');
                                            setIsNewClient(false);
                                        }}
                                        className="flex-1 bg-slate-200 text-slate-700 text-xs py-1 rounded hover:bg-slate-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm"><span className="text-slate-500">Name:</span> {client?.name}</p>
                                <p className="text-sm"><span className="text-slate-500">CNIC:</span> {client?.cnic}</p>
                                <p className="text-sm"><span className="text-slate-500">Phone:</span> {client?.phone}</p>
                            </>
                        )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-slate-700 mb-2 border-b pb-1">Financials</h4>
                        <p className="text-sm flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">Rs. {booking.totalAmount.toLocaleString()}</span>
                        </p>
                        <p className="text-sm flex justify-between">
                            <span>Paid:</span>
                            <span className="text-emerald-600 font-medium">Rs. {totalPaid.toLocaleString()}</span>
                        </p>
                        <p className="text-sm flex justify-between">
                            <span>Balance:</span>
                            <span className="text-red-600 font-medium">Rs. {(booking.totalAmount - totalPaid).toLocaleString()}</span>
                        </p>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="mb-6">
                    <h4 className="font-bold text-slate-800 mb-2">Documents</h4>
                    <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-100 transition cursor-pointer">
                        <label className="cursor-pointer">
                            <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-2"></i>
                            <p className="text-sm text-slate-500">Click to upload documents</p>
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                        </label>
                    </div>

                    <div className="mt-2 space-y-2">
                        {plotDocs.map(doc => {
                            const fileExt = doc.filename.split('.').pop().toLowerCase();
                            let icon = 'fa-file';
                            let iconColor = 'text-blue-500';

                            if (fileExt === 'pdf') { icon = 'fa-file-pdf'; iconColor = 'text-red-500'; }
                            else if (['jpg', 'jpeg', 'png'].includes(fileExt)) { icon = 'fa-file-image'; iconColor = 'text-green-500'; }
                            else if (['doc', 'docx'].includes(fileExt)) { icon = 'fa-file-word'; iconColor = 'text-blue-600'; }

                            return (
                                <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-sm">
                                    <span className="flex items-center flex-1">
                                        <i className={`fa-solid ${icon} ${iconColor} mr-2`}></i> {doc.filename}
                                    </span>
                                    <div className="flex space-x-2">
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const handleViewDocument = () => {
                                                    try {
                                                        const dataURI = doc.data;
                                                        if (!dataURI) return;

                                                        // If it's not a data URL, just open it
                                                        if (!dataURI.startsWith('data:')) {
                                                            window.open(dataURI, '_blank');
                                                            return;
                                                        }

                                                        const byteString = atob(dataURI.split(',')[1]);
                                                        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                                                        const ab = new ArrayBuffer(byteString.length);
                                                        const ia = new Uint8Array(ab);

                                                        for (let i = 0; i < byteString.length; i++) {
                                                            ia[i] = byteString.charCodeAt(i);
                                                        }

                                                        const blob = new Blob([ab], { type: mimeString });
                                                        const url = URL.createObjectURL(blob);
                                                        window.open(url, '_blank');

                                                        // Revoke the object URL after a delay to allow time for the window to open/load
                                                        setTimeout(() => window.URL.revokeObjectURL(url), 1000 * 60);
                                                    } catch (error) {
                                                        console.error('Error opening document:', error);
                                                        // Fallback attempt
                                                        window.open(doc.data, '_blank');
                                                    }
                                                };
                                                handleViewDocument();
                                            }}
                                            className="text-brand-600 hover:text-brand-800 px-2"
                                        >
                                            <i className="fa-solid fa-eye"></i> View
                                        </a>
                                        <button
                                            onClick={() => deleteDocument(doc.id)}
                                            className="text-slate-400 hover:text-red-500"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {plotDocs.length === 0 && (
                            <p className="text-slate-400 text-center py-4 text-sm">No documents uploaded yet.</p>
                        )}
                    </div>
                </div>

                {/* Payment Schedule */}
                <div>
                    <h4 className="font-bold text-slate-800 mb-2">Payment Plan</h4>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Due Date</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                    <th className="px-4 py-2 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {schedule.map((s, idx) => (
                                    <tr key={idx} className={s.paid ? 'bg-emerald-50/50' : ''}>
                                        <td className="px-4 py-2 font-medium">{s.no}</td>
                                        <td className="px-4 py-2">{new Date(s.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 text-right">Rs. {s.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                        <td className="px-4 py-2 text-center">
                                            {s.paid
                                                ? <i className="fa-solid fa-circle-check text-emerald-500"></i>
                                                : <i className="fa-regular fa-clock text-slate-300"></i>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default PlotDetailsModal;
