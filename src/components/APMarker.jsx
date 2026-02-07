
import { Wifi } from 'lucide-react';
import { useState } from 'react';

const APMarker = ({ ap, onClick, mode }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    // Color based on status
    const statusClasses = ap.status === 'Connected'
        ? 'bg-green-500 ring-green-300'
        : 'bg-red-500 ring-red-300';

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:z-20"
            style={{ left: `${ap.x * 100}%`, top: `${ap.y * 100}%` }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={onClick}
        >
            <div className={`p-2 rounded-full ${statusClasses} text-white shadow-lg hover:scale-110 transition-transform ring-4 ring-opacity-50`}>
                <Wifi size={24} />
            </div>

            {/* Pulse effect for connected APs */}
            {ap.status === 'Connected' && (
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 pointer-events-none -z-10"></div>
            )}

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl text-sm border border-gray-100 z-50 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="font-bold text-gray-900 mb-2 text-base border-b pb-1">{ap.name}</h3>
                    <div className="space-y-1.5 text-gray-600">
                        <p className="flex justify-between"><span className="font-medium text-gray-500">Status:</span> <span className={`font-semibold ${ap.status === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>{ap.status}</span></p>
                        <p className="flex justify-between"><span className="font-medium text-gray-500">IP:</span> <span>{ap.ip}</span></p>
                        <p className="flex justify-between"><span className="font-medium text-gray-500">Clients (2.4/5):</span> <span>{ap.clients_24} / {ap.clients_50}</span></p>
                        <p className="flex justify-between"><span className="font-medium text-gray-500">Model:</span> <span>{ap.model}</span></p>
                        <p className="flex justify-between"><span className="font-medium text-gray-500">Serial:</span> <span className="text-xs">{ap.serial}</span></p>
                    </div>
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                </div>
            )}
        </div>
    );
};
export default APMarker;
