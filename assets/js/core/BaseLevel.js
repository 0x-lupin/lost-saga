// BaseLevel - Lost Saga
// Base class for all game levels
// Extracts shared logic from Level1 and Survival1

import { Player } from '../entities/Player.js';

export class BaseLevel {
    constructor(game, config = {}) {
        // Core references
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.controls = game.controls;
        
        // Entity collections
        this.player = null;
        this.enemies = [];
        this.platforms = [];
        this.obstacles = [];
        
        // State
        this.score = 0;
        this.killCount = 0;
        
        // Level configuration with defaults
        this.config = {
            arenaBounds: { minX: -24, maxX: 24, minZ: -14, maxZ: 14 },
            cameraOffset: { x: 0, y: 10, z: 12 },
            cameraHeightFactor: 0.5,
            scoreMultiplier: 1,
            shadowBounds: null, // null = use default
            ...config
        };
        
        this.arenaBounds = this.config.arenaBounds;
    }
    
    // === LIFECYCLE METHODS ===
    
    init() {
        // Set up shadow bounds if specified
        if (this.config.shadowBounds) {
            const sb = this.config.shadowBounds;
            this.game.setShadowBounds(sb.left, sb.right, sb.top, sb.bottom);
        }
        
        this.game.ui.reset();
        this.createEnvironment();
        this.createPlayer();
        this.spawnInitialEnemies();
        this.bindControls();
    }
    
    /**
     * Create level environment (ground, walls, props)
     * Must be overridden by subclass
     */
    createEnvironment() {
        throw new Error('Subclass must implement createEnvironment()');
    }
    
    /**
     * Spawn initial enemies
     * Must be overridden by subclass
     */
    spawnInitialEnemies() {
        throw new Error('Subclass must implement spawnInitialEnemies()');
    }
    
    /**
     * Called when level starts (after init)
     * Can be overridden for level-specific start logic
     */
    onStart() {
        this.game.sound.playMusic('bgm');
    }
    
    // === SHARED IMPLEMENTATIONS ===
    
    createPlayer() {
        this.player = new Player(this.scene);
    }
    
    bindControls() {
        this.controls.onJump = () => {
            if (this.game.isRunning && this.player.jump()) {
                this.game.sound.playVaried('jump', 0.15);
            }
        };
        
        this.controls.onAttack = () => {
            if (!this.game.isRunning) return;
            const didAttack = this.player.attack(() => this.handleAttack());
            if (didAttack) {
                this.game.sound.playVaried('swing', 0.1);
            }
        };
        
        this.controls.onDash = () => {
            if (this.game.isRunning) {
                const moveInput = this.controls.getMoveInput();
                if (this.player.dash(moveInput)) {
                    this.game.sound.playVaried('jump', 0.2);
                }
            }
        };
    }
    
    handleAttack() {
        const playerPos = this.player.getPosition();
        const attackRange = this.player.getAttackRange();
        const playerRotation = this.player.mesh.rotation.y;
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const enemyPos = enemy.getPosition();
            const distance = playerPos.distanceTo(enemyPos);
            
            if (distance < attackRange) {
                const toEnemy = new THREE.Vector3().subVectors(enemyPos, playerPos);
                const angleToEnemy = Math.atan2(toEnemy.x, toEnemy.z);
                
                let angleDiff = angleToEnemy - playerRotation;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                
                // 60 degrees each side = 120 degree arc
                const attackArc = Math.PI / 3;
                if (Math.abs(angleDiff) < attackArc) {
                    const knockDir = new THREE.Vector3()
                        .subVectors(enemyPos, playerPos).normalize();
                    const isDead = enemy.takeDamage(this.player.attackDamage, knockDir);
                    this.game.sound.playVaried('hit', 0.1);
                    
                    if (isDead) {
                        this.onEnemyKilled(enemy, i);
                    }
                }
            }
        }
    }
    
    /**
     * Called when an enemy is killed
     * Can be overridden for level-specific logic
     */
    onEnemyKilled(enemy, index) {
        this.enemies.splice(index, 1);
        this.score += 100 * this.config.scoreMultiplier;
        this.killCount++;
        this.updateScore();
        this.game.sound.playVaried('enemyDeath', 0.15);
        enemy.die(() => this.checkLevelComplete());
    }
    
    /**
     * Check if level is complete
     * Override in subclass for win conditions
     */
    checkLevelComplete() {
        // Override in subclass if needed
    }
    
    // === UPDATE LOOP ===
    
    update(delta) {
        // Update player
        const moveInput = this.controls.getMoveInput();
        const fell = this.player.update(
            delta, moveInput, this.platforms, 
            this.arenaBounds, this.obstacles, this.enemies
        );
        
        // Update dash UI
        this.game.ui.updateDashCooldown(
            this.player.dashCooldownTimer, 
            this.player.dashCooldown
        );
        
        if (fell) {
            this.takeDamage(100);
        }
        
        // Camera follow
        this.updateCamera();
        
        // Update enemies
        this.updateEnemies(delta);
        
        // Level-specific update logic
        this.updateLevel(delta);
    }
    
    /**
     * Level-specific update logic
     * Override for spawning, difficulty scaling, etc.
     */
    updateLevel(delta) {
        // Override in subclass
    }
    
    updateCamera() {
        const playerPos = this.player.getPosition();
        const offset = this.config.cameraOffset;
        
        this.camera.position.x = playerPos.x + offset.x;
        this.camera.position.y = offset.y + playerPos.y * this.config.cameraHeightFactor;
        this.camera.position.z = playerPos.z + offset.z;
        this.camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);
    }
    
    updateEnemies(delta) {
        const playerPos = this.player.getPosition();
        
        this.enemies.forEach(enemy => {
            if (enemy.isDying) return;
            
            enemy.update(
                delta, playerPos, this.arenaBounds, 
                this.obstacles, this.enemies,
                this.player.collisionRadius, this.player.mass
            );
            
            if (enemy.canAttack()) {
                enemy.attack((damage) => {
                    const currentPlayerPos = this.player.getPosition();
                    const currentEnemyPos = enemy.getPosition();
                    const currentDistance = currentPlayerPos.distanceTo(currentEnemyPos);
                    
                    if (currentDistance < enemy.lungeRange + enemy.playerRadius) {
                        const knockbackDir = new THREE.Vector3()
                            .subVectors(currentPlayerPos, currentEnemyPos)
                            .normalize();
                        this.takeDamage(damage, knockbackDir);
                    }
                });
            }
        });
    }
    
    // === DAMAGE & SCORE ===
    
    takeDamage(amount, knockbackDir = null) {
        const isDead = this.player.takeDamage(amount, knockbackDir);
        this.game.ui.updateHealth(this.player.health, this.player.maxHealth);
        this.game.ui.showDamageFlash();
        this.game.sound.playVaried('playerHurt', 0.1);
        
        // Camera shake on damage
        if (this.game.cameraController) {
            this.game.cameraController.shake(0.3, 0.2);
        }
        
        if (isDead) {
            this.game.gameOver(this.score);
        }
    }
    
    updateScore() {
        this.game.ui.updateScore(this.score);
    }
    
    // === RESTART & CLEANUP ===
    
    restart() {
        this.player.reset();
        this.score = 0;
        this.killCount = 0;
        this.game.ui.reset();
        
        this.enemies.forEach(e => e.destroy());
        this.enemies = [];
        this.spawnInitialEnemies();
        
        this.game.sound.playMusic('bgm');
    }
    
    destroy() {
        // Cleanup control bindings
        this.controls.onJump = null;
        this.controls.onAttack = null;
        this.controls.onDash = null;
        
        // Cleanup enemies
        this.enemies.forEach(e => e.destroy());
        this.enemies = [];
        
        // Cleanup player
        if (this.player) {
            this.scene.remove(this.player.mesh);
            this.player = null;
        }
        
        // Cleanup references (scene objects removed by clearScene in Game.js)
        this.platforms = [];
        this.obstacles = [];
    }
}
