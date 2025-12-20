// Level 1 Configuration - Training Grounds
// Level-specific settings

export const Level1Config = {
    name: 'Training Grounds',
    
    // Arena boundaries
    arena: {
        bounds: { minX: -24, maxX: 24, minZ: -14, maxZ: 14 }
    },
    
    // Camera settings
    camera: {
        offset: { x: 0, y: 10, z: 12 },
        heightFactor: 0.5
    },
    
    // Enemy spawning
    enemies: {
        total: 15,
        spawnInterval: 2.5,  // Seconds between spawns
        initialPositions: [
            { x: -10, z: 0 },
            { x: 10, z: 0 },
            { x: 0, z: -5 },
            { x: -5, z: 3 },
            { x: 5, z: 3 }
        ]
    },
    
    // Score settings
    score: {
        multiplier: 1,
        killPoints: 100
    },
    
    // Environment placement
    environment: {
        trees: [
            { x: -18, z: -10 }, { x: -20, z: 5 }, { x: 18, z: -8 },
            { x: 20, z: 6 }, { x: -10, z: -12 }, { x: 10, z: -11 },
            { x: 0, z: 12 }
        ],
        rocks: [
            { x: -15, z: 3, scale: 1.0 },
            { x: 16, z: -4, scale: 0.8 },
            { x: -8, z: -10, scale: 0.7 },
            { x: 12, z: 8, scale: 0.9 },
            { x: -5, z: 10, scale: 0.6 }
        ],
        torches: [
            { x: -12, z: -9 }, { x: 12, z: -9 },
            { x: -18, z: 3 }, { x: 18, z: 3 }
        ],
        dummies: [
            { x: -8, z: 5 }, { x: 8, z: -5 }
        ]
    }
};

export default Level1Config;
