import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { renderIcon } from '../utils/helpers';
import GlassPanel from '../components/GlassPanel';
import RecordItem from '../components/RecordItem';

export default function Home() {
    const [chartFilter, setChartFilter] = useState('month'); // 'month' or 'all'
    const {
        glassStyle, setIsMenuOpen, currentMonth, setCurrentMonth, setTempYear, setShowDatePicker,
        fetchFromCloud, loading, reportType, setReportType, setActiveTab,
        groupedRecords, deleteRecord, editRecord, records, currentMonthRecords,
        incomeCategories, expenseCategories
    } = useAppContext();

    const changeMonth = (offset) => {
        const [y, m] = currentMonth.split('-').map(Number);
        let date = new Date(y, m - 1 + offset, 1);
        setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    };

    const chartRecords = useMemo(() => chartFilter === 'month' ? currentMonthRecords : records, [chartFilter, currentMonthRecords, records]);

    const chartTotals = useMemo(() => {
        let inc = 0, exp = 0;
        chartRecords.forEach(r => { if (r.收支 === '收入') inc += Number(r.金額) || 0; else exp += Number(r.金額) || 0; });
        return { income: inc, expense: exp, balance: inc - exp };
    }, [chartRecords]);

    const chartPieData = useMemo(() => {
        const dataMap = {}; let total = 0;
        chartRecords.filter(r => r.收支 === reportType).forEach(r => {
            const amt = Number(r.金額) || 0; dataMap[r.類別] = (dataMap[r.類別] || 0) + amt; total += amt;
        });
        const list = reportType === '收入' ? incomeCategories : expenseCategories;
        return Object.keys(dataMap).map(name => {
            const catObj = list.find(c => c.name === name) || { hex: '#9ca3af' };
            return { name, value: dataMap[name], pct: total ? (dataMap[name] / total * 100) : 0, hex: catObj.hex };
        }).sort((a, b) => b.value - a.value);
    }, [chartRecords, expenseCategories, incomeCategories, reportType]);

    return (
        <div className="pb-24 animate-in fade-in duration-300 overflow-y-auto no-scrollbar h-screen px-4">
            <GlassPanel style={glassStyle} className="px-4 py-3 rounded-2xl mt-4 border border-white/40 flex justify-between items-center sticky top-4 z-10">
                <button onClick={() => setIsMenuOpen(true)} className="p-1 active:scale-90 transition max-w-8">
                    <i className="fa-solid fa-bars text-gray-500 text-xl"></i>
                </button>
                <div className="flex items-center gap-1 mx-2 overflow-hidden justify-center flex-1">
                    <button onClick={() => changeMonth(-1)} className="p-2 text-gray-500 hover:text-gray-800 transition active:scale-90"><i className="fa-solid fa-chevron-left"></i></button>
                    <div
                        className="font-black text-base sm:text-lg bg-white/60 px-2 sm:px-3 py-1 rounded-lg border border-white/50 cursor-pointer flex items-center gap-1 shadow-sm text-gray-800 whitespace-nowrap"
                        onClick={() => { setTempYear(currentMonth.split('-')[0]); setShowDatePicker(true); }}
                    >
                        {currentMonth.split('-')[0]}年{currentMonth.split('-')[1]}月 <i className="fa-solid fa-caret-down text-sm text-gray-400 hidden sm:inline-block"></i>
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-2 text-gray-500 hover:text-gray-800 transition active:scale-90"><i className="fa-solid fa-chevron-right"></i></button>
                </div>
                <button onClick={fetchFromCloud} className={`max-w-8 ${loading ? 'animate-spin text-blue-500' : 'text-gray-600'}`}>
                    <i className="fa-solid fa-rotate-right text-lg"></i>
                </button>
            </GlassPanel>

            <GlassPanel style={glassStyle} className="mt-6 py-6 px-6 rounded-[32px] border border-white/60 shadow-xl relative overflow-hidden text-center">
                <div className="flex bg-white/60 rounded-xl p-1 shadow-sm border border-white/50 mb-6 text-sm font-bold w-full mx-auto max-w-[200px]">
                    <button onClick={() => setChartFilter('month')} className={`flex-1 py-1 px-1 rounded-lg transition ${chartFilter === 'month' ? 'bg-white shadow pointer-events-none text-gray-800' : 'text-gray-400'}`}>本月</button>
                    <button onClick={() => setChartFilter('all')} className={`flex-1 py-1 px-1 rounded-lg transition ${chartFilter === 'all' ? 'bg-white shadow pointer-events-none text-gray-800' : 'text-gray-400'}`}>所有</button>
                </div>
                <div className="flex justify-between mb-4 relative z-10">
                    <div className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => { setReportType('支出'); setActiveTab('report'); }}>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest border-b-2 border-yellow-400 pb-1">{chartFilter === 'month' ? '月' : '總'}支出</p>
                        <p className="text-2xl font-black mt-1 text-gray-800">${chartTotals.expense.toLocaleString()}</p>
                    </div>
                    <div className="text-right cursor-pointer hover:opacity-70 transition-opacity" onClick={() => { setReportType('收入'); setActiveTab('report'); }}>
                        <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest border-b-2 border-blue-400 pb-1 text-nowrap">{chartFilter === 'month' ? '月' : '總'}收入</p>
                        <p className="text-2xl font-black mt-1 text-gray-800">${chartTotals.income.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex justify-center relative my-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => { setActiveTab('report'); }}>
                    <svg viewBox="0 0 42 42" className="w-44 h-44 drop-shadow-2xl">
                        <circle r="15.915" cx="21" cy="21" fill="transparent" stroke="#f3f4f6" strokeWidth="6" />
                        {(() => {
                            let off = 25;
                            return chartPieData.map((d, i) => {
                                const ret = <circle key={i} r="15.915" cx="21" cy="21" fill="transparent" stroke={d.hex} strokeWidth="6" strokeDasharray={`${d.pct} ${100 - d.pct}`} strokeDashoffset={off} className="transition-all duration-700" />;
                                off -= d.pct;
                                return ret;
                            });
                        })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{chartFilter === 'month' ? '月' : '總'}結餘</p>
                        <p className="text-2xl font-black text-gray-800 tracking-tighter">${chartTotals.balance.toLocaleString()}</p>
                    </div>
                </div>
            </GlassPanel>

            <div className="mt-6 space-y-4">
                {Object.keys(groupedRecords).map(date => (
                    <GlassPanel key={date} style={glassStyle} className="mb-4 rounded-2xl overflow-hidden border border-white/60 shadow-lg">
                        <div className="bg-white/40 px-5 py-2.5 flex justify-between border-b border-white/40 font-black text-xs text-gray-400 uppercase tracking-tighter items-center">
                            <span>{date}</span> <span className={groupedRecords[date].dailyTotal < 0 ? 'text-yellow-600' : ''}>${groupedRecords[date].dailyTotal.toLocaleString()}</span>
                        </div>
                        <div className="divide-y divide-gray-200/40">
                            {groupedRecords[date].records.map((r, i) => {
                                const list = r.收支 === '收入' ? incomeCategories : expenseCategories;
                                return <RecordItem key={i} r={r} list={list} deleteRecord={deleteRecord} editRecord={editRecord} />;
                            })}
                        </div>
                    </GlassPanel>
                ))}
            </div>
        </div>
    );
}
