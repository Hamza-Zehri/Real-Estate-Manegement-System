import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'rems_data_v1';

const defaultState = {
    company: null, // { name, logo, email, phone }
    users: [
        { id: 'ceo', name: 'CEO', role: 'ceo', password: '1234' },
        { id: 'acc', name: 'Accountant', role: 'accountant', password: '1234' }
    ],
    projects: [], // [ { id, name, blocks: [ { name, plots: [] } ] } ]
    clients: [], // [ { id, name, cnic, phone, address } ]
    bookings: [], // [ { id, clientId, plotId, total, advance, installments, ... } ]
    transactions: [], // [ { id, date, amount, type, bookingId, ... } ]
    documents: [], // [ { id, bookingId, plotId, filename, data (base64), uploadDate } ]
    currentUser: null
};

export const useStore = create(
    persist(
        (set, get) => ({
            ...defaultState,

            // Auth Actions
            login: (roleId, password) => {
                const user = get().users.find(u => u.role === roleId);
                if (user && user.password === password) {
                    set({ currentUser: user });
                    return { success: true };
                }
                return { success: false, error: 'Invalid Credentials' };
            },

            updatePassword: (roleId, newPassword) => {
                set(state => ({
                    users: state.users.map(u =>
                        u.role === roleId ? { ...u, password: newPassword } : u
                    )
                }));
            },

            logout: () => set({ currentUser: null }),

            // Company Actions
            setCompanyDetails: (details) => set({ company: details }),

            // Project Actions
            addProject: (name) => {
                const project = {
                    id: Date.now().toString(),
                    name,
                    blocks: [],
                    createdAt: new Date().toISOString()
                };
                set(state => ({ projects: [...state.projects, project] }));
                return project;
            },

            addBlock: (projectId, blockName, plotPrefix, plotCount, plotSize, price) => {
                const plots = [];
                for (let i = 1; i <= plotCount; i++) {
                    plots.push({
                        id: `${projectId}-${blockName}-${i}`,
                        number: `${plotPrefix}-${i}`,
                        size: plotSize,
                        price: price,
                        status: 'available',
                        bookedBy: null
                    });
                }

                const block = {
                    id: Date.now().toString() + Math.random(),
                    name: blockName,
                    plots
                };

                set(state => ({
                    projects: state.projects.map(p =>
                        p.id === projectId
                            ? { ...p, blocks: [...p.blocks, block] }
                            : p
                    )
                }));
            },

            // Client Actions
            addClient: (clientData) => {
                const state = get();
                let client = state.clients.find(c => c.cnic === clientData.cnic);
                if (client) return client;

                client = { ...clientData, id: Date.now().toString() };
                set(state => ({ clients: [...state.clients, client] }));
                return client;
            },

            // Booking Actions
            processBooking: (bookingData) => {
                const state = get();
                let plotFound = null;

                // Find and update plot status
                const updatedProjects = state.projects.map(p => ({
                    ...p,
                    blocks: p.blocks.map(b => ({
                        ...b,
                        plots: b.plots.map(pl => {
                            if (pl.id === bookingData.plotId) {
                                plotFound = pl;
                                return { ...pl, status: 'booked' };
                            }
                            return pl;
                        })
                    }))
                }));

                if (!plotFound) return { error: 'Plot not found' };

                // Create booking
                const booking = {
                    id: Date.now().toString(),
                    date: new Date().toISOString(),
                    ...bookingData,
                    status: 'active'
                };

                // Add advance transaction
                const tx = {
                    id: Date.now().toString() + Math.random(),
                    bookingId: booking.id,
                    amount: bookingData.advanceAmount,
                    type: 'advance',
                    method: bookingData.paymentMethod || 'cash',
                    date: new Date().toISOString()
                };

                set({
                    projects: updatedProjects,
                    bookings: [...state.bookings, booking],
                    transactions: [...state.transactions, tx]
                });

                return { success: true, booking };
            },

            addTransaction: (txData) => {
                const tx = {
                    id: Date.now().toString() + Math.random(),
                    ...txData
                };
                set(state => ({ transactions: [...state.transactions, tx] }));
                return tx;
            },

            // Document Actions
            addDocument: (plotId, filename, dataUrl) => {
                const doc = {
                    id: Date.now().toString() + Math.random(),
                    plotId,
                    filename,
                    data: dataUrl,
                    uploadDate: new Date().toISOString()
                };
                set(state => ({ documents: [...state.documents, doc] }));
                return doc;
            },

            deleteDocument: (docId) => {
                set(state => ({
                    documents: state.documents.filter(d => d.id !== docId)
                }));
            },

            // New Actions for Delete and Transfer functionalities
            deleteProject: (projectId) => {
                set(state => {
                    // Filter out the project
                    const newProjects = state.projects.filter(p => p.id !== projectId);

                    // Identify related data to clean up
                    const project = state.projects.find(p => p.id === projectId);
                    const plotIds = [];
                    project?.blocks.forEach(b => b.plots.forEach(p => plotIds.push(p.id)));

                    const bookingsToRemove = state.bookings.filter(b => plotIds.includes(b.plotId));
                    const bookingIds = bookingsToRemove.map(b => b.id);

                    return {
                        projects: newProjects,
                        bookings: state.bookings.filter(b => !plotIds.includes(b.plotId)),
                        transactions: state.transactions.filter(t => !bookingIds.includes(t.bookingId)),
                        documents: state.documents.filter(d => !plotIds.includes(d.plotId))
                    };
                });
            },

            deleteBlock: (projectId, blockId) => {
                set(state => {
                    // Update projects
                    const newProjects = state.projects.map(p => {
                        if (p.id === projectId) {
                            return { ...p, blocks: p.blocks.filter(b => b.id !== blockId) };
                        }
                        return p;
                    });

                    // Identify plots to clean up
                    const project = state.projects.find(p => p.id === projectId);
                    const block = project?.blocks.find(b => b.id === blockId);
                    const plotIds = block?.plots.map(p => p.id) || [];

                    const bookingsToRemove = state.bookings.filter(b => plotIds.includes(b.plotId));
                    const bookingIds = bookingsToRemove.map(b => b.id);

                    return {
                        projects: newProjects,
                        bookings: state.bookings.filter(b => !plotIds.includes(b.plotId)),
                        transactions: state.transactions.filter(t => !bookingIds.includes(t.bookingId)),
                        documents: state.documents.filter(d => !plotIds.includes(d.plotId))
                    };
                });
            },

            deletePlot: (projectId, blockId, plotId) => {
                set(state => {
                    // Update projects
                    const newProjects = state.projects.map(p => {
                        if (p.id === projectId) {
                            return {
                                ...p,
                                blocks: p.blocks.map(b => {
                                    if (b.id === blockId) {
                                        return { ...b, plots: b.plots.filter(pl => pl.id !== plotId) };
                                    }
                                    return b;
                                })
                            };
                        }
                        return p;
                    });

                    // Clean up bookings and transactions
                    const bookingsToRemove = state.bookings.filter(b => b.plotId === plotId);
                    const bookingIds = bookingsToRemove.map(b => b.id);

                    return {
                        projects: newProjects,
                        bookings: state.bookings.filter(b => b.plotId !== plotId),
                        transactions: state.transactions.filter(t => !bookingIds.includes(t.bookingId)),
                        documents: state.documents.filter(d => d.plotId !== plotId)
                    };
                });
            },

            deleteClient: (clientId) => {
                const state = get();
                // Check if client has active bookings
                const hasBookings = state.bookings.some(b => b.clientId === clientId);
                if (hasBookings) {
                    return { success: false, error: 'Cannot delete client with active bookings.' };
                }

                set({
                    clients: state.clients.filter(c => c.id !== clientId)
                });
                return { success: true };
            },

            transferPlot: (bookingId, newClientId) => {
                set(state => {
                    // Update Booking
                    const newBookings = state.bookings.map(b =>
                        b.id === bookingId ? { ...b, clientId: newClientId } : b
                    );

                    // Update Plot (bookedBy field if it exists, though status drives it mostly)
                    const booking = state.bookings.find(b => b.id === bookingId);
                    if (booking) {
                        // Find plot coordinates
                        let targetProjectId, targetBlockId;
                        state.projects.forEach(p => {
                            p.blocks.forEach(b => {
                                b.plots.forEach(pl => {
                                    if (pl.id === booking.plotId) {
                                        targetProjectId = p.id;
                                        targetBlockId = b.id;
                                    }
                                });
                            });
                        });

                        const newProjects = state.projects.map(p => {
                            if (p.id === targetProjectId) {
                                return {
                                    ...p,
                                    blocks: p.blocks.map(b => {
                                        if (b.id === targetBlockId) {
                                            return {
                                                ...b,
                                                plots: b.plots.map(pl => {
                                                    if (pl.id === booking.plotId) {
                                                        return { ...pl, bookedBy: newClientId };
                                                    }
                                                    return pl;
                                                })
                                            };
                                        }
                                        return b;
                                    })
                                };
                            }
                            return p;
                        });

                        return {
                            bookings: newBookings,
                            projects: newProjects
                        };
                    }
                    return { bookings: newBookings };
                });
                return { success: true };
            },

            // Selectors
            getStats: () => {
                const state = get();
                const totalProjects = state.projects.length;
                const totalClients = state.clients.length;
                let totalCollected = 0;

                state.transactions.forEach(t => {
                    totalCollected += parseFloat(t.amount);
                });

                return {
                    totalProjects,
                    totalClients,
                    totalCollected,
                    totalPending: 0
                };
            },

            getDocumentsByPlot: (plotId) => {
                return get().documents.filter(d => d.plotId === plotId);
            }
        }),
        {
            name: STORAGE_KEY,
        }
    )
);
