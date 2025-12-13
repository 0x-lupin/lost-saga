# Lost Saga - Development Guide

A comprehensive guide for developers (human or AI) to understand and extend this game.

## Table of Contents
- [Development Principles](#development-principles)
- [Platform Support](#platform-support)
- [Project Structure](#project-structure)
- [Game Flow](#game-flow)
- [Key Classes Reference](#key-classes-reference)
- [How To: Add New Content](#how-to-add-new-content)
- [Collision System](#collision-system)
- [UI Elements](#ui-elements)
- [Controls](#controls)

---

## Development Principles

### NO Band-Aid Solutions
- Every fix must address the root cause, not just the symptoms
- Avoid magic numbers and hardcoded offsets that "just work"
- If a workaround is needed temporarily, document it in TODO.md as CRITICAL priority
- Code should be self-explanatory; if you need a comment like "offset to compensate for X", fix X instead

### Scalable Architecture
- All systems must be designed for extension (new levels, enemies, sounds, etc.)
- Use registry patterns (like SoundManager) for pluggable components
- Avoid tight coupling between classes
- Configuration should be data-driven where possible (enemy stats, level configs)

### Cross-Platform First (Mobile + PC)
- **Every feature must work on both mobile and desktop**
- Test touch controls alongside keyboard/mouse
- UI elements must be responsive (use CSS media queries)
- Touch targets must be large enough (minimum 44x44px)
- Consider performance on mobile devices (reduce shadows, simplify geometry if needed)
- Use `pointer` events when possible for unified input handling
- Always test: iOS Safari, Android Chrome, Desktop Chrome/Firefox

### Code Quality
- Keep functions small and focused
- Use meaningful variable names
- Group related code together
- Clean up resources in `destroy()` methods

### Acceptable Patterns (NOT Band-Aids)
The following are intentional design choices, not workarounds:

- **setTimeout for animations**: Used for attack swings, damage flashes, respawn delays. This is standard practice for simple timed events - the browser handles timing reliably, and it keeps code simple and readable.
- **Hardcoded values in classes**: Stats like `health`, `speed`, `attackDamage` are defined at the top of each class. This is appropriate for a game this size.
- **requestAnimationFrame in death animations**: Enemy death uses its own animation loop - this is fine for one-off effects.

**What IS a band-aid**: Adding offsets/hacks to compensate for a bug elsewhere (e.g., adding `-1` to all model positions because collision math was wrong). If you find yourself writing "offset to fix X", fix X instead.

---

## Platform Support

| Platform | Controls |
|----------|----------|
| Desktop | WASD + Mouse click to attack |
| Mobile/Tablet | Virtual joystick + JUMP/ATK buttons |
| Fullscreen | Button in top-right corner |

Mobile controls: `index.html` (#mobile-controls) + `controls.js`
CSS hides mobile controls on desktop via `@media` query in `style.css`

---

## Project Structure

```
lost-saga/
├── index.html                 # Main HTML with UI elements
├── assets/
│   ├── css/
│   │   └── style.css          # All styles (UI, screens, mobile controls)
│   └── js/
│       ├── main.js            # Entry point - loads Game and Level1
│       ├── controls.js        # Keyboard + mobile joystick/buttons
│       ├── core/
│       │   ├── Game.js        # Game engine (renderer, scene, camera, game loop)
│       │   └── UI.js          # UI manager (health, score, screens)
│       ├── entities/
│       │   ├── Player.js      # Player character with sword, animations
│       │   └── Enemy.js       # Zombie enemy with AI, animations
│       ├── levels/
│       │   └── Level1.js      # Training Grounds (environment + game logic)
│       └── sounds/
│           ├── SoundManager.js    # Audio system (registry pattern)
│           ├── index.js           # Sound registry - ADD NEW SOUNDS HERE
│           ├── sfx/               # One file per sound effect
│           └── music/             # One file per music track
```

---

## Game Flow

```
1. main.js creates Game instance
2. Game sets up Three.js (renderer, scene, camera, lights)
3. Game.loadLevel(Level1) → Level1.init()
4. Game.start() → animation loop begins
5. User clicks "START GAME" → Game.startGame() → isRunning = true
6. Every frame: Level1.update(delta) is called
7. Kill all enemies → Level1.levelComplete() → Game.levelComplete(score)
```

---

## Key Classes Reference

### Game.js
Core engine. Access in levels via `this.game`.

| Property/Method | Description |
|-----------------|-------------|
| `scene` | Three.js scene |
| `camera` | Three.js camera |
| `ui` | UI manager instance |
| `sound` | SoundManager instance |
| `isRunning` | Game state flag |
| `loadLevel(LevelClass)` | Load a level |
| `startGame()` | Start the game |
| `restartGame()` | Restart current level |
| `gameOver(score)` | Show game over screen |
| `levelComplete(score)` | Show level complete screen |

### Level (interface)
Every level must implement:

```javascript
constructor(game)     // Store game reference, init config
init()                // Create environment, player, enemies, bind controls
onStart()             // Called when game starts (play music, etc.)
update(delta)         // Called every frame
restart()             // Reset level state
destroy()             // Cleanup when switching levels
```

### Player.js
| Method | Description |
|--------|-------------|
| `update(delta, moveInput, platforms, arenaBounds, obstacles)` | Movement, physics, collision |
| `jump()` | Jump if grounded, returns success |
| `attack(callback)` | Swing sword, callback for hit detection |
| `takeDamage(amount)` | Returns true if dead |
| `reset()` | Reset position, health, state |
| `getPosition()` | Returns mesh.position |
| `getAttackRange()` | Returns attack range (3.5) |

### Enemy.js
| Method | Description |
|--------|-------------|
| `update(delta, playerPos, arenaBounds)` | AI movement, returns distance |
| `canAttack()` | Returns true if can attack |
| `attack()` | Attack animation, returns damage |
| `takeDamage(amount, knockbackDir)` | Returns true if dead |
| `die(callback)` | Death animation, then callback |

### UI.js (access via `game.ui`)
| Method | Description |
|--------|-------------|
| `updateHealth(health, maxHealth)` | Update health bar |
| `updateScore(score)` | Update score display |
| `showDamageFlash()` | Red screen flash |
| `showGameOver(score)` | Show game over |
| `showLevelComplete(score)` | Show level complete |
| `reset()` | Reset to defaults |

### SoundManager.js (access via `game.sound`)
| Method | Description |
|--------|-------------|
| `play(name)` | Play SFX |
| `playVaried(name, variation)` | Play with pitch variation |
| `playMusic(name)` | Play background music |
| `stopMusic()` | Stop music |
| `fadeOutMusic(duration)` | Fade out music |
| `setMusicVolume(0-1)` | Set music volume |
| `setSfxVolume(0-1)` | Set SFX volume |
| `toggleMute()` | Toggle mute |

---

## How To: Add New Content

### Add a New Level

1. Create `levels/Level2.js`:
```javascript
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';

export class Level2 {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.controls = game.controls;
        
        this.player = null;
        this.enemies = [];
        this.platforms = [];
        this.obstacles = [];  // For collision
        this.score = 0;
        
        // Level config
        this.totalEnemies = 15;
        this.arenaBounds = { minX: -20, maxX: 20, minZ: -12, maxZ: 12 };
    }
    
    init() {
        this.createEnvironment();
        this.createPlayer();
        this.spawnEnemies();
        this.bindControls();
    }
    
    createEnvironment() {
        // Your unique environment here
    }
    
    // ... implement other required methods
}
```

2. Update `Game.js` `nextLevel()` to load Level2

### Add a New Enemy Type

1. Create `entities/Skeleton.js` (copy Enemy.js as template)
2. Modify `create()` for different appearance
3. Adjust stats: `health`, `speed`, `attackDamage`
4. Import in level: `import { Skeleton } from '../entities/Skeleton.js'`

### Add a New Sound Effect

1. Create `sounds/sfx/mySound.js`:
```javascript
export default function mySound(ctx, output, pitch = 1) {
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 440 * pitch;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.connect(gain);
    gain.connect(output);
    osc.start(now);
    osc.stop(now + 0.2);
}
```

2. Register in `sounds/index.js`:
```javascript
import mySound from './sfx/mySound.js';
// In registerAllSounds():
sound.registerSfx('mySound', mySound);
```

3. Use anywhere: `this.game.sound.play('mySound')`

### Add New Background Music

1. Create `sounds/music/dungeonBgm.js`:
```javascript
function play(ctx, output) {
    // Your music loop logic
    // Return state object for stop()
    return { timeout: null, stopped: false };
}

function stop(state) {
    state.stopped = true;
    if (state.timeout) clearTimeout(state.timeout);
}

export default { play, stop };
```

2. Register in `sounds/index.js`:
```javascript
import dungeonBgm from './music/dungeonBgm.js';
sound.registerMusic('dungeonBgm', dungeonBgm);
```

3. Use in level: `this.game.sound.playMusic('dungeonBgm')`

---

## Collision System

### Platforms (for standing on)
```javascript
this.platforms.push({
    mesh: groundMesh,
    bounds: { minX: -25, maxX: 25, minZ: -15, maxZ: 15, y: 0 }
});
```

### Obstacles (circular, blocks movement)
```javascript
// In createTree(), createTorch(), etc:
this.obstacles.push({ x, z, radius: 0.6 });
```

Player.js automatically handles obstacle collision - pushes player out if too close.

### Arena Bounds (invisible walls)
```javascript
this.arenaBounds = { minX: -24, maxX: 24, minZ: -14, maxZ: 14 };
```

### Adding Collision to Decorations

When creating a decoration that should block movement:
```javascript
createTree(x, z) {
    // ... create mesh ...
    this.scene.add(tree);
    
    // Add collision
    this.obstacles.push({ x, z, radius: 0.6 });
}
```

Decorations without collision (grass, small rocks) just don't push to obstacles.

---

## UI Elements (in index.html)

| ID | Purpose |
|----|---------|
| `game-canvas` | Three.js canvas |
| `health-fill` | Health bar fill |
| `health-text` | Health number |
| `score-value` | Score number |
| `start-screen` | Start overlay |
| `game-over-screen` | Game over overlay |
| `level-complete-screen` | Level complete overlay |
| `start-btn` / `restart-btn` / `next-btn` | Buttons |
| `fullscreen-btn` | Fullscreen toggle |
| `joystick-base/stick` | Mobile joystick |
| `btn-jump` / `btn-attack` | Mobile buttons |

---

## Controls

| Input | Action |
|-------|--------|
| WASD / Arrow Keys | Move |
| Space | Jump |
| Mouse Click | Attack |
| Mobile Joystick | Move |
| JUMP button | Jump |
| ATK button | Attack |

---

## Quick Tips

- **Testing sounds:** `game.sound.play('swing')` in browser console
- **Adjusting difficulty:** Change `totalEnemies`, enemy `speed`, `attackDamage`
- **Debug collision:** Add `console.log(this.obstacles)` in level init
- **Performance:** Reduce shadow quality in Game.js for mobile
