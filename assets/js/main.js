// Lost Saga - Entry Point
// Initializes the game with Main Menu

import { Game } from './core/Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});
