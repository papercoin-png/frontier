// missions.js - Active mission tracking for Voidfarer

// ===== DEFAULT MISSIONS =====
const DEFAULT_MISSIONS = [
    { 
        id: 'mission-gold-1',
        element: 'Gold', 
        current: 0, 
        target: 50, 
        planet: 'Pyros',
        reward: 50000,
        description: 'Collect 50 Gold from Pyros',
        icon: '🟡',
        completed: false,
        dateAssigned: null,
        dateCompleted: null
    },
    { 
        id: 'mission-uranium-1',
        element: 'Uranium', 
        current: 0, 
        target: 20, 
        planet: 'Pyros-Deep',
        reward: 100000,
        description: 'Mine 20 Uranium from Pyros-Deep',
        icon: '🟣',
        completed: false,
        dateAssigned: null,
        dateCompleted: null
    },
    { 
        id: 'mission-promethium-1',
        element: 'Promethium', 
        current: 0, 
        target: 5, 
        planet: 'Aether-Veil',
        reward: 250000,
        description: 'Harvest 5 Promethium from Aether\'s moons',
        icon: '✨',
        completed: false,
        dateAssigned: null,
        dateCompleted: null
    }
];

// ===== AVAILABLE MISSIONS =====
const AVAILABLE_MISSIONS = [
    {
        id: 'mission-carbon-1',
        element: 'Carbon',
        target: 100,
        planet: 'Verdant Prime',
        reward: 25000,
        description: 'Collect 100 Carbon from Verdant Prime',
        icon: '⚫',
        rarity: 'uncommon'
    },
    {
        id: 'mission-iron-1',
        element: 'Iron',
        target: 75,
        planet: 'Verdant Prime',
        reward: 18750,
        description: 'Mine 75 Iron from Verdant Prime',
        icon: '⚙️',
        rarity: 'uncommon'
    },
    {
        id: 'mission-silver-1',
        element: 'Silver',
        target: 30,
        planet: 'Pyros',
        reward: 30000,
        description: 'Collect 30 Silver from Pyros',
        icon: '🔘',
        rarity: 'rare'
    },
    {
        id: 'mission-platinum-1',
        element: 'Platinum',
        target: 15,
        planet: 'Pyros',
        reward: 45000,
        description: 'Mine 15 Platinum from Pyros',
        icon: '⬜',
        rarity: 'rare'
    },
    {
        id: 'mission-titanium-1',
        element: 'Titanium',
        target: 40,
        planet: 'Pyros',
        reward: 40000,
        description: 'Collect 40 Titanium from Pyros',
        icon: '🔷',
        rarity: 'rare'
    },
    {
        id: 'mission-ice-1',
        element: 'Ice',
        target: 200,
        planet: 'Glacier-7',
        reward: 20000,
        description: 'Harvest 200 Ice from Glacier-7',
        icon: '❄️',
        rarity: 'common'
    },
    {
        id: 'mission-methane-1',
        element: 'Methane',
        target: 50,
        planet: 'Glacier-7',
        reward: 25000,
        description: 'Extract 50 Methane from Glacier-7',
        icon: '💨',
        rarity: 'uncommon'
    },
    {
        id: 'mission-helium-1',
        element: 'Helium',
        target: 150,
        planet: 'Aether',
        reward: 15000,
        description: 'Collect 150 Helium from Aether\'s atmosphere',
        icon: '🎈',
        rarity: 'common'
    },
    {
        id: 'mission-hydrogen-1',
        element: 'Hydrogen',
        target: 300,
        planet: 'Aether',
        reward: 30000,
        description: 'Collect 300 Hydrogen from Aether',
        icon: '💧',
        rarity: 'common'
    },
    {
        id: 'mission-promethium-2',
        element: 'Promethium',
        target: 3,
        planet: 'Titanis',
        reward: 150000,
        description: 'Find 3 Promethium on Titanis',
        icon: '✨',
        rarity: 'legendary'
    },
    {
        id: 'mission-uranium-2',
        element: 'Uranium',
        target: 10,
        planet: 'Europa',
        reward: 50000,
        description: 'Mine 10 Uranium from Europa',
        icon: '🟣',
        rarity: 'very-rare'
    }
];

// ===== MISSION HELPER FUNCTIONS =====

// Get active missions from localStorage or set defaults
function getActiveMissions() {
    const missions = localStorage.getItem('voidfarer_missions');
    if (missions) {
        return JSON.parse(missions);
    } else {
        // Initialize with default missions
        const defaults = DEFAULT_MISSIONS.map(m => ({
            ...m,
            dateAssigned: new Date().toISOString()
        }));
        localStorage.setItem('voidfarer_missions', JSON.stringify(defaults));
        return defaults;
    }
}

// Save active missions
function saveActiveMissions(missions) {
    localStorage.setItem('voidfarer_missions', JSON.stringify(missions));
}

// Get completed missions
function getCompletedMissions() {
    const completed = localStorage.getItem('voidfarer_completed_missions');
    return completed ? JSON.parse(completed) : [];
}

// Save completed missions
function saveCompletedMissions(missions) {
    localStorage.setItem('voidfarer_completed_missions', JSON.stringify(missions));
}

// Add a new mission to active list
function addMission(missionId) {
    const available = AVAILABLE_MISSIONS.find(m => m.id === missionId);
    if (!available) return false;
    
    const active = getActiveMissions();
    
    // Check if already active
    if (active.some(m => m.id === missionId)) {
        return false;
    }
    
    // Check if already completed
    const completed = getCompletedMissions();
    if (completed.some(m => m.id === missionId)) {
        return false;
    }
    
    const newMission = {
        ...available,
        current: 0,
        completed: false,
        dateAssigned: new Date().toISOString()
    };
    
    active.push(newMission);
    saveActiveMissions(active);
    return true;
}

// Update mission progress
function updateMissionProgress(elementName, amount = 1) {
    const active = getActiveMissions();
    let updated = false;
    
    active.forEach(mission => {
        if (mission.element === elementName && !mission.completed && mission.current < mission.target) {
            mission.current = Math.min(mission.current + amount, mission.target);
            updated = true;
            
            // Check if mission completed
            if (mission.current >= mission.target) {
                mission.completed = true;
                mission.dateCompleted = new Date().toISOString();
                
                // Award reward
                const credits = parseInt(localStorage.getItem('voidfarer_credits')) || 12450;
                localStorage.setItem('voidfarer_credits', (credits + mission.reward).toString());
                
                // Move to completed missions
                const completed = getCompletedMissions();
                completed.push(mission);
                saveCompletedMissions(completed);
            }
        }
    });
    
    if (updated) {
        // Filter out completed missions from active
        const newActive = active.filter(m => !m.completed);
        saveActiveMissions(newActive);
    }
    
    return updated;
}

// Get mission progress percentage
function getMissionProgress(mission) {
    return (mission.current / mission.target) * 100;
}

// Get total mission count
function getMissionCounts() {
    const active = getActiveMissions();
    const completed = getCompletedMissions();
    
    return {
        active: active.length,
        completed: completed.length,
        total: active.length + completed.length
    };
}

// Get missions by planet
function getMissionsByPlanet(planetName) {
    const active = getActiveMissions();
    return active.filter(m => m.planet === planetName);
}

// Get missions by element
function getMissionsByElement(elementName) {
    const active = getActiveMissions();
    return active.filter(m => m.element === elementName);
}

// Remove a mission (abandon)
function abandonMission(missionId) {
    const active = getActiveMissions();
    const newActive = active.filter(m => m.id !== missionId);
    saveActiveMissions(newActive);
    return true;
}

// Get available missions (not active and not completed)
function getAvailableMissions() {
    const active = getActiveMissions();
    const completed = getCompletedMissions();
    const activeIds = active.map(m => m.id);
    const completedIds = completed.map(m => m.id);
    
    return AVAILABLE_MISSIONS.filter(m => 
        !activeIds.includes(m.id) && !completedIds.includes(m.id)
    );
}

// Get mission by ID
function getMissionById(missionId) {
    // Check active
    const active = getActiveMissions();
    const activeMission = active.find(m => m.id === missionId);
    if (activeMission) return activeMission;
    
    // Check completed
    const completed = getCompletedMissions();
    const completedMission = completed.find(m => m.id === missionId);
    if (completedMission) return completedMission;
    
    // Check available
    return AVAILABLE_MISSIONS.find(m => m.id === missionId) || null;
}

// Get next milestone for a mission
function getNextMilestone(mission) {
    if (!mission) return null;
    
    const progress = mission.current / mission.target;
    
    if (progress < 0.25) return 0.25;
    if (progress < 0.5) return 0.5;
    if (progress < 0.75) return 0.75;
    if (progress < 1) return 1;
    
    return null;
}

// Format mission time remaining (if we had time limits)
function formatTimeRemaining(mission) {
    // Placeholder for future timed missions
    return 'No time limit';
}

// Get mission reward text
function getMissionRewardText(mission) {
    return `${mission.reward.toLocaleString()}⭐`;
}

// Check if any missions are ready to turn in
function getCompletableMissions() {
    const active = getActiveMissions();
    return active.filter(m => m.current >= m.target);
}

// Bulk update missions from collection
function updateAllMissionsFromCollection() {
    const collection = JSON.parse(localStorage.getItem('voidfarer_collection')) || {};
    const active = getActiveMissions();
    let updated = false;
    
    active.forEach(mission => {
        const elementData = collection[mission.element];
        if (elementData) {
            const count = elementData.count || 1;
            if (count > mission.current) {
                mission.current = Math.min(count, mission.target);
                updated = true;
                
                // Check if completed
                if (mission.current >= mission.target) {
                    mission.completed = true;
                    mission.dateCompleted = new Date().toISOString();
                    
                    // Award reward
                    const credits = parseInt(localStorage.getItem('voidfarer_credits')) || 12450;
                    localStorage.setItem('voidfarer_credits', (credits + mission.reward).toString());
                    
                    // Move to completed
                    const completed = getCompletedMissions();
                    completed.push(mission);
                    saveCompletedMissions(completed);
                }
            }
        }
    });
    
    if (updated) {
        const newActive = active.filter(m => !m.completed);
        saveActiveMissions(newActive);
    }
    
    return updated;
}

// Reset all missions (for new game)
function resetMissions() {
    localStorage.removeItem('voidfarer_missions');
    localStorage.removeItem('voidfarer_completed_missions');
    
    // Initialize with defaults
    const defaults = DEFAULT_MISSIONS.map(m => ({
        ...m,
        dateAssigned: new Date().toISOString()
    }));
    localStorage.setItem('voidfarer_missions', JSON.stringify(defaults));
    localStorage.setItem('voidfarer_completed_missions', JSON.stringify([]));
    
    return defaults;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEFAULT_MISSIONS,
        AVAILABLE_MISSIONS,
        getActiveMissions,
        saveActiveMissions,
        getCompletedMissions,
        saveCompletedMissions,
        addMission,
        updateMissionProgress,
        getMissionProgress,
        getMissionCounts,
        getMissionsByPlanet,
        getMissionsByElement,
        abandonMission,
        getAvailableMissions,
        getMissionById,
        getNextMilestone,
        formatTimeRemaining,
        getMissionRewardText,
        getCompletableMissions,
        updateAllMissionsFromCollection,
        resetMissions
    };
}
