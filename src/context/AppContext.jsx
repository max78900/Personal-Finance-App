import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { hexToRgba } from '../utils/helpers';
import { fetchRecordsFromCloud, addRecordToCloud, deleteRecordFromCloud } from '../services/googleSheets';
import { parseTextWithGemini } from '../services/gemini';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

const baseExp = [
    { name: '餐飲', icon: 'fa-utensils', color: 'text-orange-500', hex: '#f97316', isDefault: true },
    { name: '遊戲', icon: 'fa-gamepad', color: 'text-purple-500', hex: '#a855f7', isDefault: true },
    { name: '醫療', icon: 'fa-briefcase-medical', color: 'text-red-500', hex: '#ef4444', isDefault: true },
    { name: '交通', icon: 'fa-bus', color: 'text-blue-400', hex: '#60a5fa', isDefault: true },
    { name: '其他', icon: 'fa-border-all', color: 'text-gray-400', hex: '#9ca3af', isDefault: true }
];
const baseInc = [
    { name: '薪水', icon: 'fa-wallet', color: 'text-green-500', hex: '#22c55e', isDefault: true },
    { name: '獎金', icon: 'fa-sack-dollar', color: 'text-yellow-500', hex: '#eab308', isDefault: true }
];
export const PREDEFINED_ICONS = ['fa-utensils', 'fa-mug-hot', 'fa-bag-shopping', 'fa-gamepad', 'fa-plane', 'fa-bus', 'fa-dumbbell', 'fa-music', 'fa-house', 'fa-wallet', 'fa-sack-dollar', 'fa-chart-line', 'fa-microchip', 'fa-camera', 'fa-gift', 'fa-heart', 'fa-bolt', 'fa-star'];

export const AppProvider = ({ children }) => {
    // 1. Navigation & UI State
    const [activeTab, setActiveTab] = useState('home');
    const [isAdding, setIsAdding] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempYear, setTempYear] = useState('');

    // 2. Theme State
    const [appTheme, setAppTheme] = useState(() => JSON.parse(localStorage.getItem('app_theme')) || { type: 'color', value: '#f3f4f6' });
    const [bgImage, setBgImage] = useState(() => localStorage.getItem('custom_bg') || '');
    const [bgSettings, setBgSettings] = useState(() => JSON.parse(localStorage.getItem('bg_settings')) || { zoom: 100, x: 50, y: 50, rotate: 0 });
    const [glassOpacity, setGlassOpacity] = useState(() => Number(localStorage.getItem('glass_opacity')) || 0.85);
    const [panelColor, setPanelColor] = useState(() => localStorage.getItem('panel_color') || '#ffffff');
    const [isConnOpen, setIsConnOpen] = useState(true);
    const [isVisualOpen, setIsVisualOpen] = useState(true);

    const glassStyle = {
        background: hexToRgba(panelColor, glassOpacity),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
    };

    // 3. Data State
    const [currentMonth, setCurrentMonth] = useState(() => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const [apiUrl, setApiUrl] = useState(localStorage.getItem('gs_api_url') || '');
    const [apiToken, setApiToken] = useState(localStorage.getItem('gs_api_token') || '12345');
    const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');

    const [expenseCategories, setExpenseCategories] = useState(() => JSON.parse(localStorage.getItem('exp_cats')) || baseExp);
    const [incomeCategories, setIncomeCategories] = useState(() => JSON.parse(localStorage.getItem('inc_cats')) || baseInc);

    const [reportType, setReportType] = useState('支出');
    const [catType, setCatType] = useState('支出');
    const [isEditingCats, setIsEditingCats] = useState(false);
    const [editingCatIdx, setEditingCatIdx] = useState(-1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCat, setNewCat] = useState({ name: '', icon: 'fa-star', color: '', hex: '#3b82f6', isCustomUrl: false, customUrl: '', isDefault: false });

    const [editingRecordIndex, setEditingRecordIndex] = useState(null);

    const [form, setForm] = useState({ type: '支出', category: '餐飲', item: '', amount: '', note: '', date: new Date().toISOString().split('T')[0] });
    const [aiInput, setAiInput] = useState('');
    const [isAiProcessing, setIsAiProcessing] = useState(false);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('app_theme', JSON.stringify(appTheme));
        localStorage.setItem('bg_settings', JSON.stringify(bgSettings));
        localStorage.setItem('glass_opacity', glassOpacity);
        localStorage.setItem('panel_color', panelColor);
        localStorage.setItem('exp_cats', JSON.stringify(expenseCategories));
        localStorage.setItem('inc_cats', JSON.stringify(incomeCategories));
    }, [appTheme, bgSettings, glassOpacity, panelColor, expenseCategories, incomeCategories]);

    // Computed Values
    const currentMonthRecords = useMemo(() => {
        return records.filter(r => r.日期 && r.日期.includes(currentMonth)).sort((a, b) => new Date(b.日期) - new Date(a.日期));
    }, [records, currentMonth]);

    const totals = useMemo(() => {
        let inc = 0, exp = 0;
        currentMonthRecords.forEach(r => { if (r.收支 === '收入') inc += Number(r.金額) || 0; else exp += Number(r.金額) || 0; });
        return { income: inc, expense: exp, balance: inc - exp };
    }, [currentMonthRecords]);

    const categoryBreakdown = useMemo(() => {
        const dataMap = {}; let total = 0;
        currentMonthRecords.filter(r => r.收支 === '支出').forEach(r => {
            const amt = Number(r.金額) || 0; dataMap[r.類別] = (dataMap[r.類別] || 0) + amt; total += amt;
        });
        return Object.keys(dataMap).map(name => {
            const catObj = expenseCategories.find(c => c.name === name) || { hex: '#9ca3af' };
            return { name, value: dataMap[name], pct: total ? (dataMap[name] / total * 100) : 0, hex: catObj.hex };
        }).sort((a, b) => b.value - a.value);
    }, [currentMonthRecords, expenseCategories]);

    const groupedRecords = useMemo(() => {
        const groups = {}; const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        currentMonthRecords.forEach(r => {
            const d = new Date(r.日期); const dateKey = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} 星期${weekdays[d.getDay()]}`;
            if (!groups[dateKey]) groups[dateKey] = { records: [], dailyTotal: 0 };
            groups[dateKey].records.push(r); groups[dateKey].dailyTotal += (r.收支 === '收入' ? (Number(r.金額) || 0) : -(Number(r.金額) || 0));
        });
        return groups;
    }, [currentMonthRecords]);

    const reportData = useMemo(() => {
        const type = (reportType === '結餘') ? '支出' : reportType;
        const dataMap = {}; let total = 0;
        currentMonthRecords.filter(r => r.收支 === type).forEach(r => {
            const amt = Number(r.金額) || 0; dataMap[r.類別] = (dataMap[r.類別] || 0) + amt; total += amt;
        });
        return Object.keys(dataMap).map(catName => {
            const list = type === '收入' ? incomeCategories : expenseCategories;
            const catObj = list.find(c => c.name === catName) || { name: catName, icon: 'fa-border-all', color: 'text-gray-400', hex: '#9ca3af' };
            return { name: catName, value: dataMap[catName], pct: total ? (dataMap[catName] / total * 100) : 0, ...catObj };
        }).sort((a, b) => b.value - a.value);
    }, [currentMonthRecords, reportType, incomeCategories, expenseCategories]);

    const trendData = useMemo(() => {
        const months = []; const [y, m] = currentMonth.split('-').map(Number);
        for (let i = 2; i >= 0; i--) { let d = new Date(y, m - 1 - i, 1); months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); }
        return months.map(mStr => {
            let inc = 0, exp = 0; records.filter(r => r.日期 && r.日期.includes(mStr)).forEach(r => { if (r.收支 === '收入') inc += Number(r.金額) || 0; else exp += Number(r.金額) || 0; });
            return { month: mStr.split('-')[1] + '月', bal: inc - exp, inc, exp };
        });
    }, [records, currentMonth]);

    // Actions
    const fetchFromCloud = async () => {
        if (!apiUrl) {
            const local = localStorage.getItem('local_records');
            if (local) setRecords(JSON.parse(local));
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(apiUrl, { method: 'POST', body: JSON.stringify({ action: 'get', token: apiToken }) });
            const data = await res.json();
            if (data.status !== 'error') setRecords(Array.isArray(data) ? data : []);
        } catch (e) { console.log(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchFromCloud(); }, [apiUrl, apiToken]);

    const saveToCloud = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        if (!apiUrl) {
            let updated;
            if (editingRecordIndex !== null) {
                updated = records.map(r => r._rowIndex === editingRecordIndex ? { ...r, 日期: form.date, 收支: form.type, 類別: form.category, 項目: form.item, 金額: form.amount, 備註: form.note } : r);
            } else {
                const newRecord = { ...form, 日期: form.date, 收支: form.type, 類別: form.category, 項目: form.item, 金額: form.amount, 備註: form.note, _rowIndex: Date.now() };
                updated = [newRecord, ...records];
            }
            setRecords(updated);
            localStorage.setItem('local_records', JSON.stringify(updated));
            setForm({ type: '支出', category: expenseCategories[0]?.name || '餐飲', item: '', amount: '', note: '', date: new Date().toISOString().split('T')[0] });
            setIsAdding(false); setLoading(false);
            setEditingRecordIndex(null);
            return;
        }
        try {
            await fetch(apiUrl, { method: 'POST', body: JSON.stringify({ ...form, action: editingRecordIndex !== null ? 'edit' : 'add', rowIndex: editingRecordIndex, token: apiToken }) });
            setForm({ type: '支出', category: expenseCategories[0]?.name || '餐飲', item: '', amount: '', note: '', date: new Date().toISOString().split('T')[0] });
            setIsAdding(false);
            setEditingRecordIndex(null);
            await fetchFromCloud();
        } catch (e) { alert('失敗'); } finally { setLoading(false); }
    };

    const editRecord = (r) => {
        setForm({
            type: r.收支,
            category: r.類別,
            item: r.項目,
            amount: r.金額,
            note: r.備註 || '',
            date: r.日期 ? r.日期.split(' ')[0] : new Date().toISOString().split('T')[0]
        });
        setEditingRecordIndex(r._rowIndex);
        setIsAdding(true);
    };

    const startAdding = () => {
        setForm({ type: '支出', category: expenseCategories[0]?.name || '其他', item: '', amount: '', note: '', date: new Date().toISOString().split('T')[0] });
        setEditingRecordIndex(null);
        setIsAdding(true);
    };

    const handleAIParse = async () => {
        if (!geminiKey || !aiInput.trim()) return alert("設定錯誤"); setIsAiProcessing(true);
        try {
            const arr = await parseTextWithGemini(geminiKey, aiInput, form.date);
            if (!apiUrl) {
                const newRecords = arr.map((r, i) => ({ ...r, 日期: r.date || form.date, 收支: r.type, 類別: r.category, 項目: r.item, 金額: r.amount, 備註: r.note, _rowIndex: Date.now() + i }));
                const updated = [...newRecords, ...records];
                setRecords(updated);
                localStorage.setItem('local_records', JSON.stringify(updated));
            } else {
                for (const r of arr) { await fetch(apiUrl, { method: 'POST', body: JSON.stringify({ ...r, date: r.date || form.date, action: 'add', token: apiToken }) }); }
                await fetchFromCloud();
            }
            alert("AI 已完成解析並寫入！"); setAiInput(''); setIsAdding(false);
        } catch (e) { alert("AI 解析失敗: " + e.message); } finally { setIsAiProcessing(false); }
    };

    const deleteRecord = async (rowIndex) => {
        if (!confirm('刪除這筆紀錄？')) return; setLoading(true);
        if (!apiUrl) {
            const updated = records.filter(r => r._rowIndex !== rowIndex);
            setRecords(updated);
            localStorage.setItem('local_records', JSON.stringify(updated));
            setLoading(false);
            return;
        }
        try { await fetch(apiUrl, { method: 'POST', body: JSON.stringify({ action: 'delete', rowIndex, token: apiToken }) }); await fetchFromCloud(); }
        catch (e) { alert('失敗'); } finally { setLoading(false); }
    };

    const handleImageUpload = (e, target = 'bg') => {
        e.preventDefault();
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image(); img.onload = () => {
                const canvas = document.createElement('canvas');
                const max = target === 'cat' ? 150 : 1200;
                let w = img.width, h = img.height;
                if (w > max || h > max) { if (w > h) { h = Math.round(h * max / w); w = max; } else { w = Math.round(w * max / h); h = max; } }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                if (target === 'cat') { setNewCat({ ...newCat, isCustomUrl: true, customUrl: base64 }); }
                else { try { localStorage.setItem('custom_bg', base64); setBgImage(base64); setAppTheme({ type: 'custom' }); } catch (err) { alert('空間不足！'); } }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const value = {
        activeTab, setActiveTab,
        isAdding, setIsAdding,
        isMenuOpen, setIsMenuOpen,
        showDatePicker, setShowDatePicker,
        tempYear, setTempYear,
        appTheme, setAppTheme,
        bgImage, setBgImage,
        bgSettings, setBgSettings,
        glassOpacity, setGlassOpacity,
        panelColor, setPanelColor,
        isConnOpen, setIsConnOpen,
        isVisualOpen, setIsVisualOpen,
        glassStyle,
        currentMonth, setCurrentMonth,
        records, setRecords,
        loading, setLoading,
        apiUrl, setApiUrl,
        apiToken, setApiToken,
        geminiKey, setGeminiKey,
        expenseCategories, setExpenseCategories,
        incomeCategories, setIncomeCategories,
        reportType, setReportType,
        catType, setCatType,
        isEditingCats, setIsEditingCats,
        editingCatIdx, setEditingCatIdx,
        selectedCategory, setSelectedCategory,
        newCat, setNewCat,
        form, setForm,
        aiInput, setAiInput,
        isAiProcessing, setIsAiProcessing,
        currentMonthRecords, totals, categoryBreakdown, groupedRecords, reportData, trendData,
        fetchFromCloud, saveToCloud, handleAIParse, deleteRecord, handleImageUpload,
        editRecord, startAdding, editingRecordIndex
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
