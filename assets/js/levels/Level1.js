// Level 1 - Training Grounds

import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';

export class Level1 {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.controls = game.controls;
        
        this.player = null;
        this.enemies = [];
        this.platforms = [];
        this.score = 0;
        
        // Level config
        this.totalEnemies = 10;
        this.spawnedCount = 0;
        this.killCount = 0;
        this.arenaBounds = { minX: -18, maxX: 18, minZ: -8, maxZ: 8 };
    }
    
    init() {
        this.createEnvironment();
        this.createPlayer();
        this.spawnEnemies();
        this.bindControls();
    }
    
    createEnvironment() {
        // Ground
        const groundGeo = new THREE.BoxGeometry(40, 1, 20);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.8 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.platforms.push({ mesh: ground, bounds: { minX: -20, maxX: 20, minZ: -10, maxZ: 10, y: 0 }});
        
        // Floating platforms
        const platformData = [
            { x: -12, y: 3, z: 0, w: 6, h: 0.5, d: 4 },
            { x: 12, y: 3, z: 0, w: 6, h: 0.5, d: 4 },
            { x: 0, y: 5, z: -5, w: 8, h: 0.5, d: 4 },
            { x: -8, y: 7, z: 3, w: 5, h: 0.5, d: 3 },
            { x: 8, y: 7, z: 3, w: 5, h: 0.5, d: 3 },
        ];
        
        platformData.forEach(p => {
            const geo = new THREE.BoxGeometry(p.w, p.h, p.d);
            const mat = new THREE.MeshStandardMaterial({ color: 0x5c7a99, roughness: 0.6 });
            const platform = new THREE.Mesh(geo, mat);
            platform.position.set(p.x, p.y, p.z);
            platform.castShadow = true;
            platform.receiveShadow = true;
            this.scene.add(platform);
            this.platforms.push({
                mesh: platform,
                bounds: { minX: p.x - p.w/2, maxX: p.x + p.w/2, minZ: p.z - p.d/2, maxZ: p.z + p.d/2, y: p.y + p.h/2 }
            });
        });
        
        // Pillars
        for (let i = 0; i < 6; i++) {
            const pillarGeo = new THREE.CylinderGeometry(0.5, 0.6, 4, 8);
            const pillarMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5 });
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.set((i % 2 === 0 ? -15 : 15), 2, -8 + (Math.floor(i / 2) * 8));
            pillar.castShadow = true;
            this.scene.add(pillar);
        }
    }
    
    createPlayer() {
        this.player = new Player(this.scene);
    }
    
    spawnEnemies() {
        const positions = [
            { x: -10, z: 0 },
            { x: 10, z: 0 },
            { x: 0, z: -5 },
            { x: -5, z: 3 },
            { x: 5, z: 3 }
        ];
        positions.forEach((pos, i) => {
            if (this.spawnedCount < this.totalEnemies) {
                this.enemies.push(new Enemy(this.scene, pos.x, pos.z, i));
                this.spawnedCount++;
            }
        });
    }
    
    spawnEnemy() {
        if (this.spawnedCount >= this.totalEnemies) return;
        const x = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 14;
        this.enemies.push(new Enemy(this.scene, x, z, Date.now()));
        this.spawnedCount++;
    }
    
    bindControls() {
        this.controls.onJump = () => {
            if (this.game.isRunning && this.player.jump()) {
                this.game.sound.playVaried('jump', 0.15);
            }
        };
        this.controls.onAttack = () => {
            if (!this.game.isRunning) return;
            this.game.sound.playVaried('swing', 0.1);
            this.player.attack(() => this.handleAttack());
        };
    }
    
    handleAttack() {
        const playerPos = this.player.getPosition();
        const attackRange = this.player.getAttackRange();
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const distance = playerPos.distanceTo(enemy.getPosition());
            
            if (distance < attackRange) {
                const knockDir = new THREE.Vector3().subVectors(enemy.getPosition(), playerPos).normalize();
                const isDead = enemy.takeDamage(this.player.attackDamage, knockDir);
                this.game.sound.playVaried('hit', 0.1);
                
                if (isDead) {
                    this.enemies.splice(i, 1);
                    this.score += 100;
                    this.killCount++;
                    this.updateScore();
                    this.game.sound.playVaried('enemyDeath', 0.15);
                    
                    // Play death animation then check level complete
                    enemy.die(() => {
                        if (this.killCount >= this.totalEnemies) {
                            this.levelComplete();
                        } else if (this.spawnedCount < this.totalEnemies) {
                            setTimeout(() => {
                                if (this.game.isRunning) this.spawnEnemy();
                            }, 1500);
                        }
                    });
                }
            }
        }
    }
    
    onStart() {
        // Start procedural background music
        this.game.sound.playMusic('bgm');
    }
    
    update(delta) {
        // Update player
        const moveInput = this.controls.getMoveInput();
        const fell = this.player.update(delta, moveInput, this.platforms, this.arenaBounds);
        
        if (fell) {
            this.takeDamage(100);
        }
        
        // Camera follow
        const playerPos = this.player.getPosition();
        this.camera.position.x = playerPos.x;
        this.camera.position.y = 10 + playerPos.y * 0.5;
        this.camera.position.z = playerPos.z + 12;
        this.camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);
        
        // Update enemies
        this.enemies.forEach(enemy => {
            if (enemy.isDying) return;
            const distance = enemy.update(delta, playerPos, this.arenaBounds);
            if (distance < 1.8 && enemy.canAttack()) {
                this.takeDamage(enemy.attack());
            }
        });
    }
    
    takeDamage(amount) {
        const isDead = this.player.takeDamage(amount);
        this.game.ui.updateHealth(this.player.health, this.player.maxHealth);
        this.game.ui.showDamageFlash();
        this.game.sound.playVaried('playerHurt', 0.1);
        
        if (isDead) {
            this.game.gameOver(this.score);
        }
    }
    
    updateScore() {
        this.game.ui.updateScore(this.score);
    }
    
    levelComplete() {
        this.game.isRunning = false;
        this.game.levelComplete(this.score);
    }
    
    restart() {
        this.player.reset();
        this.score = 0;
        this.killCount = 0;
        this.spawnedCount = 0;
        this.game.ui.reset();
        
        this.enemies.forEach(e => e.destroy());
        this.enemies = [];
        this.spawnEnemies();
        
        // Restart music
        this.game.sound.playMusic('bgm');
    }
    
    destroy() {
        // Cleanup when switching levels
        this.enemies.forEach(e => e.destroy());
        if (this.player) this.scene.remove(this.player.mesh);
        this.platforms.forEach(p => this.scene.remove(p.mesh));
    }
}
