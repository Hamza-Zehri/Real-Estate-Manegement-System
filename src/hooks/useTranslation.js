import { create } from 'zustand';

const translations = {
    en: {
        dashboard: 'Dashboard',
        projects: 'Projects & Inventory',
        clients: 'Clients & Bookings',
        financials: 'Financial Reports',
        printing: 'Printing Center',
        logout: 'Logout',
        overview: 'Overview',
        welcome: 'Welcome back',
        total_projects: 'Active Projects',
        total_bookings: 'Total Bookings',
        collected: 'Collected Revenue',
        settings: 'Settings'
    },
    ur: {
        dashboard: 'ڈیش بورڈ',
        projects: 'پروجیکٹس اور انونٹری',
        clients: 'کلائنٹس اور بکنگ',
        financials: 'مالیاتی رپورٹس',
        printing: 'پرنٹنگ سینٹر',
        logout: 'لاگ آؤٹ',
        overview: 'جائزہ',
        welcome: 'خوش آمدید',
        total_projects: 'فعال پروجیکٹس',
        total_bookings: 'کل بکنگ',
        collected: 'کل آمدنی',
        settings: 'ترتیبات'
    }
};

export const useTranslation = create((set, get) => ({
    lang: 'en',

    t: (key) => {
        const currentLang = get().lang;
        return translations[currentLang][key] || key;
    },

    toggleLanguage: () => {
        set(state => ({ lang: state.lang === 'en' ? 'ur' : 'en' }));
    },

    setLanguage: (lang) => set({ lang })
}));
