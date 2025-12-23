import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`bg-white rounded-xl shadow-2xl ${sizes[size]} w-full mx-4 max-h-[90vh] overflow-hidden`}>
                <div className="p-6">
                    {title && <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>}
                    <div className="overflow-y-auto max-h-[75vh]">
                        {children}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                    <i className="fa-solid fa-times"></i>
                </button>
            </div>
        </div>
    );
}

export default Modal;
