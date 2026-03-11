// community-fund.js - Community fund management for Voidfarer
// Tracks where tax money goes, allocates to projects, and funds community initiatives

// ===== DEPENDENCIES =====
// Requires tax-system.js to be loaded first

// ===== FUND ALLOCATION CATEGORIES =====
const FUND_CATEGORIES = {
    INFRASTRUCTURE: 'infrastructure',
    NEW_PLAYER_GRANTS: 'new_player_grants',
    EMERGENCY_AID: 'emergency_aid',
    COMMUNITY_EVENTS: 'community_events',
    RESEARCH: 'research',
    PUBLIC_PROJECTS: 'public_projects',
    RESERVE: 'reserve',
    ADMIN: 'admin'
};

// ===== ALLOCATION TARGETS (ideal percentages) =====
const ALLOCATION_TARGETS = {
    [FUND_CATEGORIES.INFRASTRUCTURE]: 0.28,      // 28% to infrastructure
    [FUND_CATEGORIES.NEW_PLAYER_GRANTS]: 0.15,   // 15% to new players
    [FUND_CATEGORIES.EMERGENCY_AID]: 0.12,        // 12% emergency fund
    [FUND_CATEGORIES.COMMUNITY_EVENTS]: 0.10,     // 10% to events
    [FUND_CATEGORIES.RESEARCH]: 0.08,             // 8% to research
    [FUND_CATEGORIES.PUBLIC_PROJECTS]: 0.17,      // 17% to public projects
    [FUND_CATEGORIES.RESERVE]: 0.07,              // 7% reserve
    [FUND_CATEGORIES.ADMIN]: 0.03                 // 3% administration
};

// ===== STORAGE KEYS =====
const FUND_STORAGE_KEYS = {
    COMMUNITY_FUND: 'voidfarer_community_fund',
    FUND_HISTORY: 'voidfarer_fund_history',
    PROJECTS: 'voidfarer_community_projects',
    GRANTS: 'voidfarer_new_player_grants',
    ALLOCATION_LOG: 'voidfarer_allocation_log',
    FUND_SETTINGS: 'voidfarer_fund_settings'
};

// ===== INITIALIZE FUND =====
function initializeCommunityFund() {
    // Initialize fund if not exists
    if (!localStorage.getItem(FUND_STORAGE_KEYS.COMMUNITY_FUND)) {
        const initialFund = {
            balance: 0,
            totalContributions: 0,
            totalAllocations: 0,
            lastUpdated: Date.now(),
            categories: {}
        };
        
        // Initialize category counters
        Object.values(FUND_CATEGORIES).forEach(cat => {
            initialFund.categories[cat] = 0;
        });
        
        localStorage.setItem(FUND_STORAGE_KEYS.COMMUNITY_FUND, JSON.stringify(initialFund));
    }
    
    // Initialize projects list
    if (!localStorage.getItem(FUND_STORAGE_KEYS.PROJECTS)) {
        localStorage.setItem(FUND_STORAGE_KEYS.PROJECTS, JSON.stringify([]));
    }
    
    // Initialize grants list
    if (!localStorage.getItem(FUND_STORAGE_KEYS.GRANTS)) {
        localStorage.setItem(FUND_STORAGE_KEYS.GRANTS, JSON.stringify([]));
    }
    
    // Initialize allocation log
    if (!localStorage.getItem(FUND_STORAGE_KEYS.ALLOCATION_LOG)) {
        localStorage.setItem(FUND_STORAGE_KEYS.ALLOCATION_LOG, JSON.stringify([]));
    }
    
    // Initialize fund settings
    if (!localStorage.getItem(FUND_STORAGE_KEYS.FUND_SETTINGS)) {
        const settings = {
            allocationTargets: { ...ALLOCATION_TARGETS },
            autoAllocate: true,
            allocationDay: 1, // 1st of month
            minimumReserve: 10000,
            emergencyReservePercent: 0.20,
            publicVoting: true,
            transparencyLevel: 'full' // 'full', 'summary', 'hidden'
        };
        localStorage.setItem(FUND_STORAGE_KEYS.FUND_SETTINGS, JSON.stringify(settings));
    }
}

// ===== FUND ACCESSORS =====
function getCommunityFund() {
    const data = localStorage.getItem(FUND_STORAGE_KEYS.COMMUNITY_FUND);
    return data ? JSON.parse(data) : null;
}

function saveCommunityFund(fund) {
    fund.lastUpdated = Date.now();
    localStorage.setItem(FUND_STORAGE_KEYS.COMMUNITY_FUND, JSON.stringify(fund));
}

// ===== FUND OPERATIONS =====
function addToFund(amount, source, description, category = FUND_CATEGORIES.RESERVE) {
    if (amount <= 0) return { success: false, reason: 'Amount must be positive' };
    
    const fund = getCommunityFund();
    
    fund.balance += amount;
    fund.totalContributions += amount;
    fund.categories[category] = (fund.categories[category] || 0) + amount;
    
    saveCommunityFund(fund);
    
    // Record transaction
    const transaction = {
        id: 'fund_tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: 'contribution',
        amount,
        category,
        source,
        description,
        newBalance: fund.balance,
        timestamp: Date.now(),
        date: new Date().toISOString()
    };
    
    addToAllocationLog(transaction);
    
    return {
        success: true,
        transaction,
        newBalance: fund.balance
    };
}

function allocateFromFund(amount, category, purpose, description, requestedBy = 'system') {
    if (amount <= 0) return { success: false, reason: 'Amount must be positive' };
    
    const fund = getCommunityFund();
    const settings = getFundSettings();
    
    // Check minimum reserve
    const reserveNeeded = settings.minimumReserve;
    const projectedBalance = fund.balance - amount;
    
    if (projectedBalance < reserveNeeded) {
        return { 
            success: false, 
            reason: 'Insufficient funds after reserve',
            reserveNeeded,
            currentBalance: fund.balance
        };
    }
    
    // Check category if specified
    if (category && !Object.values(FUND_CATEGORIES).includes(category)) {
        return { success: false, reason: 'Invalid category' };
    }
    
    fund.balance -= amount;
    fund.totalAllocations += amount;
    
    saveCommunityFund(fund);
    
    // Record allocation
    const allocation = {
        id: 'fund_alloc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: 'allocation',
        amount,
        category,
        purpose,
        description,
        requestedBy,
        newBalance: fund.balance,
        timestamp: Date.now(),
        date: new Date().toISOString()
    };
    
    addToAllocationLog(allocation);
    
    return {
        success: true,
        allocation,
        newBalance: fund.balance
    };
}

// ===== ALLOCATION LOG =====
function getAllocationLog(limit = 100) {
    const log = localStorage.getItem(FUND_STORAGE_KEYS.ALLOCATION_LOG);
    const allLogs = log ? JSON.parse(log) : [];
    return allLogs.slice(-limit);
}

function addToAllocationLog(entry) {
    const log = localStorage.getItem(FUND_STORAGE_KEYS.ALLOCATION_LOG);
    const allLogs = log ? JSON.parse(log) : [];
    
    allLogs.push(entry);
    
    // Keep only last 1000 entries
    if (allLogs.length > 1000) {
        allLogs.shift();
    }
    
    localStorage.setItem(FUND_STORAGE_KEYS.ALLOCATION_LOG, JSON.stringify(allLogs));
}

// ===== FUND SETTINGS =====
function getFundSettings() {
    const data = localStorage.getItem(FUND_STORAGE_KEYS.FUND_SETTINGS);
    return data ? JSON.parse(data) : null;
}

function saveFundSettings(settings) {
    localStorage.setItem(FUND_STORAGE_KEYS.FUND_SETTINGS, JSON.stringify(settings));
}

function updateAllocationTarget(category, newTarget) {
    const settings = getFundSettings();
    if (settings.allocationTargets[category] !== undefined) {
        settings.allocationTargets[category] = Math.max(0, Math.min(1, newTarget));
        saveFundSettings(settings);
        return true;
    }
    return false;
}

// ===== COMMUNITY PROJECTS =====
function getProjects(status = 'all') {
    const projects = localStorage.getItem(FUND_STORAGE_KEYS.PROJECTS);
    const allProjects = projects ? JSON.parse(projects) : [];
    
    if (status === 'all') return allProjects;
    return allProjects.filter(p => p.status === status);
}

function addProject(project) {
    const projects = getProjects('all');
    
    const newProject = {
        id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: project.name,
        description: project.description,
        category: project.category,
        requestedBy: project.requestedBy,
        requestedByName: project.requestedByName,
        cost: project.cost,
        fundingRaised: 0,
        status: 'proposed',
        votes: {},
        totalVotes: 0,
        created: Date.now(),
        createdDate: new Date().toISOString(),
        comments: []
    };
    
    projects.push(newProject);
    localStorage.setItem(FUND_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    
    addToAllocationLog({
        type: 'PROJECT_CREATED',
        projectId: newProject.id,
        projectName: newProject.name,
        cost: newProject.cost,
        requestedBy: newProject.requestedBy,
        timestamp: Date.now()
    });
    
    return newProject;
}

function voteOnProject(projectId, playerId, voteFor) {
    const projects = getProjects('all');
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return { success: false, reason: 'Project not found' };
    if (project.status !== 'proposed' && project.status !== 'voting') {
        return { success: false, reason: 'Project not in voting phase' };
    }
    
    // Check if player already voted
    if (project.votes[playerId]) {
        return { success: false, reason: 'Already voted' };
    }
    
    project.votes[playerId] = voteFor;
    project.totalVotes = (project.totalVotes || 0) + 1;
    
    localStorage.setItem(FUND_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    
    return { success: true, totalVotes: project.totalVotes };
}

function fundProject(projectId) {
    const projects = getProjects('all');
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return { success: false, reason: 'Project not found' };
    if (project.status !== 'approved') {
        return { success: false, reason: 'Project not approved' };
    }
    
    const allocation = allocateFromFund(
        project.cost,
        project.category || FUND_CATEGORIES.PUBLIC_PROJECTS,
        'Community Project',
        `Funding for: ${project.name}`,
        project.requestedBy
    );
    
    if (!allocation.success) {
        return allocation;
    }
    
    project.status = 'funded';
    project.fundedDate = Date.now();
    project.fundingTransaction = allocation.allocation.id;
    
    localStorage.setItem(FUND_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    
    return { success: true, allocation };
}

function approveProject(projectId) {
    const projects = getProjects('all');
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return { success: false, reason: 'Project not found' };
    if (project.status !== 'proposed') {
        return { success: false, reason: 'Project already processed' };
    }
    
    project.status = 'approved';
    project.approvedDate = Date.now();
    
    localStorage.setItem(FUND_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    
    return { success: true };
}

// ===== NEW PLAYER GRANTS =====
function getGrants(status = 'all') {
    const grants = localStorage.getItem(FUND_STORAGE_KEYS.GRANTS);
    const allGrants = grants ? JSON.parse(grants) : [];
    
    if (status === 'all') return allGrants;
    return allGrants.filter(g => g.status === status);
}

function issueNewPlayerGrant(playerId, playerName, amount = null) {
    const settings = getFundSettings();
    const grantAmount = amount || 5000; // Default 5000⭐
    
    const allocation = allocateFromFund(
        grantAmount,
        FUND_CATEGORIES.NEW_PLAYER_GRANTS,
        'New Player Grant',
        `Welcome grant for new player: ${playerName}`,
        'system'
    );
    
    if (!allocation.success) {
        return allocation;
    }
    
    const grant = {
        id: 'grant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        playerId,
        playerName,
        amount: grantAmount,
        status: 'issued',
        issuedDate: Date.now(),
        issuedDateStr: new Date().toISOString(),
        transactionId: allocation.allocation.id,
        notes: 'Welcome to Voidfarer!'
    };
    
    const grants = getGrants('all');
    grants.push(grant);
    localStorage.setItem(FUND_STORAGE_KEYS.GRANTS, JSON.stringify(grants));
    
    return {
        success: true,
        grant,
        allocation
    };
}

function getPlayerGrant(playerId) {
    const grants = getGrants('all');
    return grants.find(g => g.playerId === playerId && g.status === 'issued');
}

// ===== EMERGENCY AID =====
function issueEmergencyAid(playerId, playerName, amount, reason) {
    const allocation = allocateFromFund(
        amount,
        FUND_CATEGORIES.EMERGENCY_AID,
        'Emergency Aid',
        `Emergency assistance for ${playerName}: ${reason}`,
        'system'
    );
    
    if (!allocation.success) {
        return allocation;
    }
    
    return {
        success: true,
        amount,
        playerId,
        playerName,
        reason,
        allocation
    };
}

// ===== FUND SUMMARY =====
function getFundSummary() {
    const fund = getCommunityFund();
    const settings = getFundSettings();
    const projects = getProjects('approved');
    const pendingProjects = getProjects('proposed');
    const grants = getGrants('issued');
    
    // Calculate category percentages
    const categoryPercentages = {};
    Object.keys(fund.categories).forEach(cat => {
        if (fund.totalContributions > 0) {
            categoryPercentages[cat] = (fund.categories[cat] / fund.totalContributions) * 100;
        } else {
            categoryPercentages[cat] = 0;
        }
    });
    
    // Calculate vs targets
    const vsTarget = {};
    Object.keys(settings.allocationTargets).forEach(cat => {
        const actual = categoryPercentages[cat] || 0;
        const target = settings.allocationTargets[cat] * 100;
        vsTarget[cat] = {
            actual: actual.toFixed(1) + '%',
            target: (target).toFixed(1) + '%',
            difference: (actual - target).toFixed(1) + '%',
            onTrack: Math.abs(actual - target) < 5
        };
    });
    
    return {
        balance: fund.balance,
        totalContributions: fund.totalContributions,
        totalAllocations: fund.totalAllocations,
        categoryPercentages,
        vsTarget,
        activeProjects: projects.length,
        pendingProjects: pendingProjects.length,
        activeGrants: grants.length,
        reserveRatio: (fund.balance / fund.totalContributions * 100).toFixed(1) + '%',
        lastUpdated: new Date(fund.lastUpdated).toLocaleString()
    };
}

// ===== MONTHLY ALLOCATION =====
function performMonthlyAllocation() {
    const settings = getFundSettings();
    if (!settings.autoAllocate) {
        return { success: false, reason: 'Auto-allocation disabled' };
    }
    
    const fund = getCommunityFund();
    const monthlyBudget = fund.balance * 0.3; // Allocate 30% of current balance
    
    const results = [];
    
    // Allocate according to targets
    Object.keys(settings.allocationTargets).forEach(category => {
        const targetPercent = settings.allocationTargets[category];
        const categoryAmount = Math.floor(monthlyBudget * targetPercent);
        
        if (categoryAmount > 1000) { // Minimum allocation
            const result = allocateFromFund(
                categoryAmount,
                category,
                'Monthly Allocation',
                `Automatic monthly allocation to ${category}`,
                'system'
            );
            
            if (result.success) {
                results.push({
                    category,
                    amount: categoryAmount,
                    transactionId: result.allocation.id
                });
            }
        }
    });
    
    addToAllocationLog({
        type: 'MONTHLY_ALLOCATION',
        totalBudget: monthlyBudget,
        allocations: results,
        timestamp: Date.now()
    });
    
    return {
        success: true,
        totalAllocated: monthlyBudget,
        allocations: results
    };
}

// ===== TRANSPARENCY REPORT =====
function getTransparencyReport() {
    const fund = getCommunityFund();
    const settings = getFundSettings();
    const log = getAllocationLog(500);
    const projects = getProjects('funded');
    const grants = getGrants('issued');
    
    // Calculate recent activity
    const now = Date.now();
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const recentContributions = log.filter(l => 
        l.type === 'contribution' && l.timestamp > monthAgo
    );
    const recentAllocations = log.filter(l => 
        l.type === 'allocation' && l.timestamp > monthAgo
    );
    
    return {
        summary: {
            balance: fund.balance,
            totalContributions: fund.totalContributions,
            totalAllocations: fund.totalAllocations,
            contributionCount: log.filter(l => l.type === 'contribution').length,
            allocationCount: log.filter(l => l.type === 'allocation').length
        },
        recentActivity: {
            contributions: recentContributions.slice(-10),
            allocations: recentAllocations.slice(-10),
            totalRecentContributions: recentContributions.reduce((sum, l) => sum + l.amount, 0),
            totalRecentAllocations: recentAllocations.reduce((sum, l) => sum + l.amount, 0)
        },
        projects: projects.slice(-5),
        grants: grants.slice(-5),
        settings: {
            transparencyLevel: settings.transparencyLevel,
            autoAllocate: settings.autoAllocate,
            minimumReserve: settings.minimumReserve,
            allocationTargets: settings.allocationTargets
        }
    };
}

// ===== FORMATTING =====
function formatMoney(amount) {
    if (amount >= 1e9) return (amount / 1e9).toFixed(2) + 'B⭐';
    if (amount >= 1e6) return (amount / 1e6).toFixed(2) + 'M⭐';
    if (amount >= 1e3) return (amount / 1e3).toFixed(2) + 'K⭐';
    return amount + '⭐';
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FUND_CATEGORIES,
        ALLOCATION_TARGETS,
        initializeCommunityFund,
        getCommunityFund,
        addToFund,
        allocateFromFund,
        getAllocationLog,
        getFundSettings,
        saveFundSettings,
        updateAllocationTarget,
        getProjects,
        addProject,
        voteOnProject,
        fundProject,
        approveProject,
        getGrants,
        issueNewPlayerGrant,
        getPlayerGrant,
        issueEmergencyAid,
        getFundSummary,
        performMonthlyAllocation,
        getTransparencyReport,
        formatMoney
    };
}

// Initialize on load
initializeCommunityFund();
