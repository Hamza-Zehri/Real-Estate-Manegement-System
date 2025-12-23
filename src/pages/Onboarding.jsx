import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

function Onboarding() {
    const navigate = useNavigate();
    const setCompanyDetails = useStore(state => state.setCompanyDetails);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        email: '',
        phone: ''
    });

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData({ ...formData, logo: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const details = {
            ...formData,
            logo: formData.logo || 'https://via.placeholder.com/150'
        };
        setCompanyDetails(details);
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-600 text-white rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                        <i className="fa-solid fa-building"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome</h1>
                    <p className="text-slate-500">Let's set up your Real Estate System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                            placeholder="e.g. Prestige Estates"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Logo</label>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                    {formData.logo ? (
                                        <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <i className="fa-solid fa-image text-slate-300 text-2xl"></i>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Recommended: Square PNG or JPG</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-brand-500/30"
                    >
                        Save & Continue
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Onboarding;
