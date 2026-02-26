import React from 'react';
import { useAppContext, PREDEFINED_ICONS } from '../context/AppContext';
import { renderIcon } from '../utils/helpers';
import GlassPanel from './GlassPanel';

export default function EditCatsModal() {
    const {
        glassStyle, catType, expenseCategories, incomeCategories,
        setExpenseCategories, setIncomeCategories,
        editingCatIdx, setEditingCatIdx, newCat, setNewCat,
        setIsEditingCats, handleImageUpload
    } = useAppContext();

    const list = catType === '支出' ? expenseCategories : incomeCategories;
    const setList = catType === '支出' ? setExpenseCategories : setIncomeCategories;

    const handleSaveCat = () => {
        if (!newCat.name.trim()) return alert("請輸入名稱");
        const newList = [...list];
        if (editingCatIdx > -1) newList[editingCatIdx] = { ...newCat };
        else newList.push({ ...newCat, isDefault: false });
        setList(newList); setEditingCatIdx(-1);
        setNewCat({ name: '', icon: 'fa-star', color: 'text-blue-500', hex: '#3b82f6', isCustomUrl: false, customUrl: '', isDefault: false });
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in">
            <GlassPanel style={glassStyle} className="w-full max-w-sm p-6 rounded-[48px] border border-white/50 shadow-2xl animate-in zoom-in max-h-[90vh] overflow-y-auto no-scrollbar text-gray-800">
                <h3 className="font-black text-2xl mb-2 text-center tracking-tighter">類別管理系統</h3>
                <div className="space-y-2 mb-6">
                    {list.map((c, i) => (
                        <div key={i} className={`p-4 rounded-3xl flex justify-between items-center border transition-all ${editingCatIdx === i ? 'bg-blue-50 border-blue-300 shadow-inner' : 'bg-white/60 border-white shadow-sm'}`}>
                            <div className="flex items-center gap-3"><div className={`w-11 h-11 rounded-xl bg-white flex justify-center items-center shadow-sm overflow-hidden`}>{renderIcon(c)}</div><span className="font-black text-sm text-gray-700">{c.name}</span></div>
                            <div className="flex gap-1">
                                {!c.isDefault && <button onClick={() => { setEditingCatIdx(i); setNewCat({ ...c }); }} className="text-gray-400 p-2 hover:text-blue-500 transition-colors"><i className="fa-solid fa-pen"></i></button>}
                                {!c.isDefault && <button onClick={() => { const n = [...list]; n.splice(i, 1); setList(n); }} className="text-red-400 p-2"><i className="fa-solid fa-trash-can"></i></button>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white/80 p-6 rounded-[40px] border border-white/50 space-y-5 shadow-inner">
                    <input type="text" placeholder="分類名稱" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none font-bold text-sm shadow-sm focus:border-blue-400 transition-all" />
                    <div className="grid grid-cols-2 gap-4">
                        <label onDrop={(e) => handleImageUpload(e, 'cat')} onDragOver={e => e.preventDefault()} className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 p-4 rounded-[24px] bg-purple-50/20 hover:bg-white cursor-pointer h-24 transition-all">
                            {newCat.isCustomUrl ? <img src={newCat.customUrl} className="w-12 h-12 rounded-xl object-cover shadow-md mb-1 border-2 border-white" /> : <i className="fa-solid fa-cloud-arrow-up text-2xl text-purple-300"></i>}
                            <span className="text-[8px] font-black text-purple-400 mt-1 uppercase tracking-widest text-center text-nowrap">拖曳自訂圖示</span>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'cat')} className="hidden" />
                        </label>
                        <div className="bg-white/70 p-3 rounded-[24px] border border-white shadow-sm flex flex-col items-center justify-center">
                            <input type="color" value={newCat.hex} onChange={e => setNewCat({ ...newCat, hex: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent" />
                            <span className="text-[9px] font-mono font-black text-gray-400 mt-2 uppercase">{newCat.hex}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar border-t">
                        {PREDEFINED_ICONS.map(ic => (
                            <button key={ic} onClick={() => setNewCat({ ...newCat, icon: ic, isCustomUrl: false })} className={`p-2.5 min-w-[40px] rounded-xl transition-all ${newCat.icon === ic ? 'bg-gray-800 text-white scale-110 shadow-lg' : 'bg-white text-gray-400 border shadow-sm'}`}><i className={`fa-solid ${ic}`}></i></button>
                        ))}
                    </div>
                    <button onClick={handleSaveCat} className={`w-full text-white font-black py-4 rounded-[20px] shadow-xl active:scale-95 transition-all text-xs tracking-[0.3em] uppercase ${editingCatIdx > -1 ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                        {editingCatIdx > -1 ? '更新分類' : '確認建立'}
                    </button>
                    {editingCatIdx > -1 && <button onClick={() => setEditingCatIdx(-1)} className="w-full text-gray-400 text-[10px] font-bold uppercase tracking-widest">取消編輯</button>}
                </div>
                <button onClick={() => setIsEditingCats(false)} className="w-full py-4 bg-gray-800 text-white font-black rounded-[24px] mt-6 active:scale-95 transition shadow-2xl tracking-widest text-sm uppercase">關閉編輯器</button>
            </GlassPanel>
        </div>
    );
}
