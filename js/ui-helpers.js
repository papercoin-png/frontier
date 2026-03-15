// js/ui-helpers.js - UI Components and Helpers
// Progress bars, skill trees visualization, and reusable UI components

// ===== PROGRESS BAR UTILITIES =====

/**
 * Create a progress bar element
 * @param {number} percent - Percent complete (0-100)
 * @param {string} color - Color class or hex value
 * @param {string} size - Size variant: 'small', 'medium', 'large'
 * @param {boolean} showText - Whether to show percentage text
 * @returns {HTMLElement} Progress bar container
 */
export function createProgressBar(percent, color = 'default', size = 'medium', showText = false) {
    const container = document.createElement('div');
    container.className = `progress-bar-container progress-${size}`;
    
    const bar = document.createElement('div');
    bar.className = `progress-bar-fill progress-${color}`;
    bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    
    container.appendChild(bar);
    
    if (showText) {
        const text = document.createElement('span');
        text.className = 'progress-text';
        text.textContent = `${Math.round(percent)}%`;
        container.appendChild(text);
    }
    
    return container;
}

/**
 * Create a circular progress indicator
 * @param {number} percent - Percent complete (0-100)
 * @param {number} size - Size in pixels
 * @param {string} color - Color class or hex value
 * @returns {HTMLElement} Circular progress element
 */
export function createCircularProgress(percent, size = 60, color = 'default') {
    const container = document.createElement('div');
    container.className = `circular-progress circular-${color}`;
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.transform = 'rotate(-90deg)';
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(255,255,255,0.1)');
    circle.setAttribute('stroke-width', '8');
    
    const progress = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progress.setAttribute('cx', '50');
    progress.setAttribute('cy', '50');
    progress.setAttribute('r', '45');
    progress.setAttribute('fill', 'none');
    progress.setAttribute('stroke', 'currentColor');
    progress.setAttribute('stroke-width', '8');
    progress.setAttribute('stroke-linecap', 'round');
    
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percent / 100) * circumference;
    progress.style.strokeDasharray = `${circumference}`;
    progress.style.strokeDashoffset = offset;
    
    svg.appendChild(circle);
    svg.appendChild(progress);
    container.appendChild(svg);
    
    const text = document.createElement('div');
    text.className = 'circular-progress-text';
    text.textContent = `${Math.round(percent)}%`;
    container.appendChild(text);
    
    return container;
}

/**
 * Create a skill progress row with icon, name, and progress bar
 * @param {Object} skill - Skill data { name, progress, target, icon, color }
 * @returns {HTMLElement} Skill progress row
 */
export function createSkillProgressRow(skill) {
    const row = document.createElement('div');
    row.className = 'skill-progress-row';
    
    const percent = (skill.progress / skill.target) * 100;
    
    row.innerHTML = `
        <div class="skill-row-icon">${skill.icon || '⚡'}</div>
        <div class="skill-row-info">
            <div class="skill-row-name">${skill.name}</div>
            <div class="skill-row-progress">
                <div class="progress-bar-container progress-small">
                    <div class="progress-bar-fill progress-${skill.color || 'default'}" 
                         style="width: ${percent}%"></div>
                </div>
                <div class="skill-row-stats">
                    <span class="skill-row-current">${skill.progress}</span>
                    <span class="skill-row-target">/${skill.target}</span>
                </div>
            </div>
        </div>
        <div class="skill-row-level">${skill.level || 'Untrained'}</div>
    `;
    
    return row;
}

// ===== SKILL TREE VISUALIZATION =====

/**
 * Create a skill tree visualization
 * @param {Array} nodes - Skill nodes with dependencies
 * @param {Object} progress - Current progress for each node
 * @param {Function} onClick - Click handler for nodes
 * @returns {HTMLElement} Skill tree container
 */
export function createSkillTree(nodes, progress = {}, onClick = null) {
    const container = document.createElement('div');
    container.className = 'skill-tree-container';
    
    // Group nodes by tier
    const tiers = {};
    nodes.forEach(node => {
        if (!tiers[node.tier]) tiers[node.tier] = [];
        tiers[node.tier].push(node);
    });
    
    // Create tier columns
    Object.keys(tiers).sort((a, b) => a - b).forEach(tier => {
        const tierColumn = document.createElement('div');
        tierColumn.className = 'skill-tree-tier';
        tierColumn.dataset.tier = tier;
        
        const tierHeader = document.createElement('div');
        tierHeader.className = 'skill-tree-tier-header';
        tierHeader.textContent = `Tier ${tier}`;
        tierColumn.appendChild(tierHeader);
        
        tiers[tier].forEach(node => {
            const nodeProgress = progress[node.id] || 0;
            const isUnlocked = nodeProgress > 0;
            const isCurrent = nodeProgress >= node.target;
            
            const nodeEl = document.createElement('div');
            nodeEl.className = `skill-tree-node ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`;
            nodeEl.dataset.id = node.id;
            
            const percent = node.target ? (nodeProgress / node.target) * 100 : 0;
            
            nodeEl.innerHTML = `
                <div class="skill-tree-node-icon">${node.icon || '⚡'}</div>
                <div class="skill-tree-node-content">
                    <div class="skill-tree-node-name">${node.name}</div>
                    <div class="skill-tree-node-progress">
                        <div class="progress-bar-container progress-tiny">
                            <div class="progress-bar-fill progress-${node.color || 'default'}" 
                                 style="width: ${percent}%"></div>
                        </div>
                    </div>
                </div>
            `;
            
            if (onClick) {
                nodeEl.addEventListener('click', () => onClick(node.id));
            }
            
            tierColumn.appendChild(nodeEl);
        });
        
        container.appendChild(tierColumn);
    });
    
    // Draw dependency lines
    setTimeout(() => drawDependencyLines(container, nodes), 100);
    
    return container;
}

/**
 * Draw dependency lines between skill nodes
 * @param {HTMLElement} container - Skill tree container
 * @param {Array} nodes - Skill nodes with dependencies
 */
function drawDependencyLines(container, nodes) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'skill-tree-lines');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    
    nodes.forEach(node => {
        if (!node.dependencies) return;
        
        const fromEl = container.querySelector(`[data-id="${node.id}"]`);
        if (!fromEl) return;
        
        const fromRect = fromEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        node.dependencies.forEach(depId => {
            const toEl = container.querySelector(`[data-id="${depId}"]`);
            if (!toEl) return;
            
            const toRect = toEl.getBoundingClientRect();
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromRect.left + fromRect.width/2 - containerRect.left);
            line.setAttribute('y1', fromRect.top + fromRect.height/2 - containerRect.top);
            line.setAttribute('x2', toRect.left + toRect.width/2 - containerRect.left);
            line.setAttribute('y2', toRect.top + toRect.height/2 - containerRect.top);
            line.setAttribute('stroke', 'rgba(255,217,102,0.3)');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '5,5');
            
            svg.appendChild(line);
        });
    });
    
    container.appendChild(svg);
}

// ===== STAT CARD COMPONENTS =====

/**
 * Create a stat card
 * @param {Object} stat - Stat data { label, value, icon, color, trend }
 * @returns {HTMLElement} Stat card
 */
export function createStatCard(stat) {
    const card = document.createElement('div');
    card.className = `stat-card stat-${stat.color || 'default'}`;
    
    const trendIcon = stat.trend > 0 ? '📈' : stat.trend < 0 ? '📉' : '📊';
    const trendClass = stat.trend > 0 ? 'positive' : stat.trend < 0 ? 'negative' : 'neutral';
    
    card.innerHTML = `
        <div class="stat-card-icon">${stat.icon || '📊'}</div>
        <div class="stat-card-content">
            <div class="stat-card-label">${stat.label}</div>
            <div class="stat-card-value">${stat.value}</div>
            ${stat.trend !== undefined ? `
                <div class="stat-card-trend ${trendClass}">
                    ${trendIcon} ${Math.abs(stat.trend)}%
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

/**
 * Create a resource card
 * @param {Object} resource - Resource data { name, amount, icon, rarity, mass }
 * @returns {HTMLElement} Resource card
 */
export function createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = `resource-card rarity-${resource.rarity || 'common'}`;
    
    card.innerHTML = `
        <div class="resource-card-icon">${resource.icon || '🔹'}</div>
        <div class="resource-card-info">
            <div class="resource-card-name">${resource.name}</div>
            <div class="resource-card-details">
                <span class="resource-card-amount">${resource.amount}</span>
                ${resource.mass ? `<span class="resource-card-mass">⚖️ ${resource.mass}</span>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Create a product card (for ships, equipment, etc.)
 * @param {Object} product - Product data
 * @param {Function} onPurchase - Purchase handler
 * @returns {HTMLElement} Product card
 */
export function createProductCard(product, onPurchase = null) {
    const card = document.createElement('div');
    card.className = `product-card ${product.owned ? 'owned' : ''} ${product.qualified ? '' : 'unqualified'}`;
    
    const priceDisplay = product.currentPrice?.toLocaleString() || product.basePrice?.toLocaleString();
    const priceTrend = product.priceMultiplier > 1 ? '📈' : product.priceMultiplier < 1 ? '📉' : '📊';
    
    card.innerHTML = `
        <div class="product-card-header">
            <span class="product-card-name">${product.icon || '📦'} ${product.name}</span>
            <span class="product-card-type">${product.class || product.equipmentType || product.infrastructureType || ''}</span>
        </div>
        <div class="product-card-description">${product.description || ''}</div>
        <div class="product-card-specs">
            ${renderSpecs(product.specs)}
        </div>
        <div class="product-card-price">
            <span class="price-label">Price ${priceTrend}</span>
            <span class="price-amount">${priceDisplay}⭐</span>
        </div>
        ${onPurchase ? `
            <button class="product-card-btn ${product.owned ? 'owned' : ''}" 
                    ${product.owned ? 'disabled' : ''}
                    onclick="window.purchaseProduct('${product.id}')">
                ${product.owned ? '✓ OWNED' : 'PURCHASE'}
            </button>
        ` : ''}
    `;
    
    return card;
}

/**
 * Render specs object as HTML
 * @param {Object} specs - Specifications object
 * @returns {string} HTML string
 */
function renderSpecs(specs) {
    if (!specs) return '';
    
    return Object.entries(specs)
        .map(([key, value]) => `
            <div class="spec-row">
                <span class="spec-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
}

// ===== MODAL COMPONENTS =====

/**
 * Create a modal dialog
 * @param {Object} options - Modal options { title, content, buttons, onClose }
 * @returns {HTMLElement} Modal element
 */
export function createModal(options) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
        <h2 class="modal-title">${options.title || 'Modal'}</h2>
        <button class="modal-close">&times;</button>
    `;
    
    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    if (typeof options.content === 'string') {
        body.innerHTML = options.content;
    } else if (options.content instanceof HTMLElement) {
        body.appendChild(options.content);
    }
    
    // Footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    if (options.buttons) {
        options.buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = `modal-btn ${btn.class || ''}`;
            button.textContent = btn.text;
            if (btn.onClick) {
                button.addEventListener('click', btn.onClick);
            }
            footer.appendChild(button);
        });
    }
    
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    
    // Close handlers
    const closeBtn = header.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (options.onClose) options.onClose();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            if (options.onClose) options.onClose();
        }
    });
    
    return overlay;
}

/**
 * Show a confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Confirm handler
 * @param {Function} onCancel - Cancel handler
 */
export function showConfirm(message, onConfirm, onCancel) {
    const modal = createModal({
        title: 'Confirm',
        content: `<p class="confirm-message">${message}</p>`,
        buttons: [
            {
                text: 'Confirm',
                class: 'confirm-btn',
                onClick: () => {
                    document.body.removeChild(modal);
                    if (onConfirm) onConfirm();
                }
            },
            {
                text: 'Cancel',
                class: 'cancel-btn',
                onClick: () => {
                    document.body.removeChild(modal);
                    if (onCancel) onCancel();
                }
            }
        ]
    });
    
    document.body.appendChild(modal);
}

/**
 * Show a notification toast
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in ms
 */
export function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || '📢'}</span>
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// ===== TAB COMPONENTS =====

/**
 * Create a tabbed interface
 * @param {Array} tabs - Tab data { id, label, content, icon }
 * @param {string} activeTab - Active tab ID
 * @param {Function} onSwitch - Tab switch handler
 * @returns {HTMLElement} Tab container
 */
export function createTabs(tabs, activeTab = null, onSwitch = null) {
    const container = document.createElement('div');
    container.className = 'tabs-container';
    
    // Tab headers
    const headers = document.createElement('div');
    headers.className = 'tabs-headers';
    
    tabs.forEach(tab => {
        const header = document.createElement('button');
        header.className = `tab-header ${tab.id === activeTab ? 'active' : ''}`;
        header.dataset.tab = tab.id;
        header.innerHTML = `${tab.icon || ''} ${tab.label}`;
        
        header.addEventListener('click', () => {
            // Update active states
            headers.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
            header.classList.add('active');
            
            // Show corresponding content
            contents.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const content = contents.querySelector(`[data-tab="${tab.id}"]`);
            if (content) content.classList.add('active');
            
            if (onSwitch) onSwitch(tab.id);
        });
        
        headers.appendChild(header);
    });
    
    // Tab contents
    const contents = document.createElement('div');
    contents.className = 'tabs-contents';
    
    tabs.forEach(tab => {
        const content = document.createElement('div');
        content.className = `tab-content ${tab.id === activeTab ? 'active' : ''}`;
        content.dataset.tab = tab.id;
        
        if (typeof tab.content === 'string') {
            content.innerHTML = tab.content;
        } else if (tab.content instanceof HTMLElement) {
            content.appendChild(tab.content);
        }
        
        contents.appendChild(content);
    });
    
    container.appendChild(headers);
    container.appendChild(contents);
    
    return container;
}

// ===== DROPDOWN COMPONENTS =====

/**
 * Create a dropdown menu
 * @param {Array} items - Menu items { label, value, icon, onClick }
 * @param {string} placeholder - Placeholder text
 * @returns {HTMLElement} Dropdown container
 */
export function createDropdown(items, placeholder = 'Select...') {
    const container = document.createElement('div');
    container.className = 'dropdown-container';
    
    const button = document.createElement('button');
    button.className = 'dropdown-button';
    button.innerHTML = `<span>${placeholder}</span> <span class="dropdown-arrow">▼</span>`;
    
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu';
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'dropdown-item';
        menuItem.innerHTML = `${item.icon || ''} ${item.label}`;
        
        menuItem.addEventListener('click', () => {
            button.querySelector('span').textContent = item.label;
            menu.classList.remove('show');
            if (item.onClick) item.onClick(item.value);
        });
        
        menu.appendChild(menuItem);
    });
    
    button.addEventListener('click', () => {
        menu.classList.toggle('show');
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            menu.classList.remove('show');
        }
    });
    
    container.appendChild(button);
    container.appendChild(menu);
    
    return container;
}

// ===== TOOLTIP UTILITIES =====

/**
 * Add tooltip to element
 * @param {HTMLElement} element - Target element
 * @param {string} text - Tooltip text
 * @param {string} position - Position: 'top', 'bottom', 'left', 'right'
 */
export function addTooltip(element, text, position = 'top') {
    element.classList.add('has-tooltip');
    element.setAttribute('data-tooltip', text);
    element.setAttribute('data-tooltip-position', position);
}

// ===== FORMATTING UTILITIES =====

/**
 * Format number with K/M/B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
}

/**
 * Format duration
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

/**
 * Format date relative to now
 * @param {Date|number} date - Date or timestamp
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
    const now = Date.now();
    const then = date instanceof Date ? date.getTime() : date;
    const diff = now - then;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 30) return new Date(then).toLocaleDateString();
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
}

// ===== ANIMATION UTILITIES =====

/**
 * Animate number counting up
 * @param {HTMLElement} element - Element to update
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Duration in ms
 */
export function animateCount(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current).toLocaleString();
    }, 16);
}

/**
 * Fade in element
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Duration in ms
 */
export function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let last = performance.now();
    const timer = setInterval(() => {
        const now = performance.now();
        const delta = now - last;
        last = now;
        
        let opacity = parseFloat(element.style.opacity) + (delta / duration);
        if (opacity >= 1) {
            opacity = 1;
            clearInterval(timer);
        }
        element.style.opacity = opacity;
    }, 16);
}

/**
 * Fade out element
 * @param {HTMLElement} element - Element to fade out
 * @param {number} duration - Duration in ms
 */
export function fadeOut(element, duration = 300) {
    let last = performance.now();
    const timer = setInterval(() => {
        const now = performance.now();
        const delta = now - last;
        last = now;
        
        let opacity = parseFloat(element.style.opacity) - (delta / duration);
        if (opacity <= 0) {
            opacity = 0;
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = opacity;
    }, 16);
}

// ===== EXPORT ALL =====
export default {
    createProgressBar,
    createCircularProgress,
    createSkillProgressRow,
    createSkillTree,
    createStatCard,
    createResourceCard,
    createProductCard,
    createModal,
    showConfirm,
    showNotification,
    createTabs,
    createDropdown,
    addTooltip,
    formatNumber,
    formatDuration,
    formatRelativeTime,
    animateCount,
    fadeIn,
    fadeOut
};

// Attach to window for global access
window.UIHelpers = {
    createProgressBar,
    createCircularProgress,
    createSkillProgressRow,
    createSkillTree,
    createStatCard,
    createResourceCard,
    createProductCard,
    createModal,
    showConfirm,
    showNotification,
    createTabs,
    createDropdown,
    addTooltip,
    formatNumber,
    formatDuration,
    formatRelativeTime,
    animateCount,
    fadeIn,
    fadeOut
};

console.log('✅ ui-helpers.js loaded - UI components ready');
