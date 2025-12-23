import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Shell() {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default Shell;
