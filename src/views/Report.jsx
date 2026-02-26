import React from 'react';
import { useAppContext } from '../context/AppContext';
import { renderIcon } from '../utils/helpers';
import GlassPanel from '../components/GlassPanel';

export default function Report() {
    const {
        glassStyle, setActiveTab, reportType, setReportType,
        reportData, totals, trendData
    } = useAppContext();

    return (
        <div className="pb-24 min-h-screen animate-in fade-in duration-300 overflow-y-auto no-scrollbar px-4">
            <GlassPanel style={glassStyle} className="px-4 py-3 rounded-2xl mt-4 border border-white/50 sticky top-4 z-10 flex items-center text-gray-800">
                <button onClick={() => setActiveTab('home')} className="text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm border transition active:scale-90">&lt; 返回</button>
                <div className="flex-1 flex justify-center px-2">
                    <div className="flex bg-white/80 rounded-xl p-1 shadow-sm border border-white">
                        {['支出', '收入', '結餘'].map(t => (
                            <button key={t} onClick={() => setReportType(t)} className={`px-4 py-1.5 font-bold text-[10px] rounded-lg transition-all ${reportType === t ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500'}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="w-16"></div>
            </GlassPanel>

            {reportType !== '結餘' ? (
                <GlassPanel style={glassStyle} className="mt-6 pt-10 pb-6 rounded-[48px] border border-white/50 shadow-xl text-center">
                    <div className="flex justify-center relative">
                        <svg viewBox="0 0 42 42" className="w-64 h-64 drop-shadow-2xl">
                            <circle r="15.915" cx="21" cy="21" fill="transparent" stroke="#f3f4f6" strokeWidth="6" />
                            {(() => {
                                let off = 25;
                                return reportData.map((d, i) => {
                                    const ret = <circle key={i} r="15.915" cx="21" cy="21" fill="transparent" stroke={d.hex} strokeWidth="6" strokeDasharray={`${d.pct} ${100 - d.pct}`} strokeDashoffset={off} className="transition-all duration-700" />;
                                    off -= d.pct;
                                    return ret;
                                });
                            })()}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">總計{reportType}</p>
                            <p className="text-4xl font-black text-gray-800 tracking-tighter">${totals[reportType === '支出' ? 'expense' : 'income'].toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="mt-10 px-4 divide-y divide-gray-200/50 bg-white/60 mx-4 rounded-3xl shadow-inner border border-white/50 overflow-hidden">
                        {reportData.map((d, i) => (
                            <div key={i} className="p-5 flex justify-between items-center transition hover:bg-white/50">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-10 h-10 rounded-2xl flex justify-center items-center text-white text-[12px] overflow-hidden shadow-md" style={{ backgroundColor: d.hex }}>
                                        {renderIcon(d, "text-xs")}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800 text-sm">{d.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{d.pct.toFixed(1)}% 佔比</p>
                                    </div>
                                </div>
                                <p className="font-black text-gray-800 text-base">${d.value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </GlassPanel>
            ) : (
                <GlassPanel style={glassStyle} className="mt-6 pt-10 pb-12 rounded-[48px] border border-white/50 shadow-xl px-8 text-center">
                    <h3 className="font-black text-xl text-gray-800 mb-2 tracking-tighter">資產水位趨勢</h3>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.4em] mb-10">近三個月趨勢</p>
                    <div className="flex justify-between items-end h-40 gap-4 border-b-4 border-gray-100 pb-2 mb-6 px-4">
                        {trendData.map((d, i) => {
                            const maxVal = Math.max(...trendData.map(t => Math.max(t.inc, t.exp, Math.abs(t.bal))), 1);
                            return (
                                <div key={i} className="flex flex-col items-center h-full justify-end flex-1">
                                    <div className="flex gap-1.5 items-end w-full h-full justify-center">
                                        <div className="w-4 bg-yellow-400 rounded-t-lg shadow-sm transition-all duration-1000" style={{ height: (d.exp / maxVal) * 100 + '%' }}></div>
                                        <div className="w-4 bg-blue-400 rounded-t-lg shadow-sm transition-all duration-1000" style={{ height: (d.inc / maxVal) * 100 + '%' }}></div>
                                    </div>
                                    <div className={`text-[10px] font-black mt-3 ${d.bal >= 0 ? 'text-green-600' : 'text-red-500'}`}>{d.bal.toLocaleString()}</div>
                                    <div className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-tighter">{d.month}</div>
                                </div>
                            )
                        })}
                    </div>
                </GlassPanel>
            )}
        </div>
    );
}
