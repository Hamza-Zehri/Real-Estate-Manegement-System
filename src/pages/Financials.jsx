import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import Header from '../components/Layout/Header';

function Financials() {
    const bookings = useStore(state => state.bookings);
    const transactions = useStore(state => state.transactions);
    const { t } = useTranslation();

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalPending = bookings.reduce((sum, b) => {
        const paid = transactions
            .filter(t => t.bookingId === b.id)
            .reduce((s, t) => s + t.amount, 0);
        return sum + (b.totalAmount - paid);
    }, 0);

    return (
        <>
            <Header title={t('financials')} subtitle="Financial overview and reports" />

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-arrow-trend-up"></i>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 rounded text-emerald-700">Revenue</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">Rs. {totalRevenue.toLocaleString()}</h3>
                    <p className="text-slate-500 text-sm mt-1">Total Collected</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-clock"></i>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-amber-100 rounded text-amber-700">Pending</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">Rs. {totalPending.toLocaleString()}</h3>
                    <p className="text-slate-500 text-sm mt-1">Remaining Payments</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-file-invoice-dollar"></i>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">{bookings.length}</h3>
                    <p className="text-slate-500 text-sm mt-1">Active Bookings</p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {transactions.slice(0, 10).map(transaction => (
                        <div key={transaction.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                            <div>
                                <p className="font-semibold text-slate-800 capitalize">{transaction.type}</p>
                                <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-emerald-600">Rs. {transaction.amount.toLocaleString()}</p>
                                <p className="text-xs text-slate-500 capitalize">{transaction.method}</p>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <p className="text-slate-400 text-center py-8">No transactions yet</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Financials;
