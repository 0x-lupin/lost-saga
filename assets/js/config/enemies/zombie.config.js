// Zombie Enemy Configuration - Lost Saga
// Centralized zombie stats for easy balancing

export const ZombieConfig = {
    name: 'Zombie',
    
    // Base stats (default zombie)
    stats: {
        size: 1.0,
        health: 30,
        attackDamage: 10,
        speed: {
            base: 1.5,
            variance: 0.5  // Random addition to base speed
        },
        lungeMultiplier: 1.5,  // Attack range multiplier for lunge
        windUpDuration: 0.5,   // Seconds before attack lands
        attackCooldown: 1.5    // Seconds between attacks
    },
    
    // Visual colors (hex)
    colors: {
        skin: 0x6b8e6b,        // Greenish dead skin
        skinDark: 0x4a6b4a,    // Darker skin variation
        cloth: 0x3d3d3d,       // Torn dark clothes
        pants: 0x4a3728        // Dirty brown pants
    },
    
    // Spawn animation
    spawn: {
        duration: 1.2,         // Seconds to rise from ground
        startY: -1.8           // Starting Y position underground
    },
    
    // Variant types (for difficulty scaling)
    variants: {
        // Big zombie - slower but tankier
        big: {
            size: 1.3,
            health: 50,
            attackDamage: 15,
            speed: {
                base: 1.2,
                variance: 0.2
            },
            // Scaling per difficulty level
            scaling: {
                sizePerLevel: 0.039,
                healthPerLevel: 0.5,
                speedPerLevel: 0.039,
                damagePerLevel: 0.01
            }
        },
        
        // Fast zombie - quick but fragile
        fast: {
            size: 0.8,
            health: 20,
            attackDamage: 8,
            speed: {
                base: 2.5,
                variance: 0.1
            },
            // Scaling per difficulty level
            scaling: {
                speedPerLevel: 0.07
            }
        },
        
        // Normal zombie scaling
        normal: {
            scaling: {
                healthPerLevel: 0.07,
                damagePerLevel: 0.01,
                speedPerLevel: 0.01
            }
        }
    },
    
    // Spawn chances for survival mode
    spawnChances: {
        big: {
            minLevel: 1,       // Minimum difficulty level to spawn
            baseChance: 0.01,  // Starting spawn chance
            maxChance: 0.05,   // Maximum spawn chance
            increasePerLevel: 0.0015
        },
        fast: {
            minLevel: 2,
            baseChance: 0.03,
            maxChance: 0.08,
            increasePerLevel: 0.0025
        }
    }
};

export default ZombieConfig;
