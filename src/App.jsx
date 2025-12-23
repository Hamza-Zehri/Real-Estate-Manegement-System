import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useTranslation } from './hooks/useTranslation';
import { useEffect } from 'react';

// Pages
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Clients from './pages/Clients';
import PrintingCenter from './pages/PrintingCenter';
import Settings from './pages/Settings';
import Financials from './pages/Financials';

// Layout
import Shell from './components/Layout/Shell';

function App() {
    const company = useStore(state => state.company);
    const currentUser = useStore(state => state.currentUser);
    const lang = useTranslation(state => state.lang);

    // Set document direction based on language
    useEffect(() => {
        document.body.dir = lang === 'ur' ? 'rtl' : 'ltr';
    }, [lang]);

    // Route protection
    const ProtectedRoute = ({ children }) => {
        if (!company) return <Navigate to="/onboarding" />;
        if (!currentUser) return <Navigate to="/login" />;
        return children;
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/onboarding" element={!company ? <Onboarding /> : <Navigate to={currentUser ? "/dashboard" : "/login"} />} />
                <Route path="/login" element={company && !currentUser ? <Login /> : <Navigate to={company ? "/dashboard" : "/onboarding"} />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Shell /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projects/:projectId" element={<ProjectDetails />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="financials" element={<Financials />} />
                    <Route path="printing" element={<PrintingCenter />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
