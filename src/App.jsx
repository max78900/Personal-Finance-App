import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import TabBar from './components/TabBar';
import Sidebar from './components/Sidebar';
import Home from './views/Home';
import Report from './views/Report';
import CategoryManager from './views/CategoryManager';
import Settings from './views/Settings';
import AddRecordModal from './components/AddRecordModal';
import CategoryDetail from './views/CategoryDetail';
import DatePickerModal from './components/DatePickerModal';

function AppContent() {
    const {
        appTheme, bgImage, bgSettings, activeTab, isAdding,
        isMenuOpen, setIsMenuOpen, setActiveTab, setIsAdding, glassStyle
    } = useAppContext();

    const backgroundLayer = (
        <div id="bg-canvas">
            {appTheme.type === 'custom' && bgImage ? (
                <div className="w-full h-full transition-all duration-300"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'auto 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        transform: `scale(${bgSettings.zoom / 100}) translate(${(bgSettings.x - 50)}%, ${(bgSettings.y - 50)}%) rotate(${bgSettings.rotate}deg)`,
                        transformOrigin: 'center center'
                    }} />
            ) : (
                <div className="w-full h-full transition-all duration-500" style={{ backgroundColor: appTheme.value }} />
            )}
        </div>
    );

    return (
        <div className="flex flex-col max-w-md mx-auto min-h-screen shadow-2xl relative transition-all duration-500 overflow-hidden text-gray-800">
            {backgroundLayer}

            <DatePickerModal />
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setActiveTab={setActiveTab} />

            {activeTab === 'home' && <Home />}
            {activeTab === 'report' && <Report />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'categoryDetail' && <CategoryDetail />}
            {activeTab === 'settings' && <Settings />}

            {isAdding && <AddRecordModal />}

            <TabBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAdding={isAdding}
                glassStyle={glassStyle}
            />
        </div>
    );
}

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}
