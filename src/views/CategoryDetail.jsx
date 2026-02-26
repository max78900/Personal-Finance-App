import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { renderIcon } from '../utils/helpers';
import GlassPanel from '../components/GlassPanel';
import RecordItem from '../components/RecordItem';

export default function CategoryDetail() {
    const {
        glassStyle, setActiveTab, selectedCategory, records, currentMonth,
        deleteRecord, editRecord, incomeCategories, expenseCategories
    } = useAppContext();

    const [filterType, setFilterType] = useState('month'); // 'month', 'year', 'all', 'custom'
    const [customDate, setCustomDate] = useState({ start: '', end: '' });

    if (!selectedCategory) {
        setActiveTab('categories');
        return null;
    }

    const filtered = useMemo(() => {
        return records.filter(r => {
            if (r.類別 !== selectedCategory.name || r.收支 !== selectedCategory.type) return false;
            if (!r.日期) return false;
            if (filterType === 'month') return r.日期.startsWith(currentMonth);
            if (filterType === 'year') {
                const aYearAgo = new Date();
                aYearAgo.setFullYear(aYearAgo.getFullYear() - 1);
                return new Date(r.日期) >= aYearAgo;
            }
            if (filterType === 'custom') {
                if (!customDate.start || !customDate.end) return true;
                return r.日期 >= customDate.start && r.日期 <= customDate.end;
            }
            return true; // all
        }).sort((a, b) => new Date(b.日期) - new Date(a.日期));
    }, [records, selectedCategory, filterType, currentMonth, customDate]);

    const sum = filtered.reduce((acc, r) => acc + (Number(r.金額) || 0), 0);

    return (
        <div className="pb-24 min-h-screen animate-in slide-in-from-right duration-300 overflow-y-auto no-scrollbar px-4 text-gray-800">
            <GlassPanel style={glassStyle} className="px-4 py-3 rounded-2xl mt-4 border border-white/50 sticky top-4 z-10 flex items-center">
                <button onClick={() => setActiveTab('categories')} className="text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm active:scale-90">&lt; 返回</button>
                <h2 className="flex-1 text-center font-black text-lg px-2 truncate">{selectedCategory.name} 明細</h2><div className="w-16"></div>
            </GlassPanel>

            <div className="mt-6 text-gray-800">
                <GlassPanel style={glassStyle} className="p-10 rounded-[48px] mb-8 text-center border border-white/80 shadow-md">
                    <div className="flex bg-white/60 rounded-xl p-1 shadow-sm border border-white/50 mb-4 text-sm font-bold w-full mx-auto max-w-sm">
                        <button onClick={() => setFilterType('month')} className={`flex-1 py-1 px-1 rounded-lg transition ${filterType === 'month' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>本月</button>
                        <button onClick={() => setFilterType('year')} className={`flex-1 py-1 px-1 rounded-lg transition ${filterType === 'year' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>近一年</button>
                        <button onClick={() => setFilterType('all')} className={`flex-1 py-1 px-1 rounded-lg transition ${filterType === 'all' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>全部</button>
                        <button onClick={() => setFilterType('custom')} className={`flex-1 py-1 px-1 rounded-lg transition ${filterType === 'custom' ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}>自訂</button>
                    </div>
                    {filterType === 'custom' && (
                        <div className="flex gap-2 mb-6 items-center bg-white/40 p-2 rounded-lg border border-white/50 w-full max-w-sm mx-auto text-gray-800">
                            <input type="date" value={customDate.start} onChange={e => setCustomDate(pr => ({ ...pr, start: e.target.value }))} className="flex-1 bg-white border border-gray-100 p-2 rounded-md outline-none text-xs shadow-sm bg-transparent" />
                            <span className="text-gray-400 font-black text-xs">至</span>
                            <input type="date" value={customDate.end} onChange={e => setCustomDate(pr => ({ ...pr, end: e.target.value }))} className="flex-1 bg-white border border-gray-100 p-2 rounded-md outline-none text-xs shadow-sm bg-transparent" />
                        </div>
                    )}

                    <div className={`w-20 h-20 rounded-3xl bg-white mx-auto flex justify-center items-center shadow-lg mb-4 overflow-hidden`}>{renderIcon(selectedCategory, "text-3xl")}</div>
                    <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{selectedCategory.name} {filterType === 'month' ? '本月' : (filterType === 'year' ? '近一年' : (filterType === 'all' ? '所有' : '自訂區間'))}統計</p>
                    <p className="text-4xl font-black text-gray-800 mt-2 tracking-tighter">${sum.toLocaleString()}</p>
                </GlassPanel>

                <div className="space-y-4 px-1 text-gray-800">
                    {filtered.map((r, i) => (
                        <GlassPanel key={i} style={glassStyle} className="p-0 rounded-3xl overflow-hidden border border-white/40 shadow-sm">
                            <RecordItem
                                r={r}
                                list={selectedCategory.type === '收入' ? incomeCategories : expenseCategories}
                                deleteRecord={deleteRecord}
                                editRecord={editRecord}
                            />
                        </GlassPanel>
                    ))}
                    {filtered.length === 0 && <p className="text-center font-black text-gray-400 mt-10">尚無紀錄</p>}
                </div>
            </div>
        </div>
    );
}
