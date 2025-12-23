/**
 * Store - Manages application state and localStorage persistence
 */
const STORAGE_KEY = 'rems_data_v1';

const defaultState = {
    company: null, // { name, logo, email, phone }
    users: [
        { id: 'ceo', name: 'CEO', role: 'ceo', password: '1234' }, // Default password
        { id: 'acc', name: 'Accountant', role: 'accountant', password: '1234' }
    ],
    projects: [], // [ { id, name, blocks: [ { name, plots: [] } ] } ]
    clients: [], // [ { id, name, cnic, phone, address } ]
    bookings: [], // [ { id, clientId, plotId, total, advance, installments, ... } ]
    transactions: [], // [ { id, date, amount, type, bookingId, ... } ]
    documents: [], // [ { id, bookingId, plotId, filename, data (base64), uploadDate } ]
    currentUser: null
};

// Store - State Management
window.Store = {
    state: { ...defaultState },

    init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            this.state = JSON.parse(stored);

            // Migration: Add passwords to users if they don't have them
            let needsSave = false;
            this.state.users.forEach(user => {
                if (!user.password) {
                    user.password = '1234'; // Default password
                    needsSave = true;
                }
            });

            if (needsSave) {
                this.save();
            }
        } else {
            this.save();
        }
    },

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    },

    // --- Auth ---
    login(roleId, password) {
        const user = this.state.users.find(u => u.role === roleId);
        if (user && user.password === password) {
            this.state.currentUser = user;
            this.save();
            return { success: true };
        }
        return { success: false, error: 'Invalid Credentials' };
    },

    updatePassword(roleId, newPassword) {
        const user = this.state.users.find(u => u.role === roleId);
        if (user) {
            user.password = newPassword;
            this.save();
            return true;
        }
        return false;
    },

    logout() {
        this.state.currentUser = null;
        this.save();
    },

    getCurrentUser() {
        return this.state.currentUser;
    },

    // --- Company ---
    setCompanyDetails(details) {
        this.state.company = details;
        this.save();
    },

    getCompany() {
        return this.state.company;
    },

    // --- Projects ---
    addProject(name) {
        const project = {
            id: Date.now().toString(),
            name,
            blocks: [],
            createdAt: new Date().toISOString()
        };
        this.state.projects.push(project);
        this.save();
        return project;
    },

    getProjects() {
        return this.state.projects;
    },

    addBlock(projectId, blockName, plotPrefix, plotCount, plotSize, price) {
        const project = this.state.projects.find(p => p.id === projectId);
        if (!project) return;

        const plots = [];
        for (let i = 1; i <= plotCount; i++) {
            plots.push({
                id: `${projectId}-${blockName}-${i}`,
                number: `${plotPrefix}-${i}`,
                size: plotSize,
                price: price,
                status: 'available', // available, booked, sold
                bookedBy: null
            });
        }

        const block = {
            id: Date.now().toString() + Math.random(),
            name: blockName,
            plots
        };

        project.blocks.push(block);
        this.save();
    },

    // --- Clients & Bookings ---
    getClients() { return this.state.clients; },
    getBookings() { return this.state.bookings; },

    addClient(clientData) {
        // Check if exists by CNIC
        let client = this.state.clients.find(c => c.cnic === clientData.cnic);
        if (client) return client;

        client = { ...clientData, id: Date.now().toString() };
        this.state.clients.push(client);
        this.save();
        return client;
    },

    processBooking(bookingData) {
        // 1. Find Plot and Update Status
        let plotFound = null;
        this.state.projects.forEach(p => {
            p.blocks.forEach(b => {
                const plot = b.plots.find(pl => pl.id === bookingData.plotId);
                if (plot) {
                    plot.status = 'booked';
                    plotFound = plot;
                }
            });
        });

        if (!plotFound) return { error: 'Plot not found' };

        // 2. Create Booking Record
        const booking = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...bookingData,
            status: 'active'
        };
        this.state.bookings.push(booking);

        // 3. Add Advance Transaction
        this.addTransaction({
            bookingId: booking.id,
            amount: bookingData.advance,
            type: 'advance', // advance, installment
            method: bookingData.paymentMethod || 'cash',
            date: new Date().toISOString()
        });

        this.save();
        return { success: true, booking };
    },

    addTransaction(txData) {
        const tx = {
            id: Date.now().toString() + Math.random(),
            ...txData
        };
        this.state.transactions.push(tx);
        this.save();
        return tx;
    },
    // --- Stats ---
    getStats() {
        const totalProjects = this.state.projects.length;
        const totalClients = this.state.clients.length;
        let totalPending = 0;
        let totalCollected = 0;

        // Simple calculation logic placeholder
        this.state.transactions.forEach(t => {
            if (t.type === 'payment') totalCollected += parseFloat(t.amount);
        });

        return {
            totalProjects,
            totalClients,
            totalCollected,
            totalPending
        };
    },

    // --- Documents ---
    addDocument(plotId, filename, dataUrl) {
        const doc = {
            id: Date.now().toString() + Math.random(),
            plotId,
            filename,
            data: dataUrl, // base64 data URL
            uploadDate: new Date().toISOString()
        };
        this.state.documents.push(doc);
        this.save();
        return doc;
    },

    getDocumentsByPlot(plotId) {
        return this.state.documents.filter(d => d.plotId === plotId);
    },

    deleteDocument(docId) {
        this.state.documents = this.state.documents.filter(d => d.id !== docId);
        this.save();
    }
};
