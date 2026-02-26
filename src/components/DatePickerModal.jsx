import React from 'react';
import { useAppContext } from '../context/AppContext';
import GlassPanel from './GlassPanel';

export default function DatePickerModal() {
    const {
        showDatePicker, setShowDatePicker,
        tempYear, setTempYear, setCurrentMonth, glassStyle
    } = useAppContext();

    if (!showDatePicker) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
            <GlassPanel style={glassStyle} className="p-10 w-full max-w-xs animate-in zoom-in rounded-[48px] border border-white/50 shadow-2xl">
                <div className="flex justify-between items-center mb-8 bg-white/80 p-3 rounded-2xl shadow-inner border border-white">
                    <button onClick={() => setTempYear(y => String(Number(y) - 1))} className="p-3 text-gray-400 hover:text-gray-800 transition active:scale-90"><i className="fa-solid fa-minus"></i></button>
                    <input type="number" value={tempYear} onChange={e => setTempYear(e.target.value)} className="w-24 text-center text-4xl font-black bg-transparent outline-none text-gray-800" />
                    <button onClick={() => setTempYear(y => String(Number(y) + 1))} className="p-3 text-gray-400 hover:text-gray-800 transition active:scale-90"><i className="fa-solid fa-plus"></i></button>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-8">
                    {[...Array(12)].map((_, i) => (
                        <button key={i} onClick={() => { setCurrentMonth(`${tempYear}-${String(i + 1).padStart(2, '0')}`); setShowDatePicker(false); }} className="py-4 rounded-2xl bg-white shadow-md hover:bg-blue-600 hover:text-white font-black text-xs transition-all border border-gray-100">{i + 1}月</button>
                    ))}
                </div>
                <button onClick={() => setShowDatePicker(false)} className="w-full py-5 bg-gray-800 text-white font-black rounded-3xl shadow-xl uppercase tracking-[0.3em] text-xs active:scale-95 transition-all">取消</button>
            </GlassPanel>
        </div>
    );
}
