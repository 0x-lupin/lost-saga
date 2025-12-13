// Sound Registry - Lost Saga
// Import this file to register all sounds with SoundManager

// SFX
import swing from './sfx/swing.js';
import hit from './sfx/hit.js';
import jump from './sfx/jump.js';
import playerHurt from './sfx/playerHurt.js';
import enemyDeath from './sfx/enemyDeath.js';
import levelComplete from './sfx/levelComplete.js';
import gameOver from './sfx/gameOver.js';

// Music
import bgm from './music/bgm.js';

/**
 * Register all sounds with a SoundManager instance
 * @param {SoundManager} sound - The sound manager to register with
 */
export function registerAllSounds(sound) {
    // SFX
    sound.registerSfx('swing', swing);
    sound.registerSfx('hit', hit);
    sound.registerSfx('jump', jump);
    sound.registerSfx('playerHurt', playerHurt);
    sound.registerSfx('enemyDeath', enemyDeath);
    sound.registerSfx('levelComplete', levelComplete);
    sound.registerSfx('gameOver', gameOver);
    
    // Music
    sound.registerMusic('bgm', bgm);
}
