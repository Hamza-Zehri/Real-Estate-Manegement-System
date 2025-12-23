import { useTranslation } from '../../hooks/useTranslation';

function Header({ title, subtitle, actions }) {
    const { lang, toggleLanguage } = useTranslation();

    return (
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                {subtitle && <p className="text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex space-x-4 items-center">
                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold"
                >
                    {lang === 'en' ? 'UR' : 'EN'}
                </button>

                {/* Custom Actions */}
                {actions}
            </div>
        </header>
    );
}

export default Header;
