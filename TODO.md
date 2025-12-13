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
**Files:** `entities/Skeleton.js`, `entities/Ghost.js`
- Unique appearance
- Different stats (health, speed, damage)
- Unique attack patterns

### 5. Level 2 & 3
**Files:** `levels/Level2.js`, `levels/Level3.js`
- Different environments (Dungeon, Graveyard)
- Different enemy mix
- Increasing difficulty

### 6. Particle Effects
**File:** `core/Particles.js`
- Blood splatter on hit
- Dust on landing
- Slash trail on attack

### 7. Reusable Decorations (Optional)
**Folder:** `environments/decorations/`

If sharing decorations across levels:
```javascript
// environments/decorations/Tree.js
export function createTree(scene, x, z) {
    // ... create mesh ...
    scene.add(tree);
    return { x, z, radius: 0.6 }; // collision data
}

// In any level:
this.obstacles.push(createTree(this.scene, -18, -10));
```

---

## Priority: Low (Polish)

### 8. Player Death Animation
- Fall animation when health reaches 0
- Delay before game over screen

### 9. Enemy Spawn Animation
- Rise from ground effect
- Brief invulnerability

### 10. Hit Feedback
- Screen shake on damage
- Damage numbers floating up
- Slow motion on kill (optional)

### 11. Pause Menu
- ESC key to pause
- Pause overlay with resume/quit

### 12. Settings Menu
- Volume controls
- Graphics quality
- Control rebinding

### 13. Mobile Optimization
- [ ] Test on iOS Safari, Android Chrome
- [ ] Larger touch targets if needed
- [ ] Reduce shadow quality for performance
- [ ] Handle orientation changes
- [ ] Haptic feedback (navigator.vibrate)

---

## Known Bugs

- [ ] Sword orientation looks off from certain angles
- [ ] Enemies can attack through obstacles
- [ ] Enemies stack on each other (no enemy-enemy collision)

---

## Performance Ideas

- Object pooling for enemies (reuse instead of create/destroy)
- LOD for distant objects
- Reduce shadow map size on mobile
- Batch grass into single geometry

---

## Current Level1 Config

```javascript
totalEnemies: 10
arenaBounds: { minX: -24, maxX: 24, minZ: -14, maxZ: 14 }

// Initial spawn positions (5 enemies)
positions: [
    { x: -10, z: 0 },
    { x: 10, z: 0 },
    { x: 0, z: -5 },
    { x: -5, z: 3 },
    { x: 5, z: 3 }
]

// Respawn: 1.5s delay after kill, random position within bounds
```
