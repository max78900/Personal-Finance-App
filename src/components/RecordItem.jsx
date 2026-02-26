import React, { useState } from 'react';
import { renderIcon } from '../utils/helpers';

export default function RecordItem({ r, list, deleteRecord, editRecord }) {
    const [swiped, setSwiped] = useState(false);
    let startX = 0;

    const isInc = r.收支 === '收入';
    const amountStr = (isInc ? '+' : '') + (isInc ? Number(r.金額) : -Number(r.金額)).toLocaleString(); // The request specifically asked for formatting + and -
    const colorClass = isInc ? 'text-green-600' : 'text-red-500';
    const cat = list.find(c => c.name === r.類別) || { icon: 'fa-border-all', color: 'text-gray-400', hex: '#9ca3af' };

    return (
        <div
            onTouchStart={(e) => { startX = e.touches[0].clientX; }}
            onTouchMove={(e) => {
                if (!startX) return;
                const diffX = startX - e.touches[0].clientX;
                if (diffX > 40) setSwiped(true);
                if (diffX < -40) setSwiped(false);
            }}
            onDoubleClick={() => setSwiped(!swiped)}
            className="px-5 flex justify-between group relative overflow-hidden items-center hover:bg-white/30 transition-colors h-[72px]"
        >
            <div className={`flex items-center gap-4 z-10 transition-transform duration-300 w-full ${swiped ? '-translate-x-32' : 'translate-x-0'} `}>
                <div className={`w-11 h-11 rounded-xl bg-white shadow-md flex justify-center items-center overflow-hidden flex-shrink-0`}>{renderIcon(cat)}</div>
                <div className="flex-1 min-w-0 pr-2">
                    <p className="font-bold text-sm text-gray-800 leading-tight truncate">{r.項目}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold italic truncate">{r.類別} {r.備註}</p>
                </div>
                <div className={`font-black ${colorClass} z-10 text-sm tracking-tight flex-shrink-0`}>
                    {amountStr}
                </div>
            </div>
            <div className={`absolute right-0 top-0 bottom-0 flex transition-transform duration-300 z-20 ${swiped ? 'translate-x-0' : 'translate-x-full'}`}>
                <button
                    onClick={() => { if (window.confirm('確定要修改這筆紀錄嗎？')) { editRecord(r); setSwiped(false); } }}
                    className="bg-blue-500/90 text-white w-16 flex justify-center items-center font-bold text-xs shadow-inner hover:bg-blue-600 transition"
                >修改</button>
                <button
                    onClick={() => { if (window.confirm('確定要刪除這筆紀錄嗎？')) { deleteRecord(r._rowIndex); setSwiped(false); } }}
                    className="bg-red-500/90 text-white w-16 flex justify-center items-center font-bold text-xs shadow-inner hover:bg-red-600 transition"
                >刪除</button>
            </div>
        </div>
    );
}
