import { useState } from 'react';
import { useStore } from '../store/useStore';
import Header from '../components/Layout/Header';

function Settings() {
    const company = useStore(state => state.company);
    const setCompanyDetails = useStore(state => state.setCompanyDetails);
    const users = useStore(state => state.users);
    const updatePassword = useStore(state => state.updatePassword);

    // Initialize form with company data
    const [formData, setFormData] = useState({
        name: company?.name || '',
        email: company?.email || '',
        phone: company?.phone || '',
        logo: company?.logo || ''
    });

    const [passwords, setPasswords] = useState({
        ceo: '',
        accountant: ''
    });

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newLogo = event.target.result;
                setFormData(prev => ({ ...prev, logo: newLogo }));
                setCompanyDetails({ ...formData, logo: newLogo }); // Auto-save logo
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateInfo = () => {
        setCompanyDetails(formData);
        alert('Company details updated!');
    };

    const handleUpdatePassword = (role) => {
        if (!passwords[role]) {
            alert('Please enter a new password');
            return;
        }
        updatePassword(role, passwords[role]);
        alert('Password updated successfully!');
        setPasswords({ ...passwords, [role]: '' });
    };

    return (
        <>
            <Header title="Settings" subtitle="Manage your account and system preferences" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Information */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Company Information</h3>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                {formData.logo ? (
                                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <i className="fa-solid fa-building text-slate-300 text-2xl"></i>
                                )}
                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                    <i className="fa-solid fa-camera text-white"></i>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                </label>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800">Company Logo</h4>
                                <p className="text-xs text-slate-500">Click image to update</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handleUpdateInfo}
                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Password Management */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Password Management</h3>

                    <div className="space-y-6">
                        {/* CEO Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CEO Password</label>
                            <div className="flex space-x-2">
                                <input
                                    type="password"
                                    value={passwords.ceo}
                                    onChange={(e) => setPasswords({ ...passwords, ceo: e.target.value })}
                                    placeholder="New password"
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                                <button
                                    onClick={() => handleUpdatePassword('ceo')}
                                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                                >
                                    Update
                                </button>
                            </div>
                        </div>

                        {/* Accountant Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Accountant Password</label>
                            <div className="flex space-x-2">
                                <input
                                    type="password"
                                    value={passwords.accountant}
                                    onChange={(e) => setPasswords({ ...passwords, accountant: e.target.value })}
                                    placeholder="New password"
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                                <button
                                    onClick={() => handleUpdatePassword('accountant')}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-600">
                            <i className="fa-solid fa-info-circle mr-1"></i>
                            Default password for both accounts is <strong>1234</strong>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;
