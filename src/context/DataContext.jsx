
import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [aps, setAps] = useState([]);
    const [maps, setMaps] = useState([]);

    // Selection State
    const [selectedSite, setSelectedSite] = useState('');
    const [selectedFloorId, setSelectedFloorId] = useState('');
    const [mode, setMode] = useState('monitor'); // 'monitor' | 'calibration'

    // Placements: { [apId]: { x: 0.5, y: 0.5, floorId: '...' } }
    // Relative coordinates (0-1) are better for responsive maps
    const [placements, setPlacements] = useState({});

    // Load Data
    useEffect(() => {
        Promise.all([
            fetch('/data/aps.json').then(res => res.json()),
            fetch('/data/maps.json').then(res => res.json()),
            fetch('/api/placements').then(res => res.json())
        ])
            .then(([apsData, mapsData, placementsData]) => {
                setAps(apsData);
                setMaps(mapsData);
                setPlacements(placementsData || {});

                // Set initial selection if available
                if (mapsData.length > 0) {
                    // Group by site to find first site
                    const sites = [...new Set(mapsData.map(m => m.site))];
                    if (sites.length > 0) {
                        const firstSite = sites[0];
                        setSelectedSite(firstSite);
                        const firstFloor = mapsData.find(m => m.site === firstSite);
                        if (firstFloor) setSelectedFloorId(firstFloor.id);
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load data", err);
                setLoading(false);
            });
    }, []);

    // Save placements when they change
    useEffect(() => {
        if (!loading) {
            fetch('/api/placements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(placements)
            }).catch(err => console.error("Failed to save placements:", err));
        }
    }, [placements, loading]);

    const placeAP = (apId, x, y, floorId) => {
        setPlacements(prev => ({
            ...prev,
            [apId]: { x, y, floorId }
        }));
    };

    const removeAP = (apId) => {
        setPlacements(prev => {
            const next = { ...prev };
            delete next[apId];
            return next;
        });
    };

    const resetFloorPlacements = (floorId) => {
        console.log("Resetting placements for floor:", floorId);
        setPlacements(prev => {
            const next = { ...prev };
            console.log("Current placements:", next);
            // Remove all APs that are on this floor
            Object.keys(next).forEach(apId => {
                if (next[apId].floorId === floorId) {
                    console.log("Removing AP:", apId);
                    delete next[apId];
                }
            });
            return next;
        });
    };

    const getUnplacedAPs = () => {
        return aps.filter(ap => !placements[ap.id]);
    };

    const getPlacedAPsForFloor = (floorId) => {
        return aps.filter(ap => placements[ap.id]?.floorId === floorId).map(ap => ({
            ...ap,
            ...placements[ap.id]
        }));
    };

    const selectedMap = maps.find(m => m.id === selectedFloorId);

    return (
        <DataContext.Provider value={{
            loading,
            aps,
            maps,
            selectedSite,
            setSelectedSite,
            selectedFloorId,
            setSelectedFloorId,
            selectedMap,
            mode,
            setMode,
            placements,
            placeAP,
            removeAP,
            getUnplacedAPs,
            getUnplacedAPs,
            getPlacedAPsForFloor,
            resetFloorPlacements
        }}>
            {children}
        </DataContext.Provider>
    );
};
