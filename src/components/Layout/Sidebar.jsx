import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useTranslation } from '../../hooks/useTranslation';

function Sidebar() {
    const company = useStore(state => state.company);
    const currentUser = useStore(state => state.currentUser);
    const logout = useStore(state => state.logout);
    const { t } = useTranslation();

    const navLinkClass = ({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-all hover:translate-x-1 ${isActive
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50'
            : 'hover:bg-slate-800 hover:text-white'
        }`;

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
            {/* Header */}
            <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                <img src={company?.logo} className="h-8 w-8 object-contain bg-white rounded" alt="Logo" />
                <span className="font-bold text-white tracking-wide truncate">{company?.name}</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3">
                <NavLink to="/dashboard" className={navLinkClass}>
                    <i className="fa-solid fa-chart-pie w-6"></i>
                    <span className="font-medium">{t('dashboard')}</span>
                </NavLink>

                {currentUser?.role === 'ceo' && (
                    <NavLink to="/projects" className={navLinkClass}>
                        <i className="fa-solid fa-city w-6"></i>
                        <span className="font-medium">{t('projects')}</span>
                    </NavLink>
                )}

                <NavLink to="/clients" className={navLinkClass}>
                    <i className="fa-solid fa-users w-6"></i>
                    <span className="font-medium">{t('clients')}</span>
                </NavLink>

                {currentUser?.role === 'ceo' && (
                    <NavLink to="/financials" className={navLinkClass}>
                        <i className="fa-solid fa-wallet w-6"></i>
                        <span className="font-medium">{t('financials')}</span>
                    </NavLink>
                )}

                <NavLink to="/printing" className={navLinkClass}>
                    <i className="fa-solid fa-print w-6"></i>
                    <span className="font-medium">{t('printing')}</span>
                </NavLink>

                <NavLink to="/settings" className={navLinkClass}>
                    <i className="fa-solid fa-gear w-6"></i>
                    <span className="font-medium">{t('settings')}</span>
                </NavLink>
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                        {currentUser?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{currentUser?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                >
                    <i className="fa-solid fa-sign-out-alt mr-2"></i> {t('logout')}
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
