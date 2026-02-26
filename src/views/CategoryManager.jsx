import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { renderIcon } from '../utils/helpers';
import GlassPanel from '../components/GlassPanel';
import EditCatsModal from '../components/EditCatsModal';

export default function CategoryManager() {
    const {
        glassStyle, setActiveTab, catType, setCatType,
        expenseCategories, incomeCategories, records, currentMonth,
        setSelectedCategory, isEditingCats, setIsEditingCats, setEditingCatIdx
    } = useAppContext();

    const [filterType, setFilterType] = useState('month'); // 'month', 'year', 'all', 'custom'
    const [customDate, setCustomDate] = useState({ start: '', end: '' });

    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            if (!r.日期) return false;
            if (filterType === 'month') return r.日期.startsWith(currentMonth);
            if (filterType === 'year') {
                const d = new Date(r.日期);
                const aYearAgo = new Date();
                aYearAgo.setFullYear(aYearAgo.getFullYear() - 1);
                return d >= aYearAgo;
            }
            if (filterType === 'custom') {
                if (!customDate.start || !customDate.end) return true;
                return r.日期 >= customDate.start && r.日期 <= customDate.end; // String compare YYYY-MM-DD
            }
            return true; // all
        });
    }, [records, filterType, currentMonth, customDate]);

    const list = catType === '支出' ? expenseCategories : incomeCategories;
    const totalByCat = {};
    filteredRecords.filter(r => r.收支 === catType).forEach(r => { totalByCat[r.類別] = (totalByCat[r.類別] || 0) + (Number(r.金額) || 0); });

    return (
        <div className="pb-24 min-h-screen animate-in fade-in duration-300 overflow-y-auto no-scrollbar px-4">
            <GlassPanel style={glassStyle} className="px-4 py-3 rounded-2xl mt-4 border border-white/50 sticky top-4 z-10 flex items-center">
                <button onClick={() => setActiveTab('home')} className="text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 active:scale-90">&lt; 返回</button>
                <h2 className="flex-1 text-center font-black text-lg text-gray-800">分類管理</h2>
                <button onClick={() => { setEditingCatIdx(-1); setIsEditingCats(true); }} className="p-2 bg-white rounded-lg shadow-sm border text-gray-600 active:scale-90 transition shadow-lg"><i className="fa-solid fa-pen-to-square"></i></button>
            </GlassPanel>

            <div className="mt-6">
                <div className="flex bg-white/60 rounded-xl p-1 shadow-sm border border-white/50 mb-3 text-sm font-bold w-full mx-auto">
                    <button onClick={() => setFilterType('month')} className={`flex-1 py-1 px-1 rounded-lg transition ${filterType === 'month' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>本月</button>
                    <button onClick={() => setFilterType('year')} className={`flex-1 py-1 px-1 rounded-lg transition ${filterType === 'year' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>近一年</button>
                    <button onClick={() => setFilterType('all')} className={`flex-1 py-1 px-1 rounded-lg transition ${filterType === 'all' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>所有</button>
                    <button onClick={() => setFilterType('custom')} className={`flex-1 py-1 px-1 rounded-lg transition ${filterType === 'custom' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>自訂</button>
                </div>
                {filterType === 'custom' && (
                    <div className="flex gap-2 mb-4 items-center bg-white/40 p-2 rounded-lg border border-white/50 w-full mx-auto text-gray-800">
                        <input type="date" value={customDate.start} onChange={e => setCustomDate(pr => ({ ...pr, start: e.target.value }))} className="flex-1 bg-white border border-gray-100 p-2 rounded-md outline-none text-xs shadow-sm bg-transparent" />
                        <span className="text-gray-400 font-black text-xs">至</span>
                        <input type="date" value={customDate.end} onChange={e => setCustomDate(pr => ({ ...pr, end: e.target.value }))} className="flex-1 bg-white border border-gray-100 p-2 rounded-md outline-none text-xs shadow-sm bg-transparent" />
                    </div>
                )}

                <div className="flex bg-white/60 rounded-2xl p-1 mb-6 border border-white/50 shadow-sm">
                    <button onClick={() => setCatType('支出')} className={`flex-1 py-3 font-bold rounded-xl transition-all ${catType === '支出' ? 'bg-yellow-400 shadow-md text-gray-900' : 'text-gray-500'}`}>支出</button>
                    <button onClick={() => setCatType('收入')} className={`flex-1 py-3 font-bold rounded-xl transition-all ${catType === '收入' ? 'bg-blue-400 text-white shadow-md' : 'text-gray-500'}`}>收入</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {list.map(c => (
                        <GlassPanel
                            key={c.name}
                            onClick={() => { setSelectedCategory({ ...c, type: catType }); setActiveTab('categoryDetail'); }}
                            style={glassStyle}
                            className="p-5 rounded-[32px] flex justify-between items-center cursor-pointer active:scale-95 hover:scale-[1.02] transition-all border border-white/40 shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl bg-white shadow-inner flex justify-center items-center overflow-hidden`}>{renderIcon(c, "text-xl")}</div>
                                <div><p className="font-black text-gray-800 text-lg leading-none mb-1">{c.name}</p><p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">查看明細</p></div>
                            </div>
                            <p className="font-black text-gray-700 text-xl tracking-tighter">${(totalByCat[c.name] || 0).toLocaleString()}</p>
                        </GlassPanel>
                    ))}
                </div>
            </div>

            {isEditingCats && <EditCatsModal />}
        </div>
    );
}
