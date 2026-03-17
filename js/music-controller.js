// js/music-controller.js
// Central music management system for Voidfarer
// Handles playlists, crossfading, and persistent playback across pages

const MusicController = (function() {
    // ===== CONFIGURATION =====
    const CONFIG = {
        crossfadeDuration: 2000, // 2 seconds crossfade
        defaultVolume: 0.3,
        storageKey: 'voidfarer_music_state',
        trackHistorySize: 10 // Remember last 10 tracks to avoid repeats
    };

    // ===== PLAYLIST MANIFEST =====
    // This will be loaded from JSON, but here's the structure
    const PLAYLISTS = {
        'earth-hub': [
            'hub-ambient-01.mp3',
            'hub-ambient-02.mp3',
            'hub-ambient-03.mp3',
            'hub-ambient-04.mp3',
            'hub-ambient-05.mp3'
        ],
        'path-selection': [
            'path-call-01.mp3',
            'path-call-02.mp3',
            'path-call-03.mp3'
        ],
        'galaxy-map': [
            'galaxy-drift-01.mp3',
            'galaxy-drift-02.mp3',
            'galaxy-drift-03.mp3',
            'galaxy-drift-04.mp3'
        ],
        'system-view': [
            'system-silence-01.mp3',
            'system-silence-02.mp3',
            'system-silence-03.mp3'
        ],
        'warp': [
            'warp-drive-01.mp3',
            'warp-drive-02.mp3',
            'warp-drive-03.mp3',
            'warp-drive-04.mp3',
            'warp-drive-05.mp3'
        ],
        // Planet biomes with extensive playlists (20-30 tracks each)
        'lush': generateTrackList('lush', 30),
        'barren': generateTrackList('barren', 20),
        'frozen': generateTrackList('frozen', 25),
        'scorched': generateTrackList('scorched', 15),
        'volcanic': generateTrackList('volcanic', 18),
        'oceanic': generateTrackList('oceanic', 22),
        'toxic': generateTrackList('toxic', 16),
        'asteroid': generateTrackList('asteroid', 14),
        'gas': generateTrackList('gas', 12),
        'cognatus': [
            'cognatus-whisper-01.mp3',
            'cognatus-whisper-02.mp3',
            'cognatus-whisper-03.mp3'
        ]
    };

    // Helper to generate track lists
    function generateTrackList(prefix, count) {
        return Array.from({ length: count }, (_, i) => 
            `${prefix}-${String(i + 1).padStart(2, '0')}.mp3`
        );
    }

    // ===== STATE =====
    let currentAudio = null;
    let nextAudio = null;
    let currentLocation = null;
    let currentTrack = null;
    let playlist = [];
    let trackHistory = [];
    let isPlaying = false;
    let volume = CONFIG.defaultVolume;
    let fadeInterval = null;

    // ===== INITIALIZATION =====
    function init() {
        console.log('🎵 MusicController initializing...');
        
        // Create audio elements
        currentAudio = new Audio();
        currentAudio.volume = volume;
        currentAudio.loop = false; // We'll handle looping via playlist
        
        nextAudio = new Audio();
        nextAudio.volume = 0;
        nextAudio.loop = false;
        
        // Load saved state
        loadState();
        
        // Set up event listeners
        currentAudio.addEventListener('ended', onTrackEnd);
        
        // Try to load playlist manifest from server (optional)
        loadPlaylistManifest();
        
        console.log('✅ MusicController ready');
    }

    // Load playlist manifest from external JSON (optional)
    async function loadPlaylistManifest() {
        try {
            const response = await fetch('assets/music/playlist-manifest.json');
            if (response.ok) {
                const manifest = await response.json();
                // Merge with existing playlists
                Object.assign(PLAYLISTS, manifest);
                console.log('📋 Loaded playlist manifest');
            }
        } catch (error) {
            console.log('Using default playlists');
        }
    }

    // ===== STATE MANAGEMENT =====
    function saveState() {
        if (!currentAudio) return;
        
        const state = {
            currentLocation: currentLocation,
            currentTrack: currentTrack,
            currentTime: currentAudio.currentTime,
            isPlaying: !currentAudio.paused,
            volume: volume,
            trackHistory: trackHistory
        };
        
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    }

    function loadState() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (!saved) return;
            
            const state = JSON.parse(saved);
            
            // Restore history
            trackHistory = state.trackHistory || [];
            
            // Don't auto-play, just restore location
            if (state.currentLocation) {
                currentLocation = state.currentLocation;
                playlist = PLAYLISTS[currentLocation] || [];
            }
            
        } catch (error) {
            console.error('Failed to load music state:', error);
        }
    }

    // ===== PLAYLIST MANAGEMENT =====
    function setLocation(location) {
        if (currentLocation === location) return;
        
        console.log(`🎵 Switching to location: ${location}`);
        currentLocation = location;
        
        // Get playlist for location
        playlist = PLAYLISTS[location] || PLAYLISTS['earth-hub'];
        
        // Start playing if we were playing before
        if (isPlaying) {
            playNextTrack();
        }
    }

    function getNextTrack() {
        if (playlist.length === 0) return null;
        
        // Filter out recently played tracks
        const availableTracks = playlist.filter(track => 
            !trackHistory.includes(track)
        );
        
        // If all tracks are in history, reset history
        if (availableTracks.length === 0) {
            trackHistory = [];
            return playlist[Math.floor(Math.random() * playlist.length)];
        }
        
        // Pick random from available
        const nextTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
        
        // Update history
        trackHistory.push(nextTrack);
        if (trackHistory.length > CONFIG.trackHistorySize) {
            trackHistory.shift();
        }
        
        return nextTrack;
    }

    // ===== PLAYBACK CONTROL =====
    function play(location) {
        if (location) {
            setLocation(location);
        }
        
        if (!currentLocation || playlist.length === 0) {
            console.warn('No playlist available');
            return;
        }
        
        isPlaying = true;
        
        if (currentAudio.src && !currentAudio.paused) {
            // Already playing
            return;
        }
        
        playNextTrack();
        saveState();
    }

    function playNextTrack() {
        const nextTrack = getNextTrack();
        if (!nextTrack) return;
        
        currentTrack = nextTrack;
        const trackPath = `assets/music/${currentLocation}/${nextTrack}`;
        
        // Preload next track
        preloadNextTrack();
        
        // Start crossfade if we have a next track preloaded
        if (nextAudio.src) {
            crossfade();
        } else {
            // Simple play
            currentAudio.src = trackPath;
            currentAudio.play().catch(e => console.warn('Playback failed:', e));
        }
        
        console.log(`🎵 Now playing: ${currentLocation}/${currentTrack}`);
    }

    function preloadNextTrack() {
        const nextTrack = getNextTrack();
        if (!nextTrack) return;
        
        const trackPath = `assets/music/${currentLocation}/${nextTrack}`;
        nextAudio.src = trackPath;
        nextAudio.load();
    }

    function crossfade() {
        // Start next track at volume 0
        nextAudio.volume = 0;
        nextAudio.play();
        
        // Fade out current, fade in next
        const steps = 20;
        const stepTime = CONFIG.crossfadeDuration / steps;
        let step = 0;
        
        if (fadeInterval) clearInterval(fadeInterval);
        
        fadeInterval = setInterval(() => {
            step++;
            const progress = step / steps;
            
            // Linear crossfade
            currentAudio.volume = Math.max(0, volume * (1 - progress));
            nextAudio.volume = Math.min(volume, volume * progress);
            
            if (step >= steps) {
                clearInterval(fadeInterval);
                fadeInterval = null;
                
                // Swap audio elements
                const temp = currentAudio;
                currentAudio = nextAudio;
                nextAudio = temp;
                
                // Reset next audio
                nextAudio.src = '';
                nextAudio.volume = 0;
                
                // Set up event listener on new current
                currentAudio.addEventListener('ended', onTrackEnd);
                
                // Preload next
                preloadNextTrack();
            }
        }, stepTime);
    }

    function onTrackEnd() {
        if (isPlaying) {
            playNextTrack();
        }
    }

    function pause() {
        isPlaying = false;
        currentAudio.pause();
        saveState();
    }

    function resume() {
        isPlaying = true;
        currentAudio.play();
        saveState();
    }

    function stop() {
        isPlaying = false;
        currentAudio.pause();
        currentAudio.currentTime = 0;
        saveState();
    }

    // ===== VOLUME CONTROL =====
    function setVolume(newVolume) {
        volume = Math.max(0, Math.min(1, newVolume));
        currentAudio.volume = volume;
        if (nextAudio) nextAudio.volume = 0;
        saveState();
    }

    function getVolume() {
        return volume;
    }

    // ===== MUTE TOGGLE =====
    function toggleMute() {
        if (volume > 0) {
            setVolume(0);
        } else {
            setVolume(CONFIG.defaultVolume);
        }
    }

    // ===== PUBLIC API =====
    return {
        // Core control
        init: init,
        play: play,
        pause: pause,
        resume: resume,
        stop: stop,
        
        // Location control
        setLocation: setLocation,
        
        // Volume
        setVolume: setVolume,
        getVolume: getVolume,
        toggleMute: toggleMute,
        
        // Status
        isPlaying: () => isPlaying,
        getCurrentLocation: () => currentLocation,
        getCurrentTrack: () => currentTrack,
        
        // Playlist access (for debugging)
        getPlaylists: () => PLAYLISTS
    };
})();

// ===== AUTO-INITIALIZE =====
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MusicController.init());
} else {
    MusicController.init();
}

// ===== SAVE STATE BEFORE PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
    // MusicController saves state automatically
});

// ===== EXPORT FOR USE IN OTHER SCRIPTS =====
window.MusicController = MusicController;

console.log('✅ music-controller.js loaded - Dynamic soundtrack ready');
