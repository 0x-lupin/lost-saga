// Lost Saga - Entry Point
// Initializes the game with Level 1

import { Game } from './core/Game.js';
import { Level1 } from './levels/Level1.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.loadLevel(Level1);
    game.start();
});
