
import { useRef } from 'react';
import { useData } from '../context/DataContext';
import APMarker from './APMarker';

const MapViewer = () => {
    const { selectedMap, getPlacedAPsForFloor, placeAP, mode } = useData();
    const mapRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        if (mode !== 'calibration') return;

        const apId = e.dataTransfer.getData('apId');
        if (!apId || !mapRef.current) return;

        const rect = mapRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Clamp values to 0-1
        const clampedX = Math.max(0, Math.min(1, x));
        const clampedY = Math.max(0, Math.min(1, y));

        placeAP(apId, clampedX, clampedY, selectedMap.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    if (!selectedMap) return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
            <p>No map selected</p>
        </div>
    );

    const placedAPs = getPlacedAPsForFloor(selectedMap.id);

    return (
        <div
            className="relative flex-1 bg-gray-100 overflow-hidden flex items-center justify-center p-8 select-none"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <div
                ref={mapRef}
                className="relative shadow-2xl rounded-xl overflow-hidden border-4 border-white bg-white inline-block transition-all duration-300"
            >
                <img
                    src={selectedMap.image}
                    alt={selectedMap.name}
                    className="object-contain max-w-full max-h-[85vh] block"
                    draggable={false}
                />

                {placedAPs.map(ap => (
                    <APMarker
                        key={ap.id}
                        ap={ap}
                        mode={mode}
                    />
                ))}

                {mode === 'calibration' && (
                    <div className="absolute inset-0 border-4 border-dashed border-blue-400/30 rounded-lg pointer-events-none animate-pulse">
                        <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                            Calibration Mode: Active
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default MapViewer;
