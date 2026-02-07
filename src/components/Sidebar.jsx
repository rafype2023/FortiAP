
import { useData } from '../context/DataContext';
import { Settings, Map as MapIcon, Wifi, List, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Sidebar = () => {
    const {
        maps, selectedFloorId, setSelectedFloorId,
        selectedSite, setSelectedSite,
        mode, setMode, getUnplacedAPs, aps,
        resetFloorPlacements
    } = useData();

    const [searchTerm, setSearchTerm] = useState('');

    const unplacedAPs = getUnplacedAPs().filter(ap =>
        ap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ap.ip.includes(searchTerm)
    );

    const handleDragStart = (e, apId) => {
        e.dataTransfer.setData('apId', apId);
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-80 h-screen bg-white shadow-xl flex flex-col border-r border-gray-100 z-20 relative">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Wifi className="text-blue-600" /> AP Monitor
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">FortiAP Replacement</p>
            </div>

            <div className="p-4 space-y-4">
                {/* Mode Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('monitor')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'monitor' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <MapIcon size={16} /> Monitor
                    </button>
                    <button
                        onClick={() => setMode('calibration')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'calibration' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Settings size={16} /> Calibration
                    </button>
                </div>

                {/* Site Selection */}
                <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Site</label>
                    <select
                        value={selectedSite}
                        onChange={(e) => {
                            const newSite = e.target.value;
                            setSelectedSite(newSite);
                            // Auto select first floor of new site
                            const firstFloor = maps.find(m => m.site === newSite);
                            if (firstFloor) setSelectedFloorId(firstFloor.id);
                        }}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.25em_1.25em]"
                    >
                        {[...new Set(maps.map(m => m.site))].map(site => (
                            <option key={site} value={site}>{site}</option>
                        ))}
                    </select>
                </div>

                {/* Map Selection */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Floor</label>
                    <select
                        value={selectedFloorId}
                        onChange={(e) => setSelectedFloorId(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.25em_1.25em]"
                    >
                        {maps.filter(m => m.site === selectedSite).map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {mode === 'calibration' ? (
                    <>
                        <div className="mb-4 sticky top-0 bg-white/95 backdrop-blur z-10 pb-2">
                            <h2 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <List size={16} /> Unplaced APs ({unplacedAPs.length})
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search by name or IP..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to reset all placements for this floor?')) {
                                        resetFloorPlacements(selectedFloorId);
                                    }
                                }}
                                className="w-full mt-3 py-2 px-4 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Settings size={14} /> Reset Floor Placements
                            </button>
                        </div>
                        <div className="space-y-2 pb-4">
                            <AnimatePresence>
                                {unplacedAPs.map(ap => (
                                    <motion.div
                                        key={ap.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        layout
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, ap.id)}
                                        className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing hover:border-blue-200 transition-all group select-none"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-full ${ap.status === 'Connected' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                <Wifi size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{ap.name}</div>
                                                <div className="text-xs text-gray-500 truncate font-mono">{ap.ip}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {unplacedAPs.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-12 text-gray-400 text-sm flex flex-col items-center gap-2"
                                    >
                                        <Wifi className="text-gray-200" size={32} />
                                        <p>All APs placed!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
                        <MapIcon size={48} className="mb-4 text-gray-200" />
                        <p>Select a mode or view the map.</p>
                        <p className="mt-2 text-xs text-gray-300">Hover over AP icons on the map to see details.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-center text-gray-400 flex justify-between items-center">
                <span>v1.0.0</span>
                <span>Total APs: {aps.length}</span>
            </div>
        </div>
    );
};
export default Sidebar;
