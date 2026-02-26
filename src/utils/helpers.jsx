import React from 'react';

export const hexToRgba = (hex, alpha) => {
    let r = 255, g = 255, b = 255;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        let res = hex.substring(1).split('');
        if (res.length === 3) res = [res[0], res[0], res[1], res[1], res[2], res[2]];
        res = '0x' + res.join('');
        r = (res >> 16) & 255;
        g = (res >> 8) & 255;
        b = res & 255;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const renderIcon = (cat, size = "text-lg") => {
    if (cat.isCustomUrl && cat.customUrl) {
        return <img src={cat.customUrl} className="w-full h-full object-cover rounded-xl" onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error' }} alt={cat.name || 'icon'} />;
    }
    return <i className={`fa-solid ${cat.icon || 'fa-border-all'} ${size} ${cat.isDefault ? cat.color : ''}`} style={!cat.isDefault ? { color: cat.hex } : {}}></i>;
};
