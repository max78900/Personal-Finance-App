import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { renderIcon } from '../utils/helpers';
import GlassPanel from './GlassPanel';
import { getSpeechRecognition } from '../services/speechRecognition';

export default function AddRecordModal() {
    const {
        glassStyle, setIsAdding, form, setForm, expenseCategories, incomeCategories,
        aiInput, setAiInput, handleAIParse, isAiProcessing, saveToCloud, loading,
        editingRecordIndex
    } = useAppContext();

    const [isListening, setIsListening] = useState(false);
    const [rawDate, setRawDate] = useState(form.date ? form.date.replace(/-/g, '') : '');

    React.useEffect(() => {
        setRawDate(form.date ? form.date.replace(/-/g, '') : '');
    }, [form.date]);

    const handleDateType = (e) => {
        const v = e.target.value.replace(/\D/g, '');
        setRawDate(v);
        if (v.length === 8) {
            setForm({ ...form, date: `${v.substring(0, 4)}-${v.substring(4, 6)}-${v.substring(6, 8)}` });
        } else if (v.length === 4) {
            const ty = new Date().getFullYear();
            setForm({ ...form, date: `${ty}-${v.substring(0, 2)}-${v.substring(2, 4)}` });
        }
    };

    const list = form.type === '支出' ? expenseCategories : incomeCategories;

    const handleVoiceInput = () => {
        const recognition = getSpeechRecognition(
            (transcript) => {
                setAiInput((prev) => prev + (prev ? " " : "") + transcript);
                setIsListening(false);
            },
            (error) => {
                console.error("Speech Recognition Error:", error);
                setIsListening(false);
            },
            () => setIsListening(false)
        );
        if (recognition) {
            setIsListening(true);
            recognition.start();
        } else {
            alert('抱歉，您的瀏覽器不支援語音輸入功能。');
        }
    };

    return (
        <GlassPanel style={glassStyle} className="fixed inset-y-0 inset-x-0 mx-auto max-w-md w-full z-50 flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="px-4 py-4 flex items-center border-b border-white/50 bg-white/80 shadow-sm sticky top-0 z-10 text-gray-800">
                <button onClick={() => setIsAdding(false)} className="text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm border transition hover:bg-gray-50 active:scale-90">&lt; 返回</button>
                <h2 className="flex-1 text-center font-black text-lg">{editingRecordIndex !== null ? '修改紀錄' : '新增紀錄'}</h2><div className="w-20"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar pb-10">
                <div className="flex bg-white/80 rounded-2xl p-1 shadow-sm border border-white">
                    <button onClick={() => setForm({ ...form, type: '支出', category: expenseCategories[0].name })} className={`flex-1 py-3 font-bold rounded-xl transition ${form.type === '支出' ? 'bg-yellow-400 text-gray-900 shadow' : 'text-gray-500'}`}>支出</button>
                    <button onClick={() => setForm({ ...form, type: '收入', category: incomeCategories[0].name })} className={`flex-1 py-3 font-bold rounded-xl transition ${form.type === '收入' ? 'bg-blue-400 text-white shadow' : 'text-gray-500'}`}>收入</button>
                </div>
                <div className="bg-white/80 p-5 rounded-[32px] shadow-sm border border-white">
                    <label className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-widest ml-1">記帳日期</label>
                    <div className="flex bg-gray-50 border border-gray-100 p-2 rounded-[20px] shadow-inner items-center focus-within:ring-2 ring-blue-400">
                        <input type="text" value={rawDate} onChange={handleDateType} placeholder="輸入數字(如0225) 支援彈窗 ->" maxLength={8} className="flex-1 bg-transparent px-3 py-2 outline-none font-black text-gray-700 w-full" />
                        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-transparent font-black outline-none text-gray-600 cursor-pointer text-sm h-8 relative custom-date-icon" />
                    </div>
                </div>
                <div className="bg-white/80 p-5 rounded-[32px] shadow-sm border border-white">
                    <p className="text-xs font-bold text-blue-600 mb-3 flex items-center gap-1 uppercase tracking-tighter"><i className="fa-solid fa-wand-magic-sparkles"></i> AI 智能解析</p>
                    <div className="flex gap-2">
                        <input type="text" placeholder="例: 午餐100 坐車50" className="flex-1 bg-white border border-gray-200 rounded-[18px] px-4 outline-none py-3 text-sm shadow-inner" value={aiInput} onChange={e => setAiInput(e.target.value)} />

                        <button onClick={handleVoiceInput} className={`px-4 py-3 rounded-[18px] font-black shadow-lg active:scale-95 transition-all flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            <i className="fa-solid fa-microphone"></i>
                        </button>

                        <button onClick={handleAIParse} disabled={isAiProcessing} className="bg-blue-500 text-white px-6 py-3 rounded-[18px] font-black shadow-lg active:scale-95 transition-all text-xs">解析</button>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 px-1">
                    {list.map(c => (
                        <button key={c.name} onClick={() => setForm({ ...form, category: c.name })} className={`flex flex-col items-center p-3 rounded-[28px] bg-white shadow-md transition-all ${form.category === c.name ? 'border-2 border-gray-800 scale-105 shadow-2xl z-10' : 'border-2 border-transparent opacity-60 hover:opacity-100'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden`}>{renderIcon(c)}</div>
                            <span className="text-[9px] font-black mt-2 text-gray-700 truncate w-full px-1 text-center uppercase">{c.name}</span>
                        </button>
                    ))}
                </div>
                <form onSubmit={saveToCloud} className="space-y-4 bg-white/80 p-8 rounded-[40px] shadow-xl border border-white">
                    <input type="text" required placeholder="項目名稱" value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} className="w-full border border-gray-100 p-4 rounded-2xl outline-none focus:border-gray-800 font-black shadow-inner" />
                    <input type="number" required placeholder="$ 金額" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border border-gray-100 p-4 rounded-2xl outline-none text-3xl font-black text-gray-800 shadow-inner" />
                    <button type="submit" disabled={loading} className="w-full bg-gray-800 text-white font-black py-6 rounded-[28px] mt-4 shadow-2xl hover:bg-black active:scale-95 transition-all tracking-[0.5em] text-sm uppercase">
                        {editingRecordIndex !== null ? '確認修改' : '確認寫入'}
                    </button>
                </form>
            </div>
        </GlassPanel>
    );
}
