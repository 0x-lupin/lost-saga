# Lost Saga - Development Guide

## Platform Support
- **Desktop:** Keyboard (WASD) + Mouse click to attack
- **Mobile/Tablet:** Virtual joystick + touch buttons (JUMP, ATK)
- **Fullscreen:** Button in top-right corner (works on both platforms)

Mobile controls are in `index.html` (#mobile-controls) and handled in `controls.js`.
CSS hides mobile controls on desktop via media query in `style.css`.

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
│       │   ├── Game.js        # Game engine (renderer, scene, camera, lights, game loop)
│       │   └── UI.js          # UI manager (health, score, screens, damage flash)
│       ├── entities/
│       │   ├── Player.js      # Player character with sword, animations
│       │   └── Enemy.js       # Zombie enemy with animations
│       ├── levels/
│       │   └── Level1.js      # Training Grounds level
│       └── sounds/
│           ├── SoundManager.js    # Audio system (registry pattern)
│           ├── index.js           # Sound registry (add new sounds here)
│           ├── sfx/               # Sound effects (one file per sound)
│           │   ├── swing.js, hit.js, jump.js, playerHurt.js,
│           │   ├── enemyDeath.js, levelComplete.js, gameOver.js
│           └── music/             # Background music (one file per track)
│               └── bgm.js
```

## How It Works

### Game Flow
1. `main.js` creates `Game` instance
2. `Game` sets up Three.js (renderer, scene, camera, lights)
3. `Game.loadLevel(Level1)` instantiates and initializes Level1
4. `Game.start()` begins the animation loop
5. User clicks "START GAME" → `Game.startGame()` → `isRunning = true`
6. Game loop calls `currentLevel.update(delta)` every frame

### Adding a New Level

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
        // ... your level config
    }
    
    init() { /* create environment, player, enemies, bind controls */ }
    onStart() { /* called when game starts */ }
    update(delta) { /* called every frame */ }
    restart() { /* reset level state */ }
    destroy() { /* cleanup when switching levels */ }
}
```

2. Update `main.js` or `Game.js` to load Level2 after Level1 completes

### Adding a New Enemy Type

1. Create `entities/Skeleton.js` (copy Enemy.js as template)
2. Modify `create()` method for different appearance
3. Adjust stats: `health`, `speed`, `attackDamage`
4. Import in your level: `import { Skeleton } from '../entities/Skeleton.js'`

### Adding New Player Abilities

In `Player.js`:
```javascript
// Add new method
specialAttack(callback) {
    if (this.isAttacking) return false;
    // animation logic
    // call callback() when hit should register
}
```

In level's `bindControls()`:
```javascript
this.controls.onSpecial = () => {
    this.player.specialAttack(() => this.handleSpecialAttack());
};
```

## Key Classes Reference

### Game.js
- `ui` - UI manager instance (access via `this.game.ui` in levels)
- `loadLevel(LevelClass)` - Load a level class
- `startGame()` - Hide start screen, begin game
- `restartGame()` - Restart current level
- `gameOver(score)` - Show game over screen
- `levelComplete(score)` - Show level complete screen
- `nextLevel()` - Called when "NEXT" button clicked

### SoundManager.js (access via `game.sound`)
Procedural audio using Web Audio API - no audio files needed!

- `play(name)` - Play registered SFX
- `playVaried(name, variation)` - Play with random pitch variation
- `playMusic(name)` - Play registered background music
- `stopMusic()` / `fadeOutMusic(duration)` - Stop/fade music
- `setMusicVolume(0-1)` / `setSfxVolume(0-1)` - Volume controls
- `toggleMute()` - Toggle all audio
- `registerSfx(name, fn)` / `registerMusic(name, module)` - Register new sounds

### Adding New Sounds (Scalable Pattern)

1. Create SFX file `sounds/sfx/mySound.js`:
```javascript
export default function mySound(ctx, output, pitch = 1) {
    // Web Audio API code here
}
```

2. Create music file `sounds/music/myMusic.js`:
```javascript
function play(ctx, output) { /* return state */ }
function stop(state) { /* cleanup */ }
export default { play, stop };
```

3. Register in `sounds/index.js`:
```javascript
import mySound from './sfx/mySound.js';
import myMusic from './music/myMusic.js';
// In registerAllSounds():
sound.registerSfx('mySound', mySound);
sound.registerMusic('myMusic', myMusic);
```

### UI.js (access via `game.ui`)
- `updateHealth(health, maxHealth)` - Update health bar with color coding
- `updateScore(score)` - Update score display
- `showStartScreen()` / `hideStartScreen()` - Start screen
- `showGameOver(score)` / `hideGameOver()` - Game over screen
- `showLevelComplete(score)` / `hideLevelComplete()` - Level complete screen
- `showDamageFlash()` - Red screen flash on damage
- `reset()` - Reset health bar and score to defaults

### Player.js
- `update(delta, moveInput, platforms, arenaBounds)` - Movement, physics, animation
- `jump()` - Jump if grounded
- `attack(callback)` - Swing sword, callback for hit detection
- `takeDamage(amount)` - Returns true if dead
- `reset()` - Reset position, health, state
- `getPosition()` - Returns mesh.position
- `getAttackRange()` - Returns attack range (2.5)

### Enemy.js
- `update(delta, playerPosition, arenaBounds)` - AI movement, returns distance to player
- `canAttack()` - Returns true if can attack
- `attack()` - Attack animation, returns damage amount
- `takeDamage(amount, knockbackDir)` - Returns true if dead
- `die(callback)` - Play death animation, then call callback
- `getPosition()` - Returns mesh.position

### Level (interface)
Required methods for any level:
- `constructor(game)` - Store game reference
- `init()` - Setup level
- `onStart()` - Called when game starts
- `update(delta)` - Called every frame
- `restart()` - Reset level
- `destroy()` - Cleanup

## UI Elements (in index.html)

| ID | Purpose |
|----|---------|
| `game-canvas` | Three.js canvas |
| `health-fill` | Health bar fill element |
| `health-text` | Health number display |
| `score-value` | Score number display |
| `start-screen` | Start screen overlay |
| `game-over-screen` | Game over overlay |
| `level-complete-screen` | Level complete overlay |
| `final-score` | Score on game over |
| `level-score` | Score on level complete |
| `start-btn` | Start button |
| `restart-btn` | Restart button |
| `next-btn` | Next level button |
| `fullscreen-btn` | Fullscreen toggle |
| `joystick-base/stick` | Mobile joystick |
| `btn-jump` | Mobile jump button |
| `btn-attack` | Mobile attack button |

## Controls

| Input | Action |
|-------|--------|
| WASD / Arrow Keys | Move |
| Space | Jump |
| Mouse Click | Attack |
| Mobile Joystick | Move |
| JUMP button | Jump |
| ATK button | Attack |
