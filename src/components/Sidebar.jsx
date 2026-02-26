import React from 'react';

export default function Sidebar({ isMenuOpen, setIsMenuOpen, setActiveTab }) {
    if (!isMenuOpen) return null;

    return (
        <div className="fixed inset-0 z-[130] flex">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
            <div className="w-72 bg-white/95 backdrop-blur-lg h-full relative flex flex-col animate-in slide-in-from-left shadow-2xl">
                <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-black text-2xl text-gray-800 tracking-tighter uppercase italic text-nowrap">
                        <i className="fa-solid fa-wallet text-blue-500 mr-2"></i>我的金庫
                    </h2>
                    <button onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-gray-800 transition active:scale-90">
                        <i className="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <button onClick={() => { setIsMenuOpen(false); setActiveTab('home'); }} className="w-full text-left p-6 hover:bg-blue-50 rounded-[32px] font-black text-gray-700 transition-all flex items-center gap-4 shadow-sm border border-transparent hover:border-blue-100 active:scale-95">
                        <i className="fa-solid fa-house text-blue-400 text-xl"></i> 首頁概覽
                    </button>
                    <button onClick={() => { setIsMenuOpen(false); setActiveTab('categories'); }} className="w-full text-left p-6 hover:bg-purple-50 rounded-[32px] font-black text-gray-700 transition-all flex items-center gap-4 shadow-sm border border-transparent hover:border-purple-100 active:scale-95">
                        <i className="fa-solid fa-tags text-purple-400 text-xl"></i> 分類管理
                    </button>
                    <button onClick={() => { setIsMenuOpen(false); setActiveTab('settings'); }} className="w-full text-left p-6 hover:bg-gray-100 rounded-[32px] font-black text-gray-700 transition-all flex items-center gap-4 shadow-sm border border-transparent hover:border-gray-200 active:scale-95">
                        <i className="fa-solid fa-gear text-gray-400 text-xl"></i> 視覺設定
                    </button>
                </div>
                <div className="mt-auto p-10 text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] text-center border-t border-gray-100 flex flex-col gap-2">
                    <span>React 重構版本</span>
                    <span className="text-blue-400">V1.0</span>
                </div>
            </div>
        </div>
    );
}
