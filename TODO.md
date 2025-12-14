# Lost Saga - TODO List

## Priority: High

### 1. Base Level Class
**File:** `core/BaseLevel.js`
**Why:** Avoid duplicating camera follow, damage handling, UI updates in every level

Extract from Level1:
- Camera follow logic
- `takeDamage()` + screen flash
- `updateScore()`
- `levelComplete()`
- Basic control binding

### 2. Camera Controller
**File:** `core/Camera.js`
- `follow(target, offset)` - Smooth follow
- `shake(intensity, duration)` - Damage feedback
- `setMode('follow' | 'fixed' | 'cinematic')`

### 3. Level Progression
**In Game.js:**
- Track current level number
- `nextLevel()` loads next level class
- Save/load progress (localStorage)

---

## Priority: Medium

### 4. More Enemy Types
**Files:** `entities/Skeleton.js`, `entities/Goblin.js`
- Unique appearance
- Different stats (health, speed, damage)
- Unique attack patterns

### 5. Items System
**Folder:** `items/`
- `HealthPotion.js` - Restore health on pickup
- `Coin.js` - Score bonus
- `Chest.js` - Random loot

### 6. More Props
**Folder:** `props/`
- `Barrel.js` - Breakable, may drop items
- `Crate.js` - Stackable obstacle
- `Campfire.js` - Animated flames, light source
- `Well.js` - Decoration
- `Signpost.js` - Decoration

### 7. Level 2 & 3
**Files:** `levels/Level2.js`, `levels/Level3.js`
- Different environments (Dungeon, Graveyard)
- Different enemy mix
- Increasing difficulty

### 8. Particle Effects
**Folder:** `effects/`
- `BloodSplatter.js` - On enemy hit
- `DustCloud.js` - On landing
- `SlashTrail.js` - On attack swing

---

## Priority: Low (Polish)

### 9. Player Death Animation
- Fall animation when health reaches 0
- Delay before game over screen

### 10. Hit Feedback
- Screen shake on damage
- Damage numbers floating up
- Slow motion on kill (optional)

### 11. Pause Menu
- ESC key to pause
- Pause overlay with resume/quit

### 12. Settings Persistence
- Save volume settings to localStorage
- Save graphics quality preference

### 13. Mobile Optimization
- [ ] Test on iOS Safari, Android Chrome
- [ ] Larger touch targets if needed
- [ ] Reduce shadow quality for performance
- [ ] Handle orientation changes
- [ ] Haptic feedback (navigator.vibrate)

---

## Known Bugs

- [ ] Enemies can attack through obstacles
- [ ] Enemies stack on each other (no enemy-enemy collision)

---

## Future Architecture (Scalable)

```
assets/js/
├── core/
│   ├── Game.js
│   ├── UI.js
│   ├── BaseLevel.js          # Shared level logic
│   └── Camera.js             # Camera controller
├── entities/
│   ├── Player.js
│   ├── Enemy.js
│   ├── Skeleton.js
│   ├── Goblin.js
│   └── index.js              # Entity registry
├── environments/
│   ├── grounds/
│   │   ├── GrassyGround.js
│   │   └── StoneGround.js
│   └── walls/
│       ├── StoneWall.js
│       └── WoodenFence.js
├── props/
│   ├── Tree.js, Rock.js, etc.
│   └── index.js
├── items/
│   ├── HealthPotion.js
│   ├── Coin.js
│   └── index.js
├── effects/
│   ├── BloodSplatter.js
│   ├── DustCloud.js
│   └── index.js
├── levels/
│   ├── Level1.js
│   ├── Level2.js
│   └── configs/
│       ├── level1Config.js
│       └── level2Config.js
└── sounds/
```

---

## Performance Ideas

- Reduce shadow map size on mobile
- Instanced meshes for repeated props

---

## Current Level1 Config

```javascript
totalEnemies: 15
arenaBounds: { minX: -24, maxX: 24, minZ: -14, maxZ: 14 }

// Initial spawn positions (5 enemies)
positions: [
    { x: -10, z: 0 },
    { x: 10, z: 0 },
    { x: 0, z: -5 },
    { x: -5, z: 3 },
    { x: 5, z: 3 }
]

// Timed spawning: new zombie every 2.5s until all 15 are on stage
// Zombies rise from ground with spawn animation (1.2s, invulnerable during spawn)
```
