# Lost Saga - TODO List

## Priority: High (Scalability Issues)

### 1. Create Base Level Class
**File:** `core/BaseLevel.js`
**Why:** Level2, Level3 would duplicate camera follow, damage handling, UI updates
**What to extract from Level1:**
- `update()` - camera follow logic
- `takeDamage()` - damage handling + screen flash
- `updateHealthBar()` - health bar UI
- `updateScore()` - score UI
- `levelComplete()` - level complete trigger
- `bindControls()` - basic control binding

```javascript
// Example structure
export class BaseLevel {
    constructor(game) { ... }
    updateCamera(playerPos) { ... }
    takeDamage(amount) { ... }
    updateHealthBar() { ... }
    updateScore() { ... }
    // Abstract methods for subclasses
    init() { throw 'implement in subclass'; }
    createEnvironment() { throw 'implement in subclass'; }
}
```

### 2. ~~Create UI Manager~~ ✅ DONE
**File:** `core/UI.js`
**Methods:**
- `updateHealth(health, maxHealth)` - Updates health bar + color
- `updateScore(score)` - Updates score display
- `showStartScreen()` / `hideStartScreen()`
- `showGameOver(score)` / `hideGameOver()`
- `showLevelComplete(score)` / `hideLevelComplete()`
- `showDamageFlash()` - Red screen flash
- `reset()` - Reset health and score to defaults

**Usage:** Access via `this.game.ui` in levels

### 3. Create Camera Controller
**File:** `core/Camera.js`
**Why:** Camera logic in Level1, should be in Game or separate controller
**What to include:**
- `follow(target, offset)`
- `setMode('follow' | 'fixed' | 'cinematic')`
- `shake(intensity, duration)` - for damage feedback

### 4. ~~Create Constants/Config File~~ (NOT NEEDED)
**Reason:** Each level has different arena bounds, spawn positions, enemy counts, etc.
Level-specific config should stay in each Level class.

**What stays per-level:**
- Arena bounds
- Spawn positions
- Enemy count/types
- Platform layout
- Environment theme

**What could be shared (optional):**
- Player base stats (but could also vary per level for difficulty)
- Enemy type base stats (defined in each Enemy class already)

**Current approach is fine:** Each level defines its own config in constructor.

---

## Priority: Medium (New Features)

### 5. Create Environment/Arena Class
**File:** `environments/TrainingArena.js`
**Why:** Environment creation hardcoded in Level1
**What to include:**
- `create(scene)` - create ground, platforms, decorations
- `getPlatforms()` - return platform collision data
- `getBounds()` - return arena bounds

### 6. Add Sound Manager
**File:** `core/SoundManager.js`
**Features:**
- Background music
- Attack sounds
- Hit sounds
- Death sounds
- UI sounds

### 7. Add Particle Effects
**File:** `core/Particles.js`
**Features:**
- Blood splatter on hit
- Dust on landing
- Slash trail on attack

### 8. Add More Enemy Types
**Files:** `entities/Skeleton.js`, `entities/Ghost.js`, etc.
**Each needs:**
- Unique appearance (create method)
- Different stats (health, speed, damage)
- Unique attack patterns
- Death animation

### 9. Create Level2, Level3
**Files:** `levels/Level2.js`, `levels/Level3.js`
**Each level needs:**
- Different environment
- Different enemy mix
- Increasing difficulty
- Unique mechanics?

### 10. Add Level Progression System
**In Game.js:**
- Track current level number
- `nextLevel()` should load next level class
- Save/load progress (localStorage)

---

## Priority: Low (Polish)

### 11. Add Player Death Animation
**In Player.js:**
- Fall animation when health reaches 0
- Delay before game over screen

### 12. Add Spawn Animation for Enemies
**In Enemy.js:**
- Rise from ground effect
- Brief invulnerability

### 13. Add Hit Feedback
- Screen shake on player damage
- Slow motion on kill (optional)
- Damage numbers floating up

### 14. Add Pause Menu
- ESC key to pause
- Pause overlay with resume/quit

### 15. Add Settings
- Volume controls
- Control rebinding
- Graphics quality

### 16. Mobile Optimization (IMPORTANT - Mobile is a primary platform!)
**Current mobile support:**
- Virtual joystick (left side) - in controls.js setupJoystick()
- JUMP + ATK buttons (right side) - in controls.js setupMobileButtons()
- Fullscreen button
- CSS hides mobile controls on desktop (@media query in style.css)
- viewport meta tag with user-scalable=no

**TODO for mobile:**
- [ ] Test on actual devices (iOS Safari, Android Chrome)
- [ ] Larger touch targets if needed
- [ ] Performance tuning (reduce shadow quality, polygon count)
- [ ] Touch-based camera rotation? (optional)
- [ ] Prevent accidental zoom/scroll
- [ ] Handle orientation changes
- [ ] Add haptic feedback on attack/damage (navigator.vibrate)

---

## Bug Fixes / Known Issues

### Current Bugs
- [ ] Sword orientation may still look off from certain angles
- [ ] Enemy can attack through platforms
- [ ] No collision between enemies (they stack)

### Performance
- [ ] Consider object pooling for enemies (reuse instead of create/destroy)
- [ ] LOD for distant objects if adding more detail

---

## File Changes Summary

### Files to CREATE:
```
core/BaseLevel.js
core/Camera.js
core/SoundManager.js
core/Particles.js
environments/TrainingArena.js
entities/Skeleton.js
levels/Level2.js
levels/Level3.js
```

### Files CREATED:
```
core/UI.js ✅
```

### Files to MODIFY:
```
core/Game.js - Add UI, Camera, level progression
levels/Level1.js - Extend BaseLevel, use constants
entities/Player.js - Use constants, add death animation
entities/Enemy.js - Use constants, add spawn animation
main.js - Level progression logic
index.html - Pause menu, settings
style.css - New UI elements
```

---

## Quick Reference: Current Level1 Config

```javascript
// Level1.js current settings
totalEnemies: 10        // Total enemies to spawn
spawnedCount: 0         // Tracks spawned count
killCount: 0            // Tracks kills
arenaBounds: { minX: -18, maxX: 18, minZ: -8, maxZ: 8 }

// Initial spawn positions (5 enemies)
positions: [
    { x: -10, z: 0 },
    { x: 10, z: 0 },
    { x: 0, z: -5 },
    { x: -5, z: 3 },
    { x: 5, z: 3 }
]

// Respawn: 1.5s delay after kill, random position
```
