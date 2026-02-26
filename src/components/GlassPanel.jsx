import React from 'react';

export default function GlassPanel({ children, className = '', style = {}, onClick }) {
    return (
        <div
            onClick={onClick}
            style={style}
            className={`glass-panel-base ${className}`}
        >
            {children}
        </div>
    );
}
