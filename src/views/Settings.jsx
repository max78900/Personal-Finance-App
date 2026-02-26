import React from 'react';
import { useAppContext } from '../context/AppContext';
import { hexToRgba } from '../utils/helpers';
import GlassPanel from '../components/GlassPanel';

export default function Settings() {
    const {
        setActiveTab, isConnOpen, setIsConnOpen, apiUrl, setApiUrl, apiToken, setApiToken, geminiKey, setGeminiKey,
        isVisualOpen, setIsVisualOpen, glassOpacity, setGlassOpacity, panelColor, setPanelColor, appTheme, setAppTheme,
        bgImage, handleImageUpload, bgSettings, setBgSettings, glassStyle
    } = useAppContext();

    return (
        <div className="pb-24 min-h-screen animate-in fade-in duration-300 no-scrollbar overflow-y-auto px-5 pt-6 text-gray-800">
            <div className="flex items-center mb-8">
                <button onClick={() => setActiveTab('home')} className="p-3 bg-white rounded-2xl shadow-md border active:scale-90 transition mr-5 text-gray-500">
                    <i className="fa-solid fa-angle-left text-xl"></i>
                </button>
                <h2 className="font-black text-2xl tracking-tighter uppercase">介面視覺系統</h2>
            </div>

            <div className="space-y-6">
                {/* 1. 連線設定 (摺疊) */}
                <GlassPanel
                    style={{ ...glassStyle, background: hexToRgba(panelColor, glassOpacity + 0.1) }}
                    className="rounded-[40px] border border-white/50 shadow-xl overflow-hidden"
                >
                    <button
                        onClick={() => setIsConnOpen(!isConnOpen)}
                        className="w-full p-6 flex justify-between items-center bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <h3 className="font-black flex items-center gap-3 text-sm uppercase tracking-widest text-blue-800">
                            <i className="fa-solid fa-cloud"></i>連線設定
                        </h3>
                        <i className={`fa-solid fa-chevron-${isConnOpen ? 'up' : 'down'} text-blue-500 transition-all`}></i>
                    </button>

                    {isConnOpen && (
                        <div className="p-6 pt-2 space-y-4 animate-in slide-in-from-top duration-300">
                            <input type="password" placeholder="API 網址" className="w-full bg-white/80 border border-gray-100 p-4 rounded-2xl outline-none focus:border-blue-400 shadow-inner text-sm" value={apiUrl} onChange={e => { setApiUrl(e.target.value); localStorage.setItem('gs_api_url', e.target.value) }} />
                            <input type="password" placeholder="資料庫密碼" className="w-full bg-white/80 border border-gray-100 p-4 rounded-2xl outline-none focus:border-blue-400 shadow-inner text-sm" value={apiToken} onChange={e => { setApiToken(e.target.value); localStorage.setItem('gs_api_token', e.target.value) }} />
                            <input type="password" placeholder="Gemini AI Key" className="w-full bg-blue-50/80 border border-blue-200 p-4 rounded-2xl outline-none focus:border-blue-400 shadow-inner text-sm font-mono" value={geminiKey} onChange={e => { setGeminiKey(e.target.value); localStorage.setItem('gemini_api_key', e.target.value) }} />
                        </div>
                    )}
                </GlassPanel>

                {/* 2. 視覺設定 (摺疊) */}
                <GlassPanel style={glassStyle} className="rounded-[40px] border border-white/60 shadow-xl overflow-hidden">
                    <button
                        onClick={() => setIsVisualOpen(!isVisualOpen)}
                        className="w-full p-6 flex justify-between items-center bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <h3 className="font-black flex items-center gap-3 text-sm uppercase tracking-widest text-purple-700">
                            <i className="fa-solid fa-palette"></i>介面客製化
                        </h3>
                        <i className={`fa-solid fa-chevron-${isVisualOpen ? 'up' : 'down'} text-purple-500 transition-all`}></i>
                    </button>

                    {isVisualOpen && (
                        <div className="p-6 pt-2 space-y-6 animate-in slide-in-from-top duration-300">
                            <div className="bg-white/50 p-5 rounded-3xl border border-white/80 shadow-inner">
                                <label className="text-[11px] font-black text-gray-500 mb-4 uppercase tracking-widest flex justify-between">面板透明度 <span className="text-blue-600 font-bold">{Math.round(glassOpacity * 100)}%</span></label>
                                <input type="range" min="0.1" max="1" step="0.05" value={glassOpacity} onChange={e => setGlassOpacity(parseFloat(e.target.value))} className="w-full accent-blue-600 shadow-sm" />
                            </div>

                            <div className="bg-white/50 p-5 rounded-3xl border border-white/80 shadow-inner">
                                <label className="text-[11px] font-black text-gray-500 block mb-4 uppercase tracking-widest">面板主題色</label>
                                <div className="flex items-center gap-4">
                                    <input type="color" value={panelColor} onChange={e => setPanelColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                                    <div className="flex-1">
                                        <p className="font-mono text-xs font-bold text-gray-400">{panelColor.toUpperCase()}</p>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">選取毛玻璃背景的主色調</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-black text-gray-400 block mb-4 uppercase tracking-widest px-1">快速背景底色</label>
                                <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar px-1 items-center">
                                    {['#f3f4f6', '#1e293b', '#fbcfe8', '#bbf7d0', '#bfdbfe', '#2d3436'].map(c => (
                                        <button key={c} onClick={() => setAppTheme({ type: 'color', value: c })} className={`min-w-[48px] h-12 rounded-full border-4 transition-all hover:scale-110 active:scale-90 shadow-md ${appTheme.value === c ? 'border-gray-800 scale-110' : 'border-white'}`} style={{ backgroundColor: c }}></button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 items-end px-1 pb-2">
                                <div className="flex-1"><label className="text-[11px] font-black text-gray-400 block mb-3 uppercase tracking-widest">自選背景色</label>
                                    <div className="flex items-center gap-4 bg-white/80 p-3 rounded-2xl border border-white shadow-inner"><input type="color" value={appTheme.type === 'color' ? appTheme.value : '#ffffff'} onChange={e => setAppTheme({ type: 'color', value: e.target.value })} className="w-11 h-11 rounded-xl cursor-pointer border-none bg-transparent shadow-sm" /><span className="text-xs font-mono font-black text-gray-400 uppercase tracking-widest">{appTheme.value}</span></div>
                                </div>
                                <button onClick={() => setAppTheme({ type: 'custom' })} className="px-6 py-5 text-xs font-black bg-gray-800 text-white rounded-2xl shadow-2xl flex-shrink-0 active:scale-95 transition-all">套用桌布</button>
                            </div>

                            <label onDrop={(e) => handleImageUpload(e, 'bg')} onDragOver={e => e.preventDefault()} className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 p-12 rounded-[40px] bg-purple-50/40 hover:bg-purple-100/50 cursor-pointer transition-all group">
                                <i className="fa-solid fa-cloud-arrow-up text-5xl text-purple-400 mb-4 group-hover:scale-110 transition-transform"></i>
                                <span className="text-[11px] font-black text-purple-800 text-center uppercase tracking-widest leading-relaxed">更換桌布圖片<br /><span className="text-[8px] font-bold text-purple-400">(直接拖拉圖片至此)</span></span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'bg')} className="hidden" />
                            </label>

                            {bgImage && appTheme.type === 'custom' && (
                                <div className="bg-white/90 p-8 rounded-[40px] border border-gray-100 shadow-2xl space-y-6 animate-in zoom-in duration-300 shadow-inner">
                                    <p className="text-[11px] font-black text-gray-500 border-b pb-3 uppercase tracking-[0.4em] text-center text-nowrap">引擎 2.0 控制</p>
                                    <div className="space-y-6 px-1">
                                        <div className="flex items-center gap-4"><span className="text-[10px] font-black w-14 text-gray-400 uppercase tracking-widest">縮放</span><input type="range" min="50" max="350" value={bgSettings.zoom} onChange={e => setBgSettings({ ...bgSettings, zoom: parseInt(e.target.value) })} className="flex-1 accent-blue-500" /><span className="text-[10px] font-mono w-10 text-right font-black">{bgSettings.zoom}%</span></div>
                                        <div className="flex items-center gap-4"><span className="text-[10px] font-black w-14 text-gray-400 uppercase tracking-widest">水平偏移</span><input type="range" min="0" max="100" value={bgSettings.x} onChange={e => setBgSettings({ ...bgSettings, x: parseInt(e.target.value) })} className="flex-1 accent-purple-500" /><span className="text-[10px] font-mono w-10 text-right font-black">{bgSettings.x}%</span></div>
                                        <div className="flex items-center gap-4"><span className="text-[10px] font-black w-14 text-gray-400 uppercase tracking-widest">垂直偏移</span><input type="range" min="0" max="100" value={bgSettings.y} onChange={e => setBgSettings({ ...bgSettings, y: parseInt(e.target.value) })} className="flex-1 accent-purple-500" /><span className="text-[10px] font-mono w-10 text-right font-black">{bgSettings.y}%</span></div>
                                        <div className="flex items-center gap-4"><span className="text-[10px] font-black w-14 text-red-500 uppercase tracking-widest">旋轉角度</span><input type="range" min="0" max="360" value={bgSettings.rotate} onChange={e => setBgSettings({ ...bgSettings, rotate: parseInt(e.target.value) })} className="flex-1 accent-emerald-500" /><span className="text-[10px] font-mono w-10 text-right font-black">{bgSettings.rotate}°</span></div>
                                    </div>
                                    <button onClick={() => setBgSettings({ zoom: 100, x: 50, y: 50, rotate: 0 })} className="w-full text-[9px] font-black text-gray-400 uppercase tracking-widest py-3 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 active:scale-95 transition">重設數值</button>
                                </div>
                            )}
                        </div>
                    )}
                </GlassPanel>
            </div>
        </div>
    );
}
