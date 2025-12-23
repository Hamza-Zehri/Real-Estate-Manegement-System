import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import Header from '../components/Layout/Header';

function Dashboard() {
    const currentUser = useStore(state => state.currentUser);
    const getStats = useStore(state => state.getStats);
    const { t } = useTranslation();

    const stats = getStats();

    return (
        <>
            <Header
                title={t('overview')}
                subtitle={`${t('welcome')}, ${currentUser?.name}`}
            />

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-building"></i>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">{stats.totalProjects}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t('total_projects')}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">Clients</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">{stats.totalClients}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t('total_bookings')}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-money-bill-wave"></i>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">Financials</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">Rs. {stats.totalCollected.toLocaleString()}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t('collected')}</p>
                </div>
            </div>

            {/* Activity Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-96 flex items-center justify-center">
                <p className="text-slate-400">Activity Chart Placeholder</p>
            </div>
        </>
    );
}

export default Dashboard;
