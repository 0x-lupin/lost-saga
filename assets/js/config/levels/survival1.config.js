// Survival Mode Configuration - Large Arena
// Level-specific settings for endless survival

export const Survival1Config = {
    name: 'Survival Arena',
    
    // Arena boundaries (larger than Level1)
    arena: {
        bounds: { minX: -48, maxX: 48, minZ: -28, maxZ: 28 },
        shadowBounds: { left: -50, right: 50, top: 30, bottom: -30 }
    },
    
    // Camera settings (wider view)
    camera: {
        offset: { x: 0, y: 14, z: 16 },
        heightFactor: 0.5
    },
    
    // Enemy spawning
    enemies: {
        maxAlive: 12,
        spawnInterval: 3.0,
        minSpawnInterval: 0.9,
        initialPositions: [
            { x: -15, z: -10 }, { x: 15, z: -10 },
            { x: -20, z: 5 }, { x: 20, z: 5 },
            { x: 0, z: -15 }
        ]
    },
    
    // Difficulty scaling
    difficulty: {
        levelUpInterval: 4,  // Seconds between difficulty increases
        maxEnemiesIncreasePerLevel: 1,
        maxEnemiesCap: 999,
        spawnIntervalDecreasePerLevel: 0.1
    },
    
    // Score settings
    score: {
        baseKillPoints: 100
        // Multiplied by difficultyLevel in-game
    },
    
    // Environment placement
    environment: {
        trees: [
            // Corners
            { x: -42, z: -24 }, { x: 42, z: -24 }, { x: -42, z: 24 }, { x: 42, z: 24 },
            // Along back wall
            { x: -30, z: -25 }, { x: -15, z: -26 }, { x: 15, z: -26 }, { x: 30, z: -25 },
            // Middle areas (avoiding paths)
            { x: -25, z: -12 }, { x: 25, z: -12 }, { x: -25, z: 12 }, { x: 25, z: 12 },
            { x: -35, z: 0 }, { x: 35, z: 0 },
            // Near front
            { x: -20, z: 20 }, { x: 20, z: 20 }, { x: -38, z: 18 }, { x: 38, z: 18 }
        ],
        rocks: [
            { x: -18, z: -15, scale: 1.2 }, { x: 22, z: -18, scale: 1.0 },
            { x: -30, z: 8, scale: 0.9 }, { x: 28, z: 10, scale: 1.1 },
            { x: -12, z: 18, scale: 0.8 }, { x: 14, z: 16, scale: 0.7 },
            { x: -40, z: -8, scale: 1.0 }, { x: 40, z: -5, scale: 0.9 },
            { x: -8, z: -20, scale: 0.6 }, { x: 10, z: -22, scale: 0.8 },
            { x: 0, z: 22, scale: 1.0 }, { x: -45, z: 15, scale: 0.7 },
            { x: 45, z: -15, scale: 0.8 }
        ],
        torches: [
            // Along walls
            { x: -45, z: -20 }, { x: -45, z: 0 }, { x: -45, z: 20 },
            { x: 45, z: -20 }, { x: 45, z: 0 }, { x: 45, z: 20 },
            { x: -25, z: -27 }, { x: 0, z: -27 }, { x: 25, z: -27 },
            // Interior torches
            { x: -20, z: -8 }, { x: 20, z: -8 }, { x: -20, z: 8 }, { x: 20, z: 8 }
        ],
        dummies: [
            { x: -15, z: 5 }, { x: 15, z: -5 },
            { x: -32, z: -15 }, { x: 32, z: 15 }
        ]
    },
    
    // Grass settings
    grass: {
        denseCount: 300,
        wallCount: 60,
        treeClusterCount: 8
    }
};

export default Survival1Config;
