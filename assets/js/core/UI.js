// UI Manager - Lost Saga
// Centralized UI updates and screen management

export class UI {
    constructor() {
        // Cache DOM elements
        this.elements = {
            healthFill: document.getElementById('health-fill'),
            healthText: document.getElementById('health-text'),
            scoreValue: document.getElementById('score-value'),
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            levelCompleteScreen: document.getElementById('level-complete-screen'),
            finalScore: document.getElementById('final-score'),
            levelScore: document.getElementById('level-score')
        };
    }

    updateHealth(health, maxHealth = 100) {
        const percent = (health / maxHealth) * 100;
        this.elements.healthFill.style.width = `${percent}%`;
        this.elements.healthText.textContent = Math.round(health);

        // Color based on health
        if (percent > 60) {
            this.elements.healthFill.style.background = 'linear-gradient(to bottom, #4ade80, #22c55e)';
        } else if (percent > 30) {
            this.elements.healthFill.style.background = 'linear-gradient(to bottom, #fbbf24, #f59e0b)';
        } else {
            this.elements.healthFill.style.background = 'linear-gradient(to bottom, #f87171, #dc2626)';
        }
    }

    updateScore(score) {
        this.elements.scoreValue.textContent = score;
    }

    showStartScreen() {
        this.elements.startScreen.classList.remove('hidden');
    }

    hideStartScreen() {
        this.elements.startScreen.classList.add('hidden');
    }

    showGameOver(score) {
        this.elements.finalScore.textContent = score;
        this.elements.gameOverScreen.classList.remove('hidden');
    }

    hideGameOver() {
        this.elements.gameOverScreen.classList.add('hidden');
    }

    showLevelComplete(score) {
        this.elements.levelScore.textContent = score;
        this.elements.levelCompleteScreen.classList.remove('hidden');
    }

    hideLevelComplete() {
        this.elements.levelCompleteScreen.classList.add('hidden');
    }

    showDamageFlash() {
        document.body.style.backgroundColor = '#ff0000';
        setTimeout(() => {
            document.body.style.backgroundColor = '#000';
        }, 100);
    }

    reset() {
        this.updateHealth(100);
        this.updateScore(0);
        this.updateDashCooldown(0, 1);
    }

    updateDashCooldown(remaining, total) {
        // 1. Mobile Button Overlay (Darkens button)
        // Shows how much cooldown is LEFT (Full overlay = Full cooldown)
        const overlay = document.querySelector('#btn-dash .cooldown-overlay');
        if (overlay) {
            if (remaining <= 0) {
                overlay.style.height = '0%';
            } else {
                const percent = (remaining / total) * 100;
                overlay.style.height = `${percent}%`;
            }
        }

        // 2. PC Dash Bar (Energy Bar)
        // Shows how much is READY (Full bar = Ready)
        const dashFill = document.getElementById('dash-fill');
        if (dashFill) {
            if (remaining <= 0) {
                dashFill.style.width = '100%';
                dashFill.style.background = '#f97316'; // Ready color
            } else {
                const readyPercent = Math.max(0, 1 - (remaining / total)) * 100;
                dashFill.style.width = `${readyPercent}%`;
                dashFill.style.background = '#7c2d12'; // Recharging color
            }
        }
    }
}
