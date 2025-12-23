// UI - User Interface

const app = document.getElementById('app');

const translations = {
    'en': {
        'dashboard': 'Dashboard',
        'projects': 'Projects & Inventory',
        'clients': 'Clients & Bookings',
        'financials': 'Financial Reports',
        'printing': 'Printing Center',
        'logout': 'Logout',
        'overview': 'Overview',
        'welcome': 'Welcome back',
        'total_projects': 'Active Projects',
        'total_bookings': 'Total Bookings',
        'total_bookings': 'Total Bookings',
        'collected': 'Collected Revenue',
        'settings': 'Settings'
    },
    'ur': {
        'dashboard': 'ڈیش بورڈ',
        'projects': 'پروجیکٹس اور انونٹری',
        'clients': 'کلائنٹس اور بکنگ',
        'financials': 'مالیاتی رپورٹس',
        'printing': 'پرنٹنگ سینٹر',
        'logout': 'لاگ آؤٹ',
        'overview': 'جائزہ',
        'welcome': 'خوش آمدید',
        'total_projects': 'فعال پروجیکٹس',
        'total_bookings': 'کل بکنگ',
        'total_bookings': 'کل بکنگ',
        'collected': 'کل آمدنی',
        'settings': 'ترتیبات'
    }
};

window.UI = {
    currentLang: 'en',

    t(key) {
        return translations[this.currentLang][key] || key;
    },

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'ur' : 'en';
        document.body.dir = this.currentLang === 'ur' ? 'rtl' : 'ltr';

        // Re-render current view if possible, or just Dashboard for simplicity
        this.renderDashboard();
    },

    // --- Utilities ---
    clear() {
        app.innerHTML = '';
    },

    createElement(tag, classes = '', content = '') {
        const el = document.createElement(tag);
        if (classes) el.className = classes;
        if (content) el.innerHTML = content;
        return el;
    },

    // --- Views ---

    renderOnboarding() {
        this.clear();
        const container = this.createElement('div', 'min-h-screen flex items-center justify-center bg-slate-100');

        const card = this.createElement('div', 'bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up');
        card.innerHTML = `
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-brand-600 text-white rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                    <i class="fa-solid fa-building"></i>
                </div>
                <h1 class="text-2xl font-bold text-slate-800">Welcome</h1>
                <p class="text-slate-500">Let's set up your Real Estate System</p>
            </div>
            
            <form id="onboarding-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input type="text" name="name" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="e.g. Prestige Estates">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Company Logo URL</label>
                    <input type="url" name="logo" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="https://...">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" name="email" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                        <input type="tel" name="phone" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition">
                    </div>
                </div>
                <button type="submit" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-brand-500/30">
                    Save & Continue
                </button>
            </form>
        `;

        container.appendChild(card);
        app.appendChild(container);

        document.getElementById('onboarding-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const details = {
                name: formData.get('name'),
                logo: formData.get('logo') || 'https://via.placeholder.com/150',
                email: formData.get('email'),
                phone: formData.get('phone')
            };
            Store.setCompanyDetails(details);
            this.renderLogin();
        });
    },

    renderLogin() {
        this.clear();
        const company = Store.getCompany();

        const container = this.createElement('div', 'min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden');

        // Background decorative elements
        container.innerHTML = `
            <div class="absolute top-0 left-0 w-full h-64 bg-brand-600 transform -skew-y-6 origin-top-left z-0"></div>
            <div class="relative z-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
                <div class="text-center mb-8">
                    <img src="${company.logo}" alt="Logo" class="h-12 mx-auto mb-4 object-contain">
                    <h2 class="text-xl font-bold text-slate-800">${company.name}</h2>
                    <p class="text-xs text-slate-400 uppercase tracking-wider mt-1">System Login</p>
                </div>

                <div class="space-y-4">
                    <button id="login-ceo" class="group w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all cursor-pointer">
                        <div class="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center transition-colors">
                            <i class="fa-solid fa-user-tie"></i>
                        </div>
                        <div class="ml-4 text-left">
                            <p class="font-semibold text-slate-800">CEO / Director</p>
                            <p class="text-xs text-slate-500">Full Access, Financials & Admin</p>
                        </div>
                    </button>

                    <button id="login-acc" class="group w-full flex items-center p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer">
                        <div class="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-colors">
                            <i class="fa-solid fa-file-invoice-dollar"></i>
                        </div>
                        <div class="ml-4 text-left">
                            <p class="font-semibold text-slate-800">Accountant</p>
                            <p class="text-xs text-slate-500">Bookings, Payments & Receipts</p>
                        </div>
                    </button>
                </div>
            </div>
        `;

        app.appendChild(container);

        // Add modal container for password prompt
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        modalContainer.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm hidden items-center justify-center z-50';
        app.appendChild(modalContainer);

        const handleLogin = (role) => {
            this.showModal(`
                <h3 class="text-xl font-bold mb-4 text-slate-800">Enter Password</h3>
                <p class="text-sm text-slate-500 mb-4">Please enter your password to continue as ${role.toUpperCase()}.</p>
                <form id="form-login-password">
                    <input type="password" name="password" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none mb-4" placeholder="Password">
                    <div class="flex justify-end space-x-3">
                        <button type="button" class="btn-close-modal px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Login</button>
                    </div>
                </form>
            `, () => {
                document.getElementById('form-login-password').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const password = e.target.password.value;
                    const result = Store.login(role, password);

                    if (result.success) {
                        this.closeModal();
                        this.renderDashboard();
                    } else {
                        alert(result.error);
                    }
                });
            });
        };

        document.getElementById('login-ceo').addEventListener('click', () => handleLogin('ceo'));
        document.getElementById('login-acc').addEventListener('click', () => handleLogin('accountant'));
    },

    renderDashboard() {
        this.clear();
        const user = Store.getCurrentUser();
        const company = Store.getCompany();

        // Main shell
        const shell = this.createElement('div', 'flex h-screen bg-slate-50');

        // Sidebar (Simplified)
        const sidebar = this.createElement('aside', 'w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300');
        sidebar.innerHTML = `
            <div class="p-6 flex items-center space-x-3 border-b border-slate-800">
                <img src="${company.logo}" class="h-8 w-8 object-contain bg-white rounded">
                <span class="font-bold text-white tracking-wide truncate">${company.name}</span>
            </div>
            
            <nav class="flex-1 overflow-y-auto py-6 space-y-1 px-3">
                <a href="#" id="nav-dashboard" class="flex items-center px-4 py-3 bg-brand-600 text-white rounded-lg shadow-lg shadow-brand-900/50 transition-all hover:translate-x-1">
                    <i class="fa-solid fa-chart-pie w-6"></i>
                    <span class="font-medium">Dashboard</span>
                </a>
                ${user.role === 'ceo' ? `
                <a href="#" id="nav-projects" class="flex items-center px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors hover:translate-x-1">
                    <i class="fa-solid fa-city w-6"></i>
                    <span class="font-medium">Projects & Inventory</span>
                </a>
                ` : ''}
                <a href="#" id="nav-clients" class="flex items-center px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors hover:translate-x-1">
                    <i class="fa-solid fa-users w-6"></i>
                    <span class="font-medium">Clients & Bookings</span>
                </a>
                ${user.role === 'ceo' ? `
                <a href="#" class="flex items-center px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                    <i class="fa-solid fa-wallet w-6"></i>
                    <span class="font-medium">Financial Reports</span>
                </a>
                ` : ''}
                <a href="#" id="nav-printing" class="flex items-center px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors hover:translate-x-1">
                    <i class="fa-solid fa-print w-6"></i>
                    <span class="font-medium">${this.t('printing')}</span>
                </a>
                <a href="#" id="nav-settings" class="flex items-center px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors hover:translate-x-1">
                    <i class="fa-solid fa-gear w-6"></i>
                    <span class="font-medium">${this.t('settings')}</span>
                </a>
            </nav>

            <div class="p-4 border-t border-slate-800">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                        ${user.name.charAt(0)}
                    </div>
                    <div>
                        <p class="text-sm font-medium text-white">${user.name}</p>
                        <p class="text-xs text-slate-500 capitalize">${user.role}</p>
                    </div>
                </div>
                <button id="logout-btn" class="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-sm hover:bg-slate-800 transition-colors">
                    <i class="fa-solid fa-sign-out-alt mr-2"></i> Logout
                </button>
            </div>
        `;

        // Main Content
        const main = this.createElement('main', 'flex-1 overflow-y-auto bg-slate-50 p-8');
        main.innerHTML = `
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">Overview</h1>
                    <p class="text-slate-500">Welcome back, ${user.name}</p>
                </div>
                <div class="flex space-x-4">
                   <!-- Language Toggle / Notifications -->
                   <button id="btn-lang-toggle" class="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold">
                        ${this.currentLang === 'en' ? 'UR' : 'EN'}
                   </button>
                </div>
            </header>

            <!-- Dashboard Widgets Pattern -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-building"></i>
                        </div>
                        <span class="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">Total</span>
                    </div>
                    <h3 class="text-3xl font-bold text-slate-800">${Store.getStats().totalProjects}</h3>
                    <p class="text-slate-500 text-sm mt-1">${this.t('total_projects')}</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <span class="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">Clients</span>
                    </div>
                    <h3 class="text-3xl font-bold text-slate-800">${Store.getStats().totalClients}</h3>
                    <p class="text-slate-500 text-sm mt-1">${this.t('total_bookings')}</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                            <i class="fa-solid fa-money-bill-wave"></i>
                        </div>
                        <span class="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">Financials</span>
                    </div>
                    <h3 class="text-3xl font-bold text-slate-800">Rs. ${Store.getStats().totalCollected.toLocaleString()}</h3>
                    <p class="text-slate-500 text-sm mt-1">${this.t('collected')}</p>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-100 h-96 flex items-center justify-center">
                <p class="text-slate-400">Activity Chart Placeholder</p>
            </div>
        `;

        shell.appendChild(sidebar);
        shell.appendChild(main);
        app.appendChild(shell);

        // Events
        document.getElementById('logout-btn').addEventListener('click', () => {
            Store.logout();
            this.renderLogin();
        });

        document.getElementById('btn-lang-toggle').addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Navigation Events
        const navDashboard = document.getElementById('nav-dashboard');
        const navProjects = document.getElementById('nav-projects');

        if (navDashboard) {
            navDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderDashboard(); // Re-render self (or just content)
            });
        }

        if (navProjects) {
            navProjects.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderProjects();
            });
        }

        const navClients = document.getElementById('nav-clients');
        if (navClients) {
            navClients.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderClients();
            });
        }

        const navPrinting = document.getElementById('nav-printing');
        if (navPrinting) {
            navPrinting.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderPrintingCenter();
            });
        }

        const navFinancials = document.getElementById('nav-financials');
        if (navFinancials) {
            navFinancials.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderFinancials();
            });
        }

        const navSettings = document.getElementById('nav-settings');
        if (navSettings) {
            navSettings.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderSettings();
            });
        }
    },

    // --- Project Management Views ---

    renderProjects() {
        const projects = Store.getProjects();
        // We reuse the shell structure but replace the main content. 
        // For simplicity in this vanilla implementation, we'll re-render the whole dashboard and navigate, 
        // OR we can just swap the content if we refactor. 
        // Let's refactor renderDashboard to be just "renderShell" and "renderDashboardContent".
        // But for now, let's just cheat and re-render the shell with different content injection if needed, 
        // or just overlay. 
        // BETTER APPROACH: Let renderDashboard hold the state of "currentView".

        // Actually, let's just clear the "main" area.
        const main = document.querySelector('main');
        if (!main) {
            // If we are not in dashboard, go there
            this.renderDashboard();
            return;
        }

        // Highlighting Nav
        document.querySelectorAll('nav a').forEach(el => {
            el.classList.remove('bg-brand-600', 'shadow-lg', 'shadow-brand-900/50');
            el.classList.add('hover:bg-slate-800');
        });
        const navItem = document.getElementById('nav-projects');
        if (navItem) {
            navItem.classList.add('bg-brand-600', 'shadow-lg', 'shadow-brand-900/50');
            navItem.classList.remove('hover:bg-slate-800');
        }

        main.innerHTML = `
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">${this.t('projects')}</h1>
                    <p class="text-slate-500">Manage your real estate data</p>
                </div>
                <button id="btn-add-project" class="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-brand-500/30 transition flex items-center">
                    <i class="fa-solid fa-plus mr-2"></i> New Project
                </button>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${projects.map(p => `
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group relative">
                    <div class="h-32 bg-slate-100 relative">
                        <img src="https://source.unsplash.com/random/800x600/?building,house&sig=${p.id}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div class="absolute bottom-4 left-4 text-white">
                            <h3 class="text-xl font-bold">${p.name}</h3>
                            <p class="text-xs opacity-90">${p.blocks.length} Blocks</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center text-sm text-slate-500 mb-4">
                            <span><i class="fa-regular fa-calendar mr-1"></i> ${new Date(p.createdAt).toLocaleDateString()}</span>
                            <span>ID: ${p.id.substr(-4)}</span>
                        </div>
                        <button class="btn-view-project w-full py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors" data-id="${p.id}">
                            View Inventory
                        </button>
                    </div>
                </div>
                `).join('')}
                
                ${projects.length === 0 ? `
                <div class="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        <i class="fa-solid fa-layer-group"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-700">No Projects Yet</h3>
                    <p class="text-slate-500">Create your first project to get started.</p>
                </div>
                ` : ''}
            </div>
            
            <!-- Modal Container (Hidden by default) -->
            <div id="modal-container" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden items-center justify-center z-50">
                <!-- Modal Content injected here -->
            </div>
        `;

        // Event: Add Project
        document.getElementById('btn-add-project').addEventListener('click', () => {
            this.showModal(`
                <h3 class="text-xl font-bold mb-4">Create New Project</h3>
                <form id="form-create-project">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                        <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" class="btn-close-modal px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Create</button>
                    </div>
                </form>
            `, () => {
                const form = document.getElementById('form-create-project');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const name = form.name.value;
                    Store.addProject(name);
                    this.closeModal();
                    this.renderProjects();
                });
            });
        });

        // Event: View Project
        document.querySelectorAll('.btn-view-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.renderProjectDetails(id);
            });
        });
    },

    renderProjectDetails(projectId) {
        const projects = Store.getProjects();
        const project = projects.find(p => p.id === projectId);
        if (!project) return this.renderProjects();

        const main = document.querySelector('main');

        main.innerHTML = `
            <div class="flex items-center space-x-4 mb-8">
                <button id="btn-back-projects" class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">${project.name}</h1>
                    <p class="text-slate-500">Inventory Management</p>
                </div>
                <div class="flex-1"></div>
                <button id="btn-add-block" class="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-brand-500/30 transition flex items-center">
                    <i class="fa-solid fa-plus mr-2"></i> Add Block
                </button>
            </div>

            <div class="space-y-8">
                ${project.blocks.map(block => `
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="font-bold text-lg text-slate-800">Block ${block.name}</h3>
                        <span class="text-sm bg-white px-3 py-1 rounded border border-slate-200 text-slate-500">${block.plots.length} Plots</span>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            ${block.plots.map((plot, i) => {
            let statusColor = 'bg-slate-100 text-slate-600 border-slate-200 hover:border-brand-500 hover:text-brand-600'; // Available
            if (plot.status === 'booked') statusColor = 'bg-amber-50 text-amber-600 border-amber-200';
            if (plot.status === 'sold') statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-200';

            return `
                                <div class="relative group cursor-pointer border rounded-lg p-2 text-center transition-all ${statusColor} plot-item" data-id="${plot.id}" data-status="${plot.status}">
                                    <div class="text-xs font-bold mb-1">${plot.number}</div>
                                    <div class="text-[10px] opacity-70">${plot.size}</div>
                                </div>
                                `;
        }).join('')}
                        </div>
                    </div>
                </div>
                `).join('')}

                ${project.blocks.length === 0 ? `
                <div class="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <p class="text-slate-500">No blocks added yet. Create a block to generate plots.</p>
                </div>
                ` : ''}
            </div>
             <!-- Modal Container -->
            <div id="modal-container" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden items-center justify-center z-50"></div>
        `;

        document.getElementById('btn-back-projects').addEventListener('click', () => this.renderProjects());

        // Plot Click Event
        document.querySelectorAll('.plot-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const plotId = e.currentTarget.dataset.id;
                const status = e.currentTarget.dataset.status;
                if (status === 'booked' || status === 'sold') {
                    this.renderPlotDetailsModal(plotId);
                } else {
                    alert('This plot is available. Go to "Clients & Bookings" to book it.');
                }
            });
        });

        document.getElementById('btn-add-block').addEventListener('click', () => {
            this.showModal(`
                <h3 class="text-xl font-bold mb-4">Add Block to ${project.name}</h3>
                <form id="form-add-block" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Block Name (e.g., A)</label>
                        <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="A">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Number of Plots</label>
                            <input type="number" name="count" required min="1" value="20" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Plot Prefix</label>
                            <input type="text" name="prefix" required value="P" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Plot Size (Marla/SqFt)</label>
                            <input type="text" name="size" required value="5 Marla" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                        </div>
                        <div>
                             <label class="block text-sm font-medium text-slate-700 mb-1">Price per Plot</label>
                            <input type="number" name="price" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" class="btn-close-modal px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Generate Plots</button>
                    </div>
                </form>
            `, () => {
                const form = document.getElementById('form-add-block');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    Store.addBlock(
                        project.id,
                        form.name.value,
                        form.prefix.value,
                        parseInt(form.count.value),
                        form.size.value,
                        parseFloat(form.price.value)
                    );
                    this.closeModal();
                    this.renderProjectDetails(project.id);
                });
            });
        });
    },



    renderPlotDetailsModal(plotId) {
        const bookings = Store.getBookings();
        const booking = bookings.find(b => b.plotId === plotId);
        if (!booking) return;

        const client = Store.getClients().find(c => c.id === booking.clientId);
        const transactions = Store.state.transactions.filter(t => t.bookingId === booking.id);
        const totalPaid = transactions.reduce((sum, t) => sum + t.amount, 0);

        // Generate Installment Schedule (Simulated based on booking data)
        const schedule = [];
        let remaining = booking.totalAmount - booking.advanceAmount;
        const monthly = remaining / booking.months;
        let currentDate = new Date(booking.date);

        // Advance row
        schedule.push({
            no: 'Advance',
            date: booking.date,
            amount: booking.advanceAmount,
            paid: true
        });

        // Installments
        for (let i = 1; i <= booking.months; i++) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            // Simple logic: if totalPaid covers this installment
            const paidSoFar = transactions.reduce((sum, t) => sum + t.amount, 0);
            const dueSoFar = booking.advanceAmount + (monthly * i);
            const isPaid = paidSoFar >= dueSoFar;

            schedule.push({
                no: i,
                date: currentDate.toISOString(),
                amount: monthly,
                paid: isPaid
            });
        }

        this.showModal(`
            <div class="max-h-[85vh] overflow-y-auto pr-2">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-slate-800">Plot Details: ${plotId.split('-').slice(1).join('-')}</h3>
                        <span class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold uppercase tracking-wide">Booked</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 class="font-bold text-slate-700 mb-2 border-b pb-1">Client Info</h4>
                        <p class="text-sm"><span class="text-slate-500">Name:</span> ${client.name}</p>
                        <p class="text-sm"><span class="text-slate-500">CNIC:</span> ${client.cnic}</p>
                        <p class="text-sm"><span class="text-slate-500">Phone:</span> ${client.phone}</p>
                    </div>
                     <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 class="font-bold text-slate-700 mb-2 border-b pb-1">Financials</h4>
                        <p class="text-sm flex justify-between"><span>Total:</span> <span class="font-medium">Rs. ${booking.totalAmount.toLocaleString()}</span></p>
                        <p class="text-sm flex justify-between"><span>Paid:</span> <span class="text-emerald-600 font-medium">Rs. ${totalPaid.toLocaleString()}</span></p>
                        <p class="text-sm flex justify-between"><span>Balance:</span> <span class="text-red-600 font-medium">Rs. ${(booking.totalAmount - totalPaid).toLocaleString()}</span></p>
                    </div>
                </div>

                <!-- Documents Section -->
                <div class="mb-6">
                    <h4 class="font-bold text-slate-800 mb-2">Documents</h4>
                    <div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-100 transition cursor-pointer" id="area-upload">
                        <i class="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-2"></i>
                        <p class="text-sm text-slate-500">Click to upload documents</p>
                        <input type="file" class="hidden" id="inp-file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
                    </div>
                     <div id="file-list" class="mt-2 space-y-2">
                         <!-- Files will be listed here dynamically -->
                     </div>
                </div>

                <!-- Payment Schedule -->
                <div>
                     <h4 class="font-bold text-slate-800 mb-2">Payment Plan</h4>
                     <div class="border rounded-lg overflow-hidden">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-slate-100 text-slate-600">
                                <tr>
                                    <th class="px-4 py-2">#</th>
                                    <th class="px-4 py-2">Due Date</th>
                                    <th class="px-4 py-2 text-right">Amount</th>
                                    <th class="px-4 py-2 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${schedule.map(s => `
                                <tr class="${s.paid ? 'bg-emerald-50/50' : ''}">
                                    <td class="px-4 py-2 font-medium">${s.no}</td>
                                    <td class="px-4 py-2">${new Date(s.date).toLocaleDateString()}</td>
                                    <td class="px-4 py-2 text-right">Rs. ${s.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td class="px-4 py-2 text-center">
                                        ${s.paid
                ? '<i class="fa-solid fa-circle-check text-emerald-500"></i>'
                : '<i class="fa-regular fa-clock text-slate-300"></i>'}
                                    </td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                     </div>
                </div>

                <div class="flex justify-end pt-6">
                     <button type="button" class="btn-close-modal px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">Close</button>
                </div>
            </div>
        `, () => {
            // Load existing documents for this plot
            const area = document.getElementById('area-upload');
            const inp = document.getElementById('inp-file');
            const list = document.getElementById('file-list');

            // Render existing documents
            const renderDocuments = () => {
                const docs = Store.getDocumentsByPlot(plotId);
                list.innerHTML = docs.map(doc => {
                    const fileExt = doc.filename.split('.').pop().toLowerCase();
                    let icon = 'fa-file';
                    let iconColor = 'text-blue-500';

                    if (fileExt === 'pdf') { icon = 'fa-file-pdf'; iconColor = 'text-red-500'; }
                    else if (['jpg', 'jpeg', 'png'].includes(fileExt)) { icon = 'fa-file-image'; iconColor = 'text-green-500'; }
                    else if (['doc', 'docx'].includes(fileExt)) { icon = 'fa-file-word'; iconColor = 'text-blue-600'; }

                    return `
                        <div class="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-sm" data-doc-id="${doc.id}">
                            <span class="flex items-center flex-1"><i class="fa-solid ${icon} ${iconColor} mr-2"></i> ${doc.filename}</span>
                            <div class="flex space-x-2">
                                <button class="btn-view-doc text-brand-600 hover:text-brand-800 px-2" data-doc-id="${doc.id}"><i class="fa-solid fa-eye"></i> View</button>
                                <button class="btn-delete-doc text-slate-400 hover:text-red-500" data-doc-id="${doc.id}"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    `;
                }).join('') || '<p class="text-slate-400 text-center py-4 text-sm">No documents uploaded yet.</p>';
            };

            renderDocuments();

            // Upload handler
            area.addEventListener('click', () => inp.click());
            inp.addEventListener('change', () => {
                if (inp.files.length > 0) {
                    const file = inp.files[0];
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        Store.addDocument(plotId, file.name, e.target.result);
                        renderDocuments();
                        inp.value = ''; // Clear input
                    };

                    reader.readAsDataURL(file);
                }
            });

            // Event delegation for View and Delete buttons
            list.addEventListener('click', (e) => {
                const viewBtn = e.target.closest('.btn-view-doc');
                const deleteBtn = e.target.closest('.btn-delete-doc');

                if (viewBtn) {
                    const docId = viewBtn.dataset.docId;
                    const doc = Store.state.documents.find(d => d.id === docId);
                    if (doc) {
                        // Open document in new tab
                        const newWindow = window.open();
                        newWindow.document.write(`
                            <html>
                                <head><title>${doc.filename}</title></head>
                                <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f0f0f0;">
                                    ${doc.data.startsWith('data:image')
                                ? `<img src="${doc.data}" style="max-width:100%;max-height:100vh;">`
                                : `<iframe src="${doc.data}" style="width:100%;height:100vh;border:none;"></iframe>`
                            }
                                </body>
                            </html>
                        `);
                        newWindow.document.close();
                    }
                }

                if (deleteBtn) {
                    const docId = deleteBtn.dataset.docId;
                    if (confirm('Are you sure you want to delete this document?')) {
                        Store.deleteDocument(docId);
                        renderDocuments();
                    }
                }
            });
        });
    },

    // --- Sales & Bookings Views ---

    renderClients() {
        const bookings = Store.getBookings();
        const clients = Store.getClients();

        const main = document.querySelector('main');
        if (!main) return this.renderDashboard();

        // Highlight Nav
        document.querySelectorAll('nav a').forEach(el => el.classList.remove('bg-brand-600', 'shadow-lg', 'shadow-brand-900/50'));
        document.getElementById('nav-clients')?.classList.add('bg-brand-600', 'shadow-lg', 'shadow-brand-900/50');

        main.innerHTML = `
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">${this.t('clients')}</h1>
                    <p class="text-slate-500">Manage sales and installments</p>
                </div>
                <button id="btn-new-booking" class="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-brand-500/30 transition flex items-center">
                    <i class="fa-solid fa-plus mr-2"></i> New Booking
                </button>
            </header>

            <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                <th class="px-6 py-4 font-semibold">Client</th>
                                <th class="px-6 py-4 font-semibold">Plot Info</th>
                                <th class="px-6 py-4 font-semibold">Booking Date</th>
                                <th class="px-6 py-4 font-semibold">Total Price</th>
                                <th class="px-6 py-4 font-semibold">Status</th>
                                <th class="px-6 py-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-slate-100">
                            ${bookings.map(b => {
            const client = clients.find(c => c.id === b.clientId);
            // Find Plot Name (requires lookup, simple version here)
            return `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-slate-800">${client ? client.name : 'Unknown'}</div>
                                        <div class="text-xs text-slate-500">${client ? client.phone : ''}</div>
                                    </td>
                                    <td class="px-6 py-4 text-slate-600">ID: ${b.plotId}</td>
                                    <td class="px-6 py-4 text-slate-600">${new Date(b.date).toLocaleDateString()}</td>
                                    <td class="px-6 py-4 font-medium text-slate-800">Rs. ${b.totalAmount.toLocaleString()}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <button class="text-brand-600 hover:text-brand-800 font-medium btn-print-receipt" data-id="${b.id}">Receipt</button>
                                    </td>
                                </tr>
                                `;
        }).join('')}
                             ${bookings.length === 0 ? `
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                                        No bookings found. Start a new booking.
                                    </td>
                                </tr>
                            ` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
             <!-- Modal Container -->
            <div id="modal-container" class="fixed inset-0 bg-black/50 backdrop-blur-sm hidden items-center justify-center z-50"></div>
        `;

        document.getElementById('btn-new-booking').addEventListener('click', () => {
            this.renderNewBooking();
        });

        document.querySelectorAll('.btn-print-receipt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.currentTarget.dataset.id; // Use currentTarget for robustness
                this.printReceipt(id);
            });
        });
    },

    renderNewBooking() {
        const projects = Store.getProjects();

        this.showModal(`
            <div class="max-h-[85vh] overflow-y-auto pr-2">
                <h3 class="text-xl font-bold mb-6 flex items-center">
                    <span class="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm mr-3">1</span>
                    New Booking Wizard
                </h3>
                
                <form id="form-booking" class="space-y-6">
                    <!-- Step 1: Selection -->
                    <div class="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 class="font-semibold text-slate-700">Property Selection</h4>
                        <div class="grid grid-cols-3 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Project</label>
                                <select name="project" id="sel-project" class="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                                    <option value="">Select Project</option>
                                    ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Block</label>
                                <select name="block" id="sel-block" class="w-full px-3 py-2 border rounded-lg text-sm bg-white" disabled>
                                    <option value="">Select Block</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Plot (Available)</label>
                                <select name="plot" id="sel-plot" class="w-full px-3 py-2 border rounded-lg text-sm bg-white" disabled>
                                    <option value="">Select Plot</option>
                                </select>
                            </div>
                        </div>
                        <div id="plot-details" class="hidden mt-2 text-xs text-brand-600 font-medium">
                            Price: Rs. <span id="disp-price">0</span> | Size: <span id="disp-size">-</span>
                        </div>
                    </div>

                    <!-- Step 2: Client -->
                    <div class="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 class="font-semibold text-slate-700">Client Information</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <input type="text" name="clientName" placeholder="Full Name" required class="w-full px-3 py-2 border rounded-lg text-sm">
                            <input type="text" name="cnic" placeholder="CNIC / ID" required class="w-full px-3 py-2 border rounded-lg text-sm">
                            <input type="tel" name="phone" placeholder="Phone" required class="w-full px-3 py-2 border rounded-lg text-sm">
                            <input type="text" name="address" placeholder="Address" class="w-full px-3 py-2 border rounded-lg text-sm">
                        </div>
                    </div>

                    <!-- Step 3: Payment Plan -->
                    <div class="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                         <h4 class="font-semibold text-slate-700">Payment Plan</h4>
                         <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Total Price</label>
                                <input type="number" name="total" id="inp-total" readonly class="w-full px-3 py-2 border rounded-lg text-sm bg-slate-100 font-bold text-slate-700">
                            </div>
                             <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Advance Amount</label>
                                <input type="number" name="advance" id="inp-advance" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Installments (Months)</label>
                                <input type="number" name="months" id="inp-months" value="12" class="w-full px-3 py-2 border rounded-lg text-sm">
                            </div>
                             <div>
                                <label class="block text-xs font-medium text-slate-500 mb-1">Monthly Amount</label>
                                <input type="text" id="disp-monthly" readonly class="w-full px-3 py-2 border rounded-lg text-sm bg-slate-100 text-slate-500">
                            </div>
                         </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" class="btn-close-modal px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium">Confirm Booking</button>
                    </div>
                </form>
            </div>
        `, () => {
            // --- Logic for Wizard ---
            const selProject = document.getElementById('sel-project');
            const selBlock = document.getElementById('sel-block');
            const selPlot = document.getElementById('sel-plot');
            const dispPrice = document.getElementById('disp-price');
            const dispSize = document.getElementById('disp-size');
            const inpTotal = document.getElementById('inp-total');
            const inpAdvance = document.getElementById('inp-advance');
            const inpMonths = document.getElementById('inp-months');
            const dispMonthly = document.getElementById('disp-monthly');

            let selectedPlotData = null;

            // Project Change
            selProject.addEventListener('change', () => {
                selBlock.innerHTML = '<option value="">Select Block</option>';
                selPlot.innerHTML = '<option value="">Select Plot</option>';
                selBlock.disabled = true;
                selPlot.disabled = true;

                const proj = projects.find(p => p.id === selProject.value);
                if (proj) {
                    selBlock.disabled = false;
                    proj.blocks.forEach(b => {
                        selBlock.innerHTML += `<option value="${b.id}">${b.name}</option>`;
                    });
                }
            });

            // Block Change
            selBlock.addEventListener('change', () => {
                selPlot.innerHTML = '<option value="">Select Plot</option>';
                selPlot.disabled = true;

                const proj = projects.find(p => p.id === selProject.value);
                // Note: store IDs are strings/numbers mixed sometimes in these quick demos. 
                // Let's rely on loose comparison or string conversion.
                const safeBlock = proj?.blocks.find(b => b.id.toString() === selBlock.value);

                if (safeBlock) {
                    selPlot.disabled = false;
                    safeBlock.plots.filter(p => p.status === 'available').forEach(p => {
                        selPlot.innerHTML += `<option value="${p.id}">${p.number}</option>`;
                    });
                }
            });

            // Plot Change
            selPlot.addEventListener('change', () => {
                const proj = projects.find(p => p.id === selProject.value);
                const block = proj?.blocks.find(b => b.id.toString() === selBlock.value);
                selectedPlotData = block?.plots.find(p => p.id === selPlot.value);

                if (selectedPlotData) {
                    document.getElementById('plot-details').classList.remove('hidden');
                    dispPrice.innerText = selectedPlotData.price;
                    dispSize.innerText = selectedPlotData.size;
                    inpTotal.value = selectedPlotData.price;
                    calculatePlan();
                } else {
                    document.getElementById('plot-details').classList.add('hidden');
                }
            });

            // Calc Logic
            const calculatePlan = () => {
                const total = parseFloat(inpTotal.value) || 0;
                const advance = parseFloat(inpAdvance.value) || 0;
                const months = parseFloat(inpMonths.value) || 12;

                if (months > 0) {
                    const remaining = total - advance;
                    const monthly = remaining / months;
                    dispMonthly.value = Math.round(monthly).toLocaleString();
                }
            };

            inpAdvance.addEventListener('input', calculatePlan);
            inpMonths.addEventListener('input', calculatePlan);

            // Submit
            document.getElementById('form-booking').addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                // 1. Create/Get Client
                const client = Store.addClient({
                    name: formData.get('clientName'),
                    cnic: formData.get('cnic'),
                    phone: formData.get('phone'),
                    address: formData.get('address')
                });

                // 2. Process Booking
                const bookingRes = Store.processBooking({
                    clientId: client.id,
                    plotId: selectedPlotData.id,
                    totalAmount: parseFloat(formData.get('total')),
                    advanceAmount: parseFloat(formData.get('advance')),
                    months: parseInt(formData.get('months')),
                    paymentMethod: 'cash' // Default for now
                });

                if (bookingRes.success) {
                    this.closeModal();
                    this.renderClients(); // Refresh list
                } else {
                    alert('Error: ' + bookingRes.error);
                }
            });
        });
    },


    // --- Printing & Reports ---

    printReceipt(bookingId) {
        const booking = Store.getBookings().find(b => b.id === bookingId);
        if (!booking) return;
        const client = Store.getClients().find(c => c.id === booking.clientId);
        const company = Store.getCompany();
        const transaction = Store.state.transactions.find(t => t.bookingId === booking.id && t.type === 'advance'); // Get initial tx for now

        // Create Printable Area
        let printable = document.getElementById('printable-area');
        if (!printable) {
            printable = document.createElement('div');
            printable.id = 'printable-area';
            document.body.appendChild(printable);
        }

        printable.innerHTML = `
            <div class="font-mono text-sm p-4 text-center max-w-[300px] mx-auto text-black">
                <div class="mb-4 border-b border-black pb-4">
                    <img src="${company.logo}" alt="Logo" class="h-12 mx-auto mb-2 grayscale">
                    <h2 class="font-bold text-lg uppercase">${company.name}</h2>
                    <p class="text-xs">${company.phone}</p>
                    <p class="text-xs">${company.email}</p>
                </div>
                
                <div class="mb-4 text-left">
                    <p class="flex justify-between"><span>Date:</span> <span>${new Date().toLocaleDateString()}</span></p>
                    <p class="flex justify-between"><span>Receipt #:</span> <span>${transaction.id.substr(-6)}</span></p>
                    <p class="flex justify-between"><span>Client:</span> <span>${client.name}</span></p>
                </div>

                <div class="mb-4 border-t border-b border-black py-2">
                    <div class="flex justify-between font-bold mb-1">
                        <span>Description</span>
                        <span>Amount</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Booking Advance</span>
                        <span>${transaction.amount.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between text-xs mt-1">
                        <span>Plot: ${booking.plotId.split('-').slice(1).join('-')}</span>
                    </div>
                </div>

                <div class="mb-6 text-right">
                    <p class="font-bold text-lg">Total: ${transaction.amount.toLocaleString()}</p>
                    <p class="text-xs">Balance: ${(booking.totalAmount - transaction.amount).toLocaleString()}</p>
                </div>

                <div class="text-center text-xs">
                    <p>Thank you for your business!</p>
                    <p class="mt-2">Software by Antigravity</p>
                    
                    <!-- SVG Barcode Placeholder -->
                     <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${booking.id}&scale=2&height=10" class="mx-auto mt-2 h-8">
                </div>
            </div>
        `;

        window.print();

        // Cleanup after print (optional, or hide via CSS)
        // setTimeout(() => printable.remove(), 1000); 
    },

    renderPrintingCenter() {
        const main = document.querySelector('main');
        if (!main) return this.renderDashboard();

        main.innerHTML = `
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">${this.t('printing')}</h1>
                    <p class="text-slate-500">Generate Reports & Summaries</p>
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition cursor-pointer" id="btn-gen-report">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
                        <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <h3 class="font-bold text-lg text-slate-800">Pending Installments</h3>
                    <p class="text-slate-500 text-sm mb-4">A4 Report of all overdue payments</p>
                    <button class="mt-auto px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 w-full font-medium">Generate Report</button>
                </div>
            </div>
        `;

        document.getElementById('btn-gen-report').addEventListener('click', () => {
            this.renderPendingReport();
        });
    },

    renderPendingReport() {
        const bookings = Store.getBookings();
        const clients = Store.getClients();
        const company = Store.getCompany();

        // Filter for pending (Simplified: All active bookings with balance > 0)
        // In real app, check dates. Here we just show all balances.
        const pendingBookings = bookings.filter(b => {
            const paid = Store.state.transactions
                .filter(t => t.bookingId === b.id)
                .reduce((sum, t) => sum + t.amount, 0);
            return (b.totalAmount - paid) > 0;
        });

        // Create Printable
        let printable = document.getElementById('printable-area');
        if (!printable) {
            printable = document.createElement('div');
            printable.id = 'printable-area';
            document.body.appendChild(printable);
        }

        printable.innerHTML = `
            <div class="p-8 max-w-[210mm] mx-auto bg-white min-h-[297mm]">
                <!-- Letterhead -->
                <div class="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-8">
                    <div class="flex items-center space-x-4">
                        <img src="${company.logo}" alt="Logo" class="h-16">
                        <div>
                            <h1 class="text-2xl font-bold text-slate-900 uppercase tracking-widest">${company.name}</h1>
                            <p class="text-sm text-slate-600">Pending Installments Report</p>
                        </div>
                    </div>
                    <div class="text-right text-sm text-slate-500">
                        <p>${new Date().toLocaleDateString()}</p>
                        <p>${company.phone}</p>
                    </div>
                </div>

                <!-- Content -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold mb-4">Outstanding Balances Summary</h2>
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="border-b-2 border-slate-200">
                                <th class="py-2">Client Name</th>
                                <th class="py-2">Plot Info</th>
                                <th class="py-2">Contact</th>
                                <th class="py-2 text-right">Total Amount</th>
                                <th class="py-2 text-right">Paid</th>
                                <th class="py-2 text-right">Balance Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pendingBookings.map(b => {
            const client = clients.find(c => c.id === b.clientId);
            const paid = Store.state.transactions
                .filter(t => t.bookingId === b.id)
                .reduce((sum, t) => sum + t.amount, 0);
            const balance = b.totalAmount - paid;

            return `
                                <tr class="border-b border-slate-100">
                                    <td class="py-3 font-medium">${client.name}</td>
                                    <td class="py-3">${b.plotId.split('-').slice(1).join('-')}</td>
                                    <td class="py-3">${client.phone}</td>
                                    <td class="py-3 text-right">${b.totalAmount.toLocaleString()}</td>
                                    <td class="py-3 text-right text-slate-500">${paid.toLocaleString()}</td>
                                    <td class="py-3 text-right font-bold text-red-600">${balance.toLocaleString()}</td>
                                </tr>
                                `;
        }).join('')}
                        </tbody>
                        <tfoot>
                             <tr class="border-t-2 border-slate-800 font-bold">
                                <td colspan="5" class="py-4 text-right">Total Receivables:</td>
                                <td class="py-4 text-right">
                                    ${pendingBookings.reduce((sum, b) => {
            const paid = Store.state.transactions
                .filter(t => t.bookingId === b.id)
                .reduce((s, t) => s + t.amount, 0);
            return sum + (b.totalAmount - paid);
        }, 0).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Footer -->
                <div class="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                    <p>Generated by Real Estate Management System</p>
                </div>
            </div>
            
             <div class="fixed bottom-8 right-8 print:hidden flex space-x-4">
                <button onclick="window.print()" class="bg-brand-600 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center">
                    <i class="fa-solid fa-print mr-2"></i> Print Report
                </button>
                 <button onclick="document.getElementById('printable-area').remove()" class="bg-slate-600 text-white px-6 py-3 rounded-full shadow-lg font-bold">
                    Close
                </button>
            </div>
        `;
    },

    // --- Financial Reports ---

    renderFinancials() {
        const bookings = Store.getBookings();
        const transactions = Store.state.transactions;
        const totalSales = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
        const totalCollected = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalOutstanding = totalSales - totalCollected;

        const main = document.querySelector('main');
        if (!main) return this.renderDashboard();

        // Highlight Nav
        document.querySelectorAll('nav a').forEach(el => el.classList.remove('bg-brand-600', 'shadow-lg', 'shadow-brand-900/50'));
        document.getElementById('nav-financials')?.classList.add('bg-brand-600', 'shadow-lg', 'shadow-brand-900/50');

        main.innerHTML = `
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">${this.t('financials')}</h1>
                    <p class="text-slate-500">Revenue and cash flow analysis</p>
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p class="text-sm text-slate-500 mb-1">Total Sales Value</p>
                    <h3 class="text-3xl font-bold text-slate-800">Rs. ${totalSales.toLocaleString()}</h3>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p class="text-sm text-slate-500 mb-1">Total Collected</p>
                    <h3 class="text-3xl font-bold text-emerald-600">Rs. ${totalCollected.toLocaleString()}</h3>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p class="text-sm text-slate-500 mb-1">Outstanding Balance</p>
                    <h3 class="text-3xl font-bold text-amber-600">Rs. ${totalOutstanding.toLocaleString()}</h3>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-100">
                <div class="px-6 py-4 border-b border-slate-100 font-bold text-slate-700">
                    Recent Transactions
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 text-slate-600 text-sm">
                            <tr>
                                <th class="px-6 py-3">ID</th>
                                <th class="px-6 py-3">Date</th>
                                <th class="px-6 py-3">Reference (Booking)</th>
                                <th class="px-6 py-3">Type</th>
                                <th class="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-sm">
                            ${transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => `
                            <tr>
                                <td class="px-6 py-3 font-mono text-slate-500">#${t.id.substr(-6)}</td>
                                <td class="px-6 py-3">${new Date(t.date).toLocaleDateString()}</td>
                                <td class="px-6 py-3">Plot ${Store.getBookings().find(b => b.id === t.bookingId)?.plotId.split('-').slice(1).join('-') || 'N/A'}</td>
                                <td class="px-6 py-3 capitalize">${t.type}</td>
                                <td class="px-6 py-3 text-right font-medium">Rs. ${t.amount.toLocaleString()}</td>
                            </tr>
                            `).join('')}
                             ${transactions.length === 0 ? `<tr><td colspan="5" class="text-center py-8 text-slate-500">No transactions recorded yet.</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // --- Settings ---
    renderSettings() {
        const user = Store.getCurrentUser();
        const main = document.querySelector('main');
        if (!main) return this.renderDashboard();

        // Highlight Nav
        document.querySelectorAll('nav a').forEach(el => el.classList.remove('bg-brand-600', 'shadow-lg', 'shadow-brand-900/50'));
        document.getElementById('nav-settings')?.classList.add('bg-brand-600', 'shadow-lg', 'shadow-brand-900/50');

        main.innerHTML = `
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">${this.t('settings')}</h1>
                    <p class="text-slate-500">Manage your account preferences</p>
                </div>
            </header>

            <div class="max-w-xl">
                <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <h3 class="text-lg font-bold text-slate-800 mb-6">Security</h3>
                    
                    <form id="form-change-password" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Current Role</label>
                            <input type="text" value="${user.role.toUpperCase()}" disabled class="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input type="password" name="newPassword" required minlength="4" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                            <input type="password" name="confirmPassword" required minlength="4" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                        </div>

                        <div class="pt-4 flex justify-end">
                            <button type="submit" class="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-brand-500/30 transition">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('form-change-password').addEventListener('submit', (e) => {
            e.preventDefault();
            const newPass = e.target.newPassword.value;
            const confirmPass = e.target.confirmPassword.value;

            if (newPass !== confirmPass) {
                alert("Passwords do not match!");
                return;
            }

            if (Store.updatePassword(user.role, newPass)) {
                alert("Password updated successfully!");
                e.target.reset();
            } else {
                alert("Failed to update password.");
            }
        });
    },

    // --- Modal Utility ---
    showModal(content, onMount) {
        const container = document.getElementById('modal-container');
        if (!container) return; // Should be in the shell

        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg transform scale-100 transition-all animate-fade-in-up mx-4">
                ${content}
            </div>
        `;
        container.classList.remove('hidden');
        container.classList.add('flex');

        container.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        if (onMount) onMount();
    },

    closeModal() {
        const container = document.getElementById('modal-container');
        if (container) {
            container.classList.add('hidden');
            container.classList.remove('flex');
        }
    }
};
