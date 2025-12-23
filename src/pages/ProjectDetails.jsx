import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Modal from '../components/Modal';
import PlotDetailsModal from '../components/PlotDetailsModal';

function ProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const projects = useStore(state => state.projects);
    const addBlock = useStore(state => state.addBlock);
    const deleteBlock = useStore(state => state.deleteBlock);
    const deletePlot = useStore(state => state.deletePlot);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedPlotId, setSelectedPlotId] = useState(null);
    const [blockForm, setBlockForm] = useState({
        name: '',
        prefix: 'P',
        count: 20,
        size: '5 Marla',
        price: 0
    });

    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return <div>Project not found</div>;
    }

    const handleAddBlock = (e) => {
        e.preventDefault();
        addBlock(
            projectId,
            blockForm.name,
            blockForm.prefix,
            parseInt(blockForm.count),
            blockForm.size,
            parseFloat(blockForm.price)
        );
        setShowBlockModal(false);
        setBlockForm({ name: '', prefix: 'P', count: 20, size: '5 Marla', price: 0 });
    };

    const handlePlotClick = (plot) => {
        if (plot.status === 'booked' || plot.status === 'sold') {
            setSelectedPlotId(plot.id);
        } else {
            alert('This plot is available. Go to "Clients & Bookings" to book it.');
        }
    };

    const getStatusColor = (status) => {
        if (status === 'booked') return 'bg-amber-50 text-amber-600 border-amber-200';
        if (status === 'sold') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        return 'bg-slate-100 text-slate-600 border-slate-200 hover:border-brand-500 hover:text-brand-600';
    };

    return (
        <>
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => navigate('/projects')}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
                    <p className="text-slate-500">Inventory Management</p>
                </div>
                <div className="flex-1"></div>
                <button
                    onClick={() => setShowBlockModal(true)}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-brand-500/30 transition flex items-center"
                >
                    <i className="fa-solid fa-plus mr-2"></i> Add Block
                </button>
            </div>

            <div className="space-y-8">
                {project.blocks.map(block => (
                    <div key={block.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">Block {block.name}</h3>
                            <div className="flex items-center space-x-3">
                                <span className="text-sm bg-white px-3 py-1 rounded border border-slate-200 text-slate-500">
                                    {block.plots.length} Plots
                                </span>
                                <button
                                    onClick={() => {
                                        if (confirm(`Delete Block ${block.name}? All plots and bookings in this block will be removed.`)) {
                                            deleteBlock(projectId, block.id);
                                        }
                                    }}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                    title="Delete Block"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {block.plots.map(plot => (
                                    <div
                                        key={plot.id}
                                        onClick={() => handlePlotClick(plot)}
                                        className={`relative group cursor-pointer border rounded-lg p-2 text-center transition-all ${getStatusColor(plot.status)}`}
                                    >
                                        <div className="text-xs font-bold mb-1">{plot.number}</div>
                                        <div className="text-[10px] opacity-70">{plot.size}</div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Delete Plot ${plot.number}?`)) {
                                                    deletePlot(projectId, block.id, plot.id);
                                                }
                                            }}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                            title="Delete Plot"
                                        >
                                            <i className="fa-solid fa-times text-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {project.blocks.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No blocks added yet. Create a block to generate plots.</p>
                    </div>
                )}
            </div>

            {/* Add Block Modal */}
            <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title={`Add Block to ${project.name}`}>
                <form onSubmit={handleAddBlock} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Block Name (e.g., A)</label>
                        <input
                            type="text"
                            value={blockForm.name}
                            onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="A"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Plots</label>
                            <input
                                type="number"
                                value={blockForm.count}
                                onChange={(e) => setBlockForm({ ...blockForm, count: e.target.value })}
                                required
                                min="1"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plot Prefix</label>
                            <input
                                type="text"
                                value={blockForm.prefix}
                                onChange={(e) => setBlockForm({ ...blockForm, prefix: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plot Size (Marla/SqFt)</label>
                            <input
                                type="text"
                                value={blockForm.size}
                                onChange={(e) => setBlockForm({ ...blockForm, size: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price per Plot</label>
                            <input
                                type="number"
                                value={blockForm.price}
                                onChange={(e) => setBlockForm({ ...blockForm, price: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowBlockModal(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                        >
                            Generate Plots
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Plot Details Modal */}
            {selectedPlotId && (
                <PlotDetailsModal
                    plotId={selectedPlotId}
                    onClose={() => setSelectedPlotId(null)}
                />
            )}
        </>
    );
}

export default ProjectDetails;
