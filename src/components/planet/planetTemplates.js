export const planetTemplates = [
    {
        id: 'lush-1',
        name: 'VERDANT PRIME',
        type: 'Lush',
        colors: {
            oceanBase: '#1a3344',
            oceanMid: '#2d4b66',
            oceanShallow: '#4a7a9e',
            landDark: '#3d2b1a',
            landLight: '#6b4e2e',
            highlight: '#d9b38c'
        },
        atmosphere: '#4a7a9e',
        hasRings: false,
        ringColor: null,
        temperature: 22,
        atmosphere_type: 'Breathable'
    },
    {
        id: 'frozen-1',
        name: 'GLACIER-7',
        type: 'Frozen',
        colors: {
            oceanBase: '#2a3f5e',
            oceanMid: '#3d5f7a',
            oceanShallow: '#6d9eb0',
            landDark: '#4a5b66',
            landLight: '#8ba5b5',
            highlight: '#ffffff'
        },
        atmosphere: '#a5d0e0',
        hasRings: true,
        ringColor: '#c0d0e0',
        temperature: -45,
        atmosphere_type: 'Toxic'
    }
    // Add 18 more templates here!
];
