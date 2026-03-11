// js/missions.js - Active mission tracking for Voidfarer
// Now using IndexedDB via storage.js for unlimited storage

import {
    getItem,
    setItem,
    getAll,
    deleteItem,
    getCollection,
    addCredits,
    getCredits
} from './storage.js';

// ===== DEFAULT MISSIONS =====
export const DEFAULT_MISSIONS = [
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
export const AVAILABLE_MISSIONS = [
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

// ===== STORAGE KEYS (for IndexedDB stores) =====
const MISSION_STORES = {
    ACTIVE: 'missions',
    COMPLETED: 'completedMissions'
};

// ===== MISSION HELPER FUNCTIONS =====

// Get active missions from IndexedDB or set defaults
export async function getActiveMissions() {
    const missions = await getAll(MISSION_STORES.ACTIVE);
    
    if (missions.length === 0) {
        // Initialize with default missions
        const defaults = DEFAULT_MISSIONS.map(m => ({
            ...m,
            dateAssigned: new Date().toISOString()
        }));
        
        for (const mission of defaults) {
            await setItem(MISSION_STORES.ACTIVE, mission);
        }
        
        return defaults;
    }
    
    return missions.sort((a, b) => a.dateAssigned.localeCompare(b.dateAssigned));
}

// Save active missions
export async function saveActiveMissions(missions) {
    // Clear and rebuild
    const db = await getDb();
    const tx = db.transaction(MISSION_STORES.ACTIVE, 'readwrite');
    await tx.objectStore(MISSION_STORES.ACTIVE).clear();
    
    for (const mission of missions) {
        await tx.objectStore(MISSION_STORES.ACTIVE).put(mission);
    }
    await tx.done;
}

// Get completed missions
export async function getCompletedMissions() {
    const missions = await getAll(MISSION_STORES.COMPLETED);
    return missions.sort((a, b) => b.dateCompleted.localeCompare(a.dateCompleted));
}

// Save completed missions
export async function saveCompletedMissions(missions) {
    const db = await getDb();
    const tx = db.transaction(MISSION_STORES.COMPLETED, 'readwrite');
    await tx.objectStore(MISSION_STORES.COMPLETED).clear();
    
    for (const mission of missions) {
        await tx.objectStore(MISSION_STORES.COMPLETED).put(mission);
    }
    await tx.done;
}

// Add a new mission to active list
export async function addMission(missionId) {
    const available = AVAILABLE_MISSIONS.find(m => m.id === missionId);
    if (!available) return false;
    
    const active = await getActiveMissions();
    const completed = await getCompletedMissions();
    
    // Check if already active
    if (active.some(m => m.id === missionId)) {
        return false;
    }
    
    // Check if already completed
    if (completed.some(m => m.id === missionId)) {
        return false;
    }
    
    const newMission = {
        ...available,
        current: 0,
        completed: false,
        dateAssigned: new Date().toISOString()
    };
    
    await setItem(MISSION_STORES.ACTIVE, newMission);
    return true;
}

// Update mission progress
export async function updateMissionProgress(elementName, amount = 1) {
    const active = await getActiveMissions();
    let updated = false;
    let completedMissions = [];
    
    for (const mission of active) {
        if (mission.element === elementName && !mission.completed && mission.current < mission.target) {
            mission.current = Math.min(mission.current + amount, mission.target);
            updated = true;
            
            // Check if mission completed
            if (mission.current >= mission.target) {
                mission.completed = true;
                mission.dateCompleted = new Date().toISOString();
                
                // Award reward
                const credits = await getCredits();
                await addCredits(mission.reward);
                
                // Move to completed missions
                completedMissions.push(mission);
            }
        }
    }
    
    if (updated) {
        // Filter out completed missions from active
        const newActive = active.filter(m => !m.completed);
        await saveActiveMissions(newActive);
        
        // Add completed missions to completed store
        for (const mission of completedMissions) {
            await setItem(MISSION_STORES.COMPLETED, mission);
        }
    }
    
    return updated;
}

// Get mission progress percentage
export function getMissionProgress(mission) {
    return (mission.current / mission.target) * 100;
}

// Get total mission count
export async function getMissionCounts() {
    const active = await getActiveMissions();
    const completed = await getCompletedMissions();
    
    return {
        active: active.length,
        completed: completed.length,
        total: active.length + completed.length
    };
}

// Get missions by planet
export async function getMissionsByPlanet(planetName) {
    const active = await getActiveMissions();
    return active.filter(m => m.planet === planetName);
}

// Get missions by element
export async function getMissionsByElement(elementName) {
    const active = await getActiveMissions();
    return active.filter(m => m.element === elementName);
}

// Remove a mission (abandon)
export async function abandonMission(missionId) {
    await deleteItem(MISSION_STORES.ACTIVE, missionId);
    return true;
}

// Get available missions (not active and not completed)
export async function getAvailableMissions() {
    const active = await getActiveMissions();
    const completed = await getCompletedMissions();
    const activeIds = active.map(m => m.id);
    const completedIds = completed.map(m => m.id);
    
    return AVAILABLE_MISSIONS.filter(m => 
        !activeIds.includes(m.id) && !completedIds.includes(m.id)
    );
}

// Get mission by ID
export async function getMissionById(missionId) {
    // Check active
    const active = await getItem(MISSION_STORES.ACTIVE, missionId);
    if (active) return active;
    
    // Check completed
    const completed = await getItem(MISSION_STORES.COMPLETED, missionId);
    if (completed) return completed;
    
    // Check available
    return AVAILABLE_MISSIONS.find(m => m.id === missionId) || null;
}

// Get next milestone for a mission
export function getNextMilestone(mission) {
    if (!mission) return null;
    
    const progress = mission.current / mission.target;
    
    if (progress < 0.25) return 0.25;
    if (progress < 0.5) return 0.5;
    if (progress < 0.75) return 0.75;
    if (progress < 1) return 1;
    
    return null;
}

// Format mission time remaining (if we had time limits)
export function formatTimeRemaining(mission) {
    // Placeholder for future timed missions
    return 'No time limit';
}

// Get mission reward text
export function getMissionRewardText(mission) {
    return `${mission.reward.toLocaleString()}⭐`;
}

// Check if any missions are ready to turn in
export async function getCompletableMissions() {
    const active = await getActiveMissions();
    return active.filter(m => m.current >= m.target);
}

// Bulk update missions from collection
export async function updateAllMissionsFromCollection() {
    const collection = await getCollection();
    const active = await getActiveMissions();
    let updated = false;
    let completedMissions = [];
    
    for (const mission of active) {
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
                    const credits = await getCredits();
                    await addCredits(mission.reward);
                    
                    // Move to completed
                    completedMissions.push(mission);
                }
            }
        }
    }
    
    if (updated) {
        const newActive = active.filter(m => !m.completed);
        await saveActiveMissions(newActive);
        
        for (const mission of completedMissions) {
            await setItem(MISSION_STORES.COMPLETED, mission);
        }
    }
    
    return updated;
}

// Reset all missions (for new game)
export async function resetMissions() {
    const db = await getDb();
    const tx = db.transaction([MISSION_STORES.ACTIVE, MISSION_STORES.COMPLETED], 'readwrite');
    
    await tx.objectStore(MISSION_STORES.ACTIVE).clear();
    await tx.objectStore(MISSION_STORES.COMPLETED).clear();
    
    // Initialize with defaults
    const defaults = DEFAULT_MISSIONS.map(m => ({
        ...m,
        dateAssigned: new Date().toISOString()
    }));
    
    for (const mission of defaults) {
        await tx.objectStore(MISSION_STORES.ACTIVE).put(mission);
    }
    
    await tx.done;
    return defaults;
}

// Generate new random mission (for daily missions)
export async function generateDailyMission() {
    const available = await getAvailableMissions();
    
    if (available.length === 0) {
        // All missions completed or active, create a custom one
        const elements = ['Gold', 'Silver', 'Platinum', 'Uranium', 'Promethium'];
        const planets = ['Pyros', 'Verdant Prime', 'Glacier-7', 'Aether'];
        const rarities = ['rare', 'rare', 'very-rare', 'legendary'];
        const rewards = [25000, 50000, 100000, 250000];
        
        const randomIndex = Math.floor(Math.random() * elements.length);
        const randomRarity = Math.floor(Math.random() * rarities.length);
        
        const newMission = {
            id: 'daily_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            element: elements[randomIndex],
            target: Math.floor(Math.random() * 20) + 10,
            planet: planets[Math.floor(Math.random() * planets.length)],
            reward: rewards[randomRarity],
            description: `Daily: Collect ${elements[randomIndex]}`,
            icon: getElementIcon(elements[randomIndex]),
            rarity: rarities[randomRarity]
        };
        
        return newMission;
    }
    
    // Return random available mission
    return available[Math.floor(Math.random() * available.length)];
}

// Helper to get element icon
function getElementIcon(elementName) {
    const icons = {
        'Gold': '🟡',
        'Silver': '⚪',
        'Platinum': '⬜',
        'Uranium': '🟣',
        'Promethium': '✨',
        'Carbon': '⚫',
        'Iron': '⚙️',
        'Titanium': '🔷',
        'Ice': '❄️',
        'Methane': '💨',
        'Helium': '🎈',
        'Hydrogen': '💧'
    };
    return icons[elementName] || '🔹';
}

// ===== EXPORT =====
export default {
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
    resetMissions,
    generateDailyMission
};

// Need to import getDb for some functions
import { getDb } from './db.js';
