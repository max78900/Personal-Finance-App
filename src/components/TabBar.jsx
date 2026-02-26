import React from 'react';
import { useAppContext } from '../context/AppContext';
import GlassPanel from './GlassPanel';

export default function TabBar({ activeTab, setActiveTab, isAdding, glassStyle }) {
    const { startAdding } = useAppContext();
    if (isAdding || ['report', 'categoryDetail'].includes(activeTab)) return null;

    return (
        <GlassPanel
            style={glassStyle}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-white/40 flex justify-between px-10 py-4 pb-safe z-30 shadow-[0_-15px_50px_rgba(0,0,0,0.15)] rounded-t-[40px]"
        >
            <button
                onClick={() => setActiveTab('home')}
                className={`p-2 transition-all ${activeTab === 'home' ? 'text-gray-900 scale-125 font-bold' : 'text-gray-400 opacity-50 hover:opacity-100'}`}
            >
                <i className="fa-solid fa-house text-2xl"></i>
            </button>
            <div className="relative -top-10">
                <button
                    onClick={() => startAdding()}
                    className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_20px_40px_-5px_rgba(239,68,68,0.5)] border-[5px] border-white active:scale-90 hover:bg-red-600 transition-all shadow-2xl"
                >
                    <i className="fa-solid fa-plus text-3xl"></i>
                </button>
            </div>
            <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 transition-all ${activeTab === 'settings' ? 'text-gray-900 scale-125 font-bold' : 'text-gray-400 opacity-50 hover:opacity-100'}`}
            >
                <i className="fa-solid fa-gear text-2xl"></i>
            </button>
        </GlassPanel>
    );
}
