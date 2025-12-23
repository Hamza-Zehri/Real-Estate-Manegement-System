import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Modal from '../components/Modal';

function Login() {
    const navigate = useNavigate();
    const company = useStore(state => state.company);
    const login = useStore(state => state.login);
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setShowModal(true);
        setError('');
        setPassword('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const result = login(selectedRole, password);
        if (result.success) {
            setShowModal(false);
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-64 bg-brand-600 transform -skew-y-6 origin-top-left z-0"></div>

            <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
                <div className="text-center mb-8">
                    <img src={company?.logo} alt="Logo" className="h-12 mx-auto mb-4 object-contain" />
                    <h2 className="text-xl font-bold text-slate-800">{company?.name}</h2>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">System Login</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleRoleSelect('ceo')}
                        className="group w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center transition-colors">
                            <i className="fa-solid fa-user-tie"></i>
                        </div>
                        <div className="ml-4 text-left">
                            <p className="font-semibold text-slate-800">CEO / Director</p>
                            <p className="text-xs text-slate-500">Full Access, Financials & Admin</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect('accountant')}
                        className="group w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-colors">
                            <i className="fa-solid fa-file-invoice-dollar"></i>
                        </div>
                        <div className="ml-4 text-left">
                            <p className="font-semibold text-slate-800">Accountant</p>
                            <p className="text-xs text-slate-500">Bookings, Payments & Receipts</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Password Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Enter Password">
                <p className="text-sm text-slate-500 mb-4">
                    Please enter your password to continue as {selectedRole?.toUpperCase()}.
                </p>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none mb-4"
                        placeholder="Password"
                    />
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Login;
