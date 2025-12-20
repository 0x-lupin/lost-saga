// Player Configuration - Lost Saga
// Centralized player stats for easy balancing

export const PlayerConfig = {
    // Core stats
    stats: {
        health: 100,
        maxHealth: 100,
        moveSpeed: 8,
        jumpForce: 12,
        attackDamage: 15,
        attackRange: 3.5,
        collisionRadius: 0.5,
        mass: 1.0
    },
    
    // Dash ability
    dash: {
        cooldown: 2.0,      // Seconds before can dash again
        duration: 0.2,       // How long the dash lasts
        speed: 25            // Dash movement speed
    },
    
    // Attack timing (in seconds)
    attack: {
        windup: 0.12,        // Wind-up before hit
        swing: 0.08,         // Swing duration (hit happens at 50%)
        followthrough: 0.15  // Follow-through after hit
    },
    
    // Knockback settings
    knockback: {
        friction: 8,         // How fast knockback decays
        force: 12            // Default knockback force applied
    },
    
    // Visual colors (hex)
    colors: {
        skin: 0xd4a574,
        skinDark: 0xc49464,
        hair: 0x2c1810,
        armor: 0x4a5568,
        armorLight: 0x718096,
        armorDark: 0x2d3748,
        leather: 0x5c4033,
        leatherDark: 0x3d2817,
        gold: 0xd4af37,
        cloth: 0x1a365d,
        clothLight: 0x2c5282
    }
};

export default PlayerConfig;
