import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import Header from '../components/Layout/Header';
import Modal from '../components/Modal';

function Projects() {
    const navigate = useNavigate();
    const projects = useStore(state => state.projects);
    const addProject = useStore(state => state.addProject);
    const deleteProject = useStore(state => state.deleteProject);
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [projectName, setProjectName] = useState('');

    const handleCreateProject = (e) => {
        e.preventDefault();
        addProject(projectName);
        setShowModal(false);
        setProjectName('');
    };

    return (
        <>
            <Header
                title={t('projects')}
                subtitle="Manage your real estate data"
                actions={
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-brand-500/30 transition flex items-center"
                    >
                        <i className="fa-solid fa-plus mr-2"></i> New Project
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div
                        key={project.id}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group relative cursor-pointer"
                        onClick={() => navigate(`/projects/${project.id}`)}
                    >
                        <div className="h-32 bg-slate-100 relative">
                            <img
                                src={`https://source.unsplash.com/random/800x600/?building,house&sig=${project.id}`}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                alt={project.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-xl font-bold">{project.name}</h3>
                                <p className="text-xs opacity-90">{project.blocks.length} Blocks</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                                <span>
                                    <i className="fa-regular fa-calendar mr-1"></i>
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                                <span>ID: {project.id.substr(-4)}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                                    View Inventory
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete this project? This will permanently delete all blocks, plots, and bookings within it.')) {
                                            deleteProject(project.id);
                                        }
                                    }}
                                    className="px-3 py-2 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
                                    title="Delete Project"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">No Projects Yet</h3>
                        <p className="text-slate-500">Create your first project to get started.</p>
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
                <form onSubmit={handleCreateProject}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
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
                            Create
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default Projects;
