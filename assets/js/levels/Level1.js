// Level 1 - Training Grounds

import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { createTree, createRock, createTorch, createDummy, createGrass } from '../props/index.js';

export class Level1 {
    constructor(game) {
        // References
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.controls = game.controls;
        
        // Entities
        this.player = null;
        this.enemies = [];
        this.platforms = [];
        this.obstacles = [];
        
        // Level config
        this.score = 0;
        this.totalEnemies = 15;
        this.spawnedCount = 0;
        this.killCount = 0;
        this.arenaBounds = { minX: -24, maxX: 24, minZ: -14, maxZ: 14 };
        
        // Spawn timer
        this.spawnInterval = 2.5; // seconds between spawns
        this.spawnTimer = 0;
    }
    
    init() {
        this.createEnvironment();
        this.createPlayer();
        this.spawnEnemies();
        this.bindControls();
    }
    
    createEnvironment() {
        // === GROUND - Grassy terrain ===
        const groundGeo = new THREE.BoxGeometry(50, 1, 30);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: 0x3d6b3d, 
            roughness: 0.9 
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.platforms.push({ mesh: ground, bounds: { minX: -25, maxX: 25, minZ: -15, maxZ: 15, y: 0 }});
        
        // Dirt path (center)
        const pathGeo = new THREE.BoxGeometry(8, 0.05, 30);
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 1 });
        const path = new THREE.Mesh(pathGeo, pathMat);
        path.position.y = 0.03;
        path.receiveShadow = true;
        this.scene.add(path);
        
        // === STONE WALLS (arena boundary) ===
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x5a5a5a, roughness: 0.8 });
        
        // Back wall
        const backWallGeo = new THREE.BoxGeometry(52, 4, 1);
        const backWall = new THREE.Mesh(backWallGeo, wallMat);
        backWall.position.set(0, 2, -15);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        this.scene.add(backWall);
        
        // Side walls
        const sideWallGeo = new THREE.BoxGeometry(1, 3, 30);
        const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
        leftWall.position.set(-25, 1.5, 0);
        leftWall.castShadow = true;
        this.scene.add(leftWall);
        
        const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
        rightWall.position.set(25, 1.5, 0);
        rightWall.castShadow = true;
        this.scene.add(rightWall);
        
        // === TREES (scattered around arena) ===
        this.obstacles.push(createTree(this.scene, -18, -10));
        this.obstacles.push(createTree(this.scene, -20, 5));
        this.obstacles.push(createTree(this.scene, 18, -8));
        this.obstacles.push(createTree(this.scene, 20, 6));
        this.obstacles.push(createTree(this.scene, -10, -12));
        this.obstacles.push(createTree(this.scene, 10, -11));
        this.obstacles.push(createTree(this.scene, 0, 12));
        
        // === ROCKS ===
        this.obstacles.push(createRock(this.scene, -15, 3, 1.0));
        this.obstacles.push(createRock(this.scene, 16, -4, 0.8));
        this.obstacles.push(createRock(this.scene, -8, -10, 0.7));
        this.obstacles.push(createRock(this.scene, 12, 8, 0.9));
        this.obstacles.push(createRock(this.scene, -5, 10, 0.6));
        
        // === TORCHES ===
        this.obstacles.push(createTorch(this.scene, -12, -9));
        this.obstacles.push(createTorch(this.scene, 12, -9));
        this.obstacles.push(createTorch(this.scene, -18, 3));
        this.obstacles.push(createTorch(this.scene, 18, 3));
        
        // === WOODEN TRAINING DUMMIES ===
        this.obstacles.push(createDummy(this.scene, -8, 5));
        this.obstacles.push(createDummy(this.scene, 8, -5));
        
        // === GRASS PATCHES ===
        // Helper to check if position is on the road (x between -4 and 4)
        const isOnRoad = (x) => x > -4.5 && x < 4.5;
        
        // Dense grass around the arena (avoiding road)
        for (let i = 0; i < 120; i++) {
            let x = (Math.random() - 0.5) * 44;
            if (isOnRoad(x)) x = x < 0 ? x - 5 : x + 5; // Push away from road
            createGrass(this.scene, x, (Math.random() - 0.5) * 24);
        }
        // Extra grass along the walls
        for (let i = 0; i < 30; i++) {
            createGrass(this.scene, -22 + Math.random() * 4, (Math.random() - 0.5) * 26);
            createGrass(this.scene, 20 + Math.random() * 4, (Math.random() - 0.5) * 26);
        }
        // Grass clusters near trees
        for (let i = 0; i < 40; i++) {
            createGrass(this.scene, -18 + (Math.random() - 0.5) * 6, -10 + (Math.random() - 0.5) * 6);
            createGrass(this.scene, 18 + (Math.random() - 0.5) * 6, -8 + (Math.random() - 0.5) * 6);
            createGrass(this.scene, -20 + (Math.random() - 0.5) * 6, 5 + (Math.random() - 0.5) * 6);
            createGrass(this.scene, 20 + (Math.random() - 0.5) * 6, 6 + (Math.random() - 0.5) * 6);
        }
        // Grass along the path edges (just outside the road)
        for (let i = 0; i < 30; i++) {
            createGrass(this.scene, -5 - Math.random() * 2, (Math.random() - 0.5) * 26);
            createGrass(this.scene, 5 + Math.random() * 2, (Math.random() - 0.5) * 26);
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
        const x = (Math.random() - 0.5) * 32; // Within arena bounds
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
            const didAttack = this.player.attack(() => this.handleAttack());
            if (didAttack) {
                this.game.sound.playVaried('swing', 0.1);
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
            
            // Check if enemy is within range AND in front of player (within 120 degree arc)
            if (distance < attackRange) {
                // Calculate angle to enemy
                const toEnemy = new THREE.Vector3().subVectors(enemyPos, playerPos);
                const angleToEnemy = Math.atan2(toEnemy.x, toEnemy.z);
                
                // Calculate angle difference (normalize to -PI to PI)
                let angleDiff = angleToEnemy - playerRotation;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                
                // Only hit if within 60 degrees of facing direction (120 degree arc total)
                const attackArc = Math.PI / 3; // 60 degrees each side = 120 degree arc
                if (Math.abs(angleDiff) < attackArc) {
                    const knockDir = new THREE.Vector3().subVectors(enemyPos, playerPos).normalize();
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
                            }
                        });
                    }
                }
            }
        }
    }
    
    onStart() {
        // Start procedural background music
        this.game.sound.playMusic('bgm');
    }
    
    update(delta) {
        // Timed spawning until all enemies are on stage
        if (this.spawnedCount < this.totalEnemies) {
            this.spawnTimer += delta;
            if (this.spawnTimer >= this.spawnInterval) {
                this.spawnTimer = 0;
                this.spawnEnemy();
            }
        }
        
        // Update player
        const moveInput = this.controls.getMoveInput();
        const fell = this.player.update(delta, moveInput, this.platforms, this.arenaBounds, this.obstacles, this.enemies);
        
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
            enemy.update(delta, playerPos, this.arenaBounds, this.obstacles, this.enemies, this.player.collisionRadius, this.player.mass);
            if (enemy.canAttack()) {
                // Start attack with callback - damage is dealt after wind-up
                enemy.attack((damage) => {
                    // Check if player is still in range when attack lands
                    const currentPlayerPos = this.player.getPosition();
                    const currentEnemyPos = enemy.getPosition();
                    const currentDistance = currentPlayerPos.distanceTo(currentEnemyPos);
                    
                    if (currentDistance < enemy.lungeRange) {
                        const knockbackDir = new THREE.Vector3()
                            .subVectors(currentPlayerPos, currentEnemyPos)
                            .normalize();
                        this.takeDamage(damage, knockbackDir);
                    }
                });
            }
        });
    }
    
    takeDamage(amount, knockbackDir = null) {
        const isDead = this.player.takeDamage(amount, knockbackDir);
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
        this.spawnTimer = 0;
        this.game.ui.reset();
        
        this.enemies.forEach(e => e.destroy());
        this.enemies = [];
        this.spawnEnemies();
        
        // Restart music
        this.game.sound.playMusic('bgm');
    }
    
    destroy() {
        // Cleanup control bindings
        this.controls.onJump = null;
        this.controls.onAttack = null;
        
        // Cleanup enemies
        this.enemies.forEach(e => e.destroy());
        this.enemies = [];
        
        // Cleanup player
        if (this.player) {
            this.scene.remove(this.player.mesh);
            this.player = null;
        }
        
        // Cleanup platforms (scene objects removed by clearScene)
        this.platforms = [];
        this.obstacles = [];
    }
}
