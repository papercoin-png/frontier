// js/claim-notifications.js
// Global notification system for Voidfarer claim events
// Handles new claims, fee earnings, and claim-related alerts

// ===== STORAGE KEYS =====
const NOTIFICATION_STORAGE_KEYS = {
    CLAIM_NOTIFICATIONS: 'voidfarer_claim_notifications',
    NOTIFICATION_READ_STATUS: 'voidfarer_notification_read_status'
};

// ===== NOTIFICATION TYPES =====
export const NOTIFICATION_TYPES = {
    PLANET_CLAIM: 'planet_claim',           // New planet claimed
    MINING_FEE: 'mining_fee',                // Fee paid to owner
    FEE_THRESHOLD: 'fee_threshold',          // Large fee threshold crossed
    CLAIM_EXPIRY: 'claim_expiry',            // Claim approaching expiry (if implemented)
    SYSTEM_ALERT: 'system_alert'             // System-wide claim-related alerts
};

// ===== NOTIFICATION PRIORITIES =====
export const NOTIFICATION_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

// ===== NOTIFICATION DURATIONS (in milliseconds) =====
const NOTIFICATION_DURATION = {
    [NOTIFICATION_PRIORITY.LOW]: 24 * 60 * 60 * 1000,      // 24 hours
    [NOTIFICATION_PRIORITY.MEDIUM]: 48 * 60 * 60 * 1000,    // 48 hours
    [NOTIFICATION_PRIORITY.HIGH]: 72 * 60 * 60 * 1000,      // 72 hours
    [NOTIFICATION_PRIORITY.CRITICAL]: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// ============================================================================
// CORE NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Get all claim notifications
 * @returns {Promise<Array>} Array of notification objects
 */
export async function getClaimNotifications() {
    try {
        const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.CLAIM_NOTIFICATIONS);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error getting claim notifications:', error);
        return [];
    }
}

/**
 * Save claim notifications
 * @param {Array} notifications - Array of notification objects
 * @returns {Promise<boolean>} Success status
 */
export async function saveClaimNotifications(notifications) {
    try {
        // Clean up expired notifications before saving
        const cleaned = notifications.filter(n => !isNotificationExpired(n));
        
        // Keep only last 100 notifications to prevent storage bloat
        if (cleaned.length > 100) {
            cleaned.sort((a, b) => b.timestamp - a.timestamp);
            cleaned.length = 100;
        }
        
        localStorage.setItem(NOTIFICATION_STORAGE_KEYS.CLAIM_NOTIFICATIONS, JSON.stringify(cleaned));
        return true;
    } catch (error) {
        console.error('Error saving claim notifications:', error);
        return false;
    }
}

/**
 * Check if a notification has expired
 * @param {Object} notification - Notification object
 * @returns {boolean} True if expired
 */
function isNotificationExpired(notification) {
    if (!notification.expiresAt) return false;
    return Date.now() > notification.expiresAt;
}

/**
 * Generate a unique notification ID
 * @returns {string} Unique notification ID
 */
function generateNotificationId() {
    return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get priority for a notification based on type and data
 * @param {string} type - Notification type
 * @param {Object} data - Notification data
 * @returns {string} Priority level
 */
function getNotificationPriority(type, data = {}) {
    switch (type) {
        case NOTIFICATION_TYPES.PLANET_CLAIM:
            // Legendary claims are high priority
            return data.rarity === 'legendary' 
                ? NOTIFICATION_PRIORITY.HIGH 
                : NOTIFICATION_PRIORITY.MEDIUM;
        
        case NOTIFICATION_TYPES.MINING_FEE:
            // Large fees are high priority
            return (data.amount || 0) > 10000 
                ? NOTIFICATION_PRIORITY.HIGH 
                : NOTIFICATION_PRIORITY.LOW;
        
        case NOTIFICATION_TYPES.FEE_THRESHOLD:
            return NOTIFICATION_PRIORITY.CRITICAL;
        
        case NOTIFICATION_TYPES.CLAIM_EXPIRY:
            return NOTIFICATION_PRIORITY.MEDIUM;
        
        case NOTIFICATION_TYPES.SYSTEM_ALERT:
            return NOTIFICATION_PRIORITY.HIGH;
        
        default:
            return NOTIFICATION_PRIORITY.LOW;
    }
}

/**
 * Get icon for notification type
 * @param {string} type - Notification type
 * @returns {string} Emoji icon
 */
function getNotificationIcon(type) {
    switch (type) {
        case NOTIFICATION_TYPES.PLANET_CLAIM:
            return '🔔';
        case NOTIFICATION_TYPES.MINING_FEE:
            return '💰';
        case NOTIFICATION_TYPES.FEE_THRESHOLD:
            return '⚡';
        case NOTIFICATION_TYPES.CLAIM_EXPIRY:
            return '⏰';
        case NOTIFICATION_TYPES.SYSTEM_ALERT:
            return '📢';
        default:
            return '📋';
    }
}

// ============================================================================
// NOTIFICATION CREATION FUNCTIONS
// ============================================================================

/**
 * Add a claim notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Result with created notification
 */
export async function addClaimNotification(notificationData) {
    try {
        // Validate required fields
        if (!notificationData.type || !notificationData.message) {
            return { success: false, error: 'Missing required notification data' };
        }

        const notifications = await getClaimNotifications();
        
        // Determine priority
        const priority = getNotificationPriority(notificationData.type, notificationData);
        
        // Calculate expiration
        const duration = NOTIFICATION_DURATION[priority] || NOTIFICATION_DURATION[NOTIFICATION_PRIORITY.MEDIUM];
        const expiresAt = Date.now() + duration;
        
        // Create notification object
        const notification = {
            id: generateNotificationId(),
            type: notificationData.type,
            title: notificationData.title || getDefaultTitle(notificationData.type),
            message: notificationData.message,
            icon: notificationData.icon || getNotificationIcon(notificationData.type),
            priority: priority,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            expiresAt: expiresAt,
            read: false,
            readBy: [], // Array of player IDs who have read this
            actionUrl: notificationData.actionUrl || null,
            actionText: notificationData.actionText || null,
            
            // Additional data for specific notification types
            planetName: notificationData.planetName,
            ownerName: notificationData.ownerName,
            minerName: notificationData.minerName,
            element: notificationData.element,
            rarity: notificationData.rarity,
            amount: notificationData.amount,
            feePercent: notificationData.feePercent
        };

        // Add to notifications
        notifications.push(notification);
        await saveClaimNotifications(notifications);

        // Dispatch event for real-time UI updates
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('new-claim-notification', {
                detail: notification
            });
            window.dispatchEvent(event);
        }

        return { success: true, notification };
    } catch (error) {
        console.error('Error adding claim notification:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get default title for notification type
 * @param {string} type - Notification type
 * @returns {string} Default title
 */
function getDefaultTitle(type) {
    switch (type) {
        case NOTIFICATION_TYPES.PLANET_CLAIM:
            return '🔔 NEW PLANET CLAIM!';
        case NOTIFICATION_TYPES.MINING_FEE:
            return '💰 MINING FEE EARNED';
        case NOTIFICATION_TYPES.FEE_THRESHOLD:
            return '⚡ MAJOR FEE MILESTONE';
        case NOTIFICATION_TYPES.CLAIM_EXPIRY:
            return '⏰ CLAIM EXPIRING SOON';
        case NOTIFICATION_TYPES.SYSTEM_ALERT:
            return '📢 SYSTEM ALERT';
        default:
            return '📋 NOTIFICATION';
    }
}

/**
 * Add a planet claim notification
 * @param {string} planetName - Name of the planet
 * @param {string} ownerName - Name of the owner
 * @param {string} element - Discovered element
 * @param {string} rarity - Rarity of the element
 * @returns {Promise<Object>} Result with created notification
 */
export async function addPlanetClaimNotification(planetName, ownerName, element, rarity) {
    const message = `${ownerName} discovered ${element} on ${planetName}!`;
    const title = rarity === 'legendary' 
        ? '✨ LEGENDARY DISCOVERY! ✨' 
        : '🔔 New Planet Claim';
    
    return await addClaimNotification({
        type: NOTIFICATION_TYPES.PLANET_CLAIM,
        title: title,
        message: message,
        planetName: planetName,
        ownerName: ownerName,
        element: element,
        rarity: rarity,
        actionUrl: `warp.html?planet=${encodeURIComponent(planetName)}`,
        actionText: '🚀 WARP TO PLANET'
    });
}

/**
 * Add a mining fee notification
 * @param {string} planetName - Name of the planet
 * @param {string} ownerName - Name of the owner
 * @param {string} minerName - Name of the miner (or ID)
 * @param {number} amount - Fee amount in credits
 * @param {number} feePercent - Fee percentage
 * @returns {Promise<Object>} Result with created notification
 */
export async function addMiningFeeNotification(planetName, ownerName, minerName, amount, feePercent) {
    const message = `${minerName} paid ${amount}⭐ fee to ${ownerName} on ${planetName}`;
    
    return await addClaimNotification({
        type: NOTIFICATION_TYPES.MINING_FEE,
        message: message,
        planetName: planetName,
        ownerName: ownerName,
        minerName: minerName,
        amount: amount,
        feePercent: feePercent,
        actionUrl: `my-claims.html?planet=${encodeURIComponent(planetName)}`,
        actionText: '👑 VIEW EARNINGS'
    });
}

/**
 * Add a fee threshold notification (for large fees)
 * @param {string} planetName - Name of the planet
 * @param {string} ownerName - Name of the owner
 * @param {number} amount - Fee amount in credits
 * @param {number} totalEarned - Total earned on this planet
 * @returns {Promise<Object>} Result with created notification
 */
export async function addFeeThresholdNotification(planetName, ownerName, amount, totalEarned) {
    const message = `💰 Major milestone! ${ownerName} earned ${amount}⭐ from a single mining operation on ${planetName}. Total earnings now ${totalEarned}⭐!`;
    
    return await addClaimNotification({
        type: NOTIFICATION_TYPES.FEE_THRESHOLD,
        message: message,
        planetName: planetName,
        ownerName: ownerName,
        amount: amount,
        totalEarned: totalEarned,
        actionUrl: `my-claims.html?planet=${encodeURIComponent(planetName)}`,
        actionText: '👑 VIEW STATS'
    });
}

// ============================================================================
// NOTIFICATION READ STATUS FUNCTIONS
// ============================================================================

/**
 * Mark a notification as read by a player
 * @param {string} notificationId - ID of the notification
 * @param {string} playerId - ID of the player
 * @returns {Promise<boolean>} Success status
 */
export async function markNotificationAsRead(notificationId, playerId) {
    try {
        const notifications = await getClaimNotifications();
        let found = false;
        
        for (const notification of notifications) {
            if (notification.id === notificationId) {
                if (!notification.readBy) {
                    notification.readBy = [];
                }
                if (!notification.readBy.includes(playerId)) {
                    notification.readBy.push(playerId);
                }
                notification.read = true; // Legacy field
                found = true;
                break;
            }
        }
        
        if (found) {
            await saveClaimNotifications(notifications);
            
            // Update read status index
            await updateNotificationReadStatus(playerId, notificationId, true);
        }
        
        return found;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }
}

/**
 * Mark all notifications as read for a player
 * @param {string} playerId - ID of the player
 * @returns {Promise<number>} Number of notifications marked as read
 */
export async function markAllNotificationsAsRead(playerId) {
    try {
        const notifications = await getClaimNotifications();
        let count = 0;
        
        for (const notification of notifications) {
            if (!notification.readBy) {
                notification.readBy = [];
            }
            if (!notification.readBy.includes(playerId)) {
                notification.readBy.push(playerId);
                count++;
            }
            notification.read = true; // Legacy field
        }
        
        if (count > 0) {
            await saveClaimNotifications(notifications);
            await updateBulkNotificationReadStatus(playerId, notifications);
        }
        
        return count;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return 0;
    }
}

/**
 * Check if a notification is read by a player
 * @param {Object} notification - Notification object
 * @param {string} playerId - ID of the player
 * @returns {boolean} True if read by player
 */
export function isNotificationReadByPlayer(notification, playerId) {
    if (!notification.readBy) return false;
    return notification.readBy.includes(playerId);
}

/**
 * Get unread notifications for a player
 * @param {string} playerId - ID of the player
 * @returns {Promise<Array>} Array of unread notifications
 */
export async function getUnreadNotifications(playerId) {
    try {
        const notifications = await getClaimNotifications();
        
        return notifications.filter(notification => 
            !isNotificationExpired(notification) && 
            !isNotificationReadByPlayer(notification, playerId)
        );
    } catch (error) {
        console.error('Error getting unread notifications:', error);
        return [];
    }
}

/**
 * Get unread notification count for a player
 * @param {string} playerId - ID of the player
 * @returns {Promise<number>} Number of unread notifications
 */
export async function getUnreadNotificationCount(playerId) {
    try {
        const unread = await getUnreadNotifications(playerId);
        return unread.length;
    } catch (error) {
        console.error('Error getting unread notification count:', error);
        return 0;
    }
}

// ============================================================================
// NOTIFICATION READ STATUS INDEX (for performance)
// ============================================================================

/**
 * Get notification read status index
 * @returns {Promise<Object>} Read status index
 */
export async function getNotificationReadStatus() {
    try {
        const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_READ_STATUS);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error getting notification read status:', error);
        return {};
    }
}

/**
 * Save notification read status index
 * @param {Object} status - Read status index
 * @returns {Promise<boolean>} Success status
 */
export async function saveNotificationReadStatus(status) {
    try {
        localStorage.setItem(NOTIFICATION_STORAGE_KEYS.NOTIFICATION_READ_STATUS, JSON.stringify(status));
        return true;
    } catch (error) {
        console.error('Error saving notification read status:', error);
        return false;
    }
}

/**
 * Update read status for a notification
 * @param {string} playerId - ID of the player
 * @param {string} notificationId - ID of the notification
 * @param {boolean} read - Read status
 * @returns {Promise<boolean>} Success status
 */
export async function updateNotificationReadStatus(playerId, notificationId, read) {
    try {
        const status = await getNotificationReadStatus();
        
        if (!status[playerId]) {
            status[playerId] = {};
        }
        
        status[playerId][notificationId] = {
            read: read,
            timestamp: Date.now()
        };
        
        return await saveNotificationReadStatus(status);
    } catch (error) {
        console.error('Error updating notification read status:', error);
        return false;
    }
}

/**
 * Update bulk read status for a player
 * @param {string} playerId - ID of the player
 * @param {Array} notifications - Array of notification objects
 * @returns {Promise<boolean>} Success status
 */
export async function updateBulkNotificationReadStatus(playerId, notifications) {
    try {
        const status = await getNotificationReadStatus();
        
        if (!status[playerId]) {
            status[playerId] = {};
        }
        
        const now = Date.now();
        notifications.forEach(notification => {
            if (notification.readBy && notification.readBy.includes(playerId)) {
                status[playerId][notification.id] = {
                    read: true,
                    timestamp: now
                };
            }
        });
        
        return await saveNotificationReadStatus(status);
    } catch (error) {
        console.error('Error updating bulk notification read status:', error);
        return false;
    }
}

// ============================================================================
// NOTIFICATION QUERY FUNCTIONS
// ============================================================================

/**
 * Get notifications for a specific planet
 * @param {string} planetName - Name of the planet
 * @param {number} limit - Maximum number to return
 * @returns {Promise<Array>} Array of notifications
 */
export async function getPlanetNotifications(planetName, limit = 20) {
    try {
        const notifications = await getClaimNotifications();
        
        return notifications
            .filter(n => n.planetName === planetName && !isNotificationExpired(n))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    } catch (error) {
        console.error(`Error getting notifications for planet ${planetName}:`, error);
        return [];
    }
}

/**
 * Get notifications for a specific owner
 * @param {string} ownerName - Name of the owner
 * @param {number} limit - Maximum number to return
 * @returns {Promise<Array>} Array of notifications
 */
export async function getOwnerNotifications(ownerName, limit = 50) {
    try {
        const notifications = await getClaimNotifications();
        
        return notifications
            .filter(n => n.ownerName === ownerName && !isNotificationExpired(n))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    } catch (error) {
        console.error(`Error getting notifications for owner ${ownerName}:`, error);
        return [];
    }
}

/**
 * Get recent notifications for dashboard
 * @param {number} limit - Maximum number to return
 * @returns {Promise<Array>} Array of recent notifications
 */
export async function getRecentNotifications(limit = 10) {
    try {
        const notifications = await getClaimNotifications();
        
        return notifications
            .filter(n => !isNotificationExpired(n))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    } catch (error) {
        console.error('Error getting recent notifications:', error);
        return [];
    }
}

/**
 * Get notifications by type
 * @param {string} type - Notification type
 * @param {number} limit - Maximum number to return
 * @returns {Promise<Array>} Array of notifications
 */
export async function getNotificationsByType(type, limit = 50) {
    try {
        const notifications = await getClaimNotifications();
        
        return notifications
            .filter(n => n.type === type && !isNotificationExpired(n))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    } catch (error) {
        console.error(`Error getting notifications of type ${type}:`, error);
        return [];
    }
}

// ============================================================================
// NOTIFICATION CLEANUP FUNCTIONS
// ============================================================================

/**
 * Clean up expired notifications
 * @returns {Promise<number>} Number of notifications removed
 */
export async function cleanupExpiredNotifications() {
    try {
        const notifications = await getClaimNotifications();
        const beforeCount = notifications.length;
        
        const filtered = notifications.filter(n => !isNotificationExpired(n));
        
        if (filtered.length !== beforeCount) {
            await saveClaimNotifications(filtered);
        }
        
        return beforeCount - filtered.length;
    } catch (error) {
        console.error('Error cleaning up expired notifications:', error);
        return 0;
    }
}

/**
 * Delete a specific notification
 * @param {string} notificationId - ID of the notification to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteNotification(notificationId) {
    try {
        const notifications = await getClaimNotifications();
        const filtered = notifications.filter(n => n.id !== notificationId);
        
        if (filtered.length !== notifications.length) {
            await saveClaimNotifications(filtered);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error deleting notification ${notificationId}:`, error);
        return false;
    }
}

/**
 * Delete all notifications for a player (after they've viewed them)
 * @param {string} playerId - ID of the player
 * @returns {Promise<number>} Number of notifications deleted
 */
export async function deletePlayerNotifications(playerId) {
    try {
        const notifications = await getClaimNotifications();
        const beforeCount = notifications.length;
        
        // Keep notifications that are not read by this player or are still relevant
        const filtered = notifications.filter(n => {
            // Keep if not expired and not read by this player
            if (!isNotificationExpired(n) && !isNotificationReadByPlayer(n, playerId)) {
                return true;
            }
            // Keep if it's a system notification that should persist
            if (n.type === NOTIFICATION_TYPES.SYSTEM_ALERT && n.priority === NOTIFICATION_PRIORITY.CRITICAL) {
                return true;
            }
            return false;
        });
        
        if (filtered.length !== beforeCount) {
            await saveClaimNotifications(filtered);
        }
        
        return beforeCount - filtered.length;
    } catch (error) {
        console.error(`Error deleting notifications for player ${playerId}:`, error);
        return 0;
    }
}

// ============================================================================
// NOTIFICATION UTILITY FUNCTIONS
// ============================================================================

/**
 * Format notification time for display
 * @param {number} timestamp - Notification timestamp
 * @returns {string} Formatted time string
 */
export function formatNotificationTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) {
        return 'just now';
    } else if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else if (days < 7) {
        return `${days}d ago`;
    } else {
        const date = new Date(timestamp);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }
}

/**
 * Get notification style based on priority
 * @param {string} priority - Notification priority
 * @returns {Object} Style object with color and icon
 */
export function getNotificationStyle(priority) {
    switch (priority) {
        case NOTIFICATION_PRIORITY.LOW:
            return { color: '#a0c0ff', icon: '📋', glow: 'none' };
        case NOTIFICATION_PRIORITY.MEDIUM:
            return { color: '#4affaa', icon: '🔔', glow: '0 0 10px #4affaa' };
        case NOTIFICATION_PRIORITY.HIGH:
            return { color: '#ffaa4a', icon: '⚡', glow: '0 0 15px #ffaa4a' };
        case NOTIFICATION_PRIORITY.CRITICAL:
            return { color: '#ff6b6b', icon: '🚨', glow: '0 0 20px #ff6b6b' };
        default:
            return { color: '#ffffff', icon: '📋', glow: 'none' };
    }
}

// ============================================================================
// NOTIFICATION SUBSCRIPTION (for real-time updates)
// ============================================================================

let notificationListeners = [];

/**
 * Subscribe to new notifications
 * @param {Function} callback - Function to call when new notification arrives
 * @returns {Function} Unsubscribe function
 */
export function subscribeToNotifications(callback) {
    if (typeof callback === 'function') {
        notificationListeners.push(callback);
    }
    
    // Return unsubscribe function
    return () => {
        notificationListeners = notificationListeners.filter(cb => cb !== callback);
    };
}

/**
 * Notify all listeners of a new notification
 * @param {Object} notification - New notification object
 */
function notifyListeners(notification) {
    notificationListeners.forEach(callback => {
        try {
            callback(notification);
        } catch (error) {
            console.error('Error in notification listener:', error);
        }
    });
}

// Set up global event listener for custom events
if (typeof window !== 'undefined') {
    window.addEventListener('new-claim-notification', (event) => {
        notifyListeners(event.detail);
    });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    // Types and constants
    NOTIFICATION_TYPES,
    NOTIFICATION_PRIORITY,
    
    // Core functions
    getClaimNotifications,
    addClaimNotification,
    
    // Specialized notification creators
    addPlanetClaimNotification,
    addMiningFeeNotification,
    addFeeThresholdNotification,
    
    // Read status
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotifications,
    getUnreadNotificationCount,
    isNotificationReadByPlayer,
    
    // Queries
    getPlanetNotifications,
    getOwnerNotifications,
    getRecentNotifications,
    getNotificationsByType,
    
    // Cleanup
    cleanupExpiredNotifications,
    deleteNotification,
    deletePlayerNotifications,
    
    // Utilities
    formatNotificationTime,
    getNotificationStyle,
    subscribeToNotifications
};
