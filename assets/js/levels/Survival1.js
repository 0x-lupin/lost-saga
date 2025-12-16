// Survival Mode - Large Open Arena

import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { createTree, createRock, createTorch, createDummy, createGrass } from '../props/index.js';

export class Survival1 {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.controls = game.controls;

        this.player = null;
        this.enemies = [];
        this.platforms = [];
        this.obstacles = [];
        this.score = 0;
        this.killCount = 0;

        // Survival config - large arena
        this.arenaBounds = { minX: -48, maxX: 48, minZ: -28, maxZ: 28 };

        // Endless spawning
        this.maxEnemiesAlive = 12;
        this.spawnInterval = 3.0;
        this.spawnTimer = 0;
        this.difficultyTimer = 0;
        this.difficultyLevel = 1;
    }

    init() {
        // Larger arena needs bigger shadow bounds
        this.game.setShadowBounds(-50, 50, 30, -30);

        this.game.ui.reset(); // Initialize HUD (Health/Score)

        this.createEnvironment();
        this.createPlayer();
        this.spawnInitialEnemies();
        this.bindControls();
    }

    createEnvironment() {
        // === LARGE GROUND ===
        const groundGeo = new THREE.BoxGeometry(100, 1, 60);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x3d6b3d,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.platforms.push({ mesh: ground, bounds: { minX: -50, maxX: 50, minZ: -30, maxZ: 30, y: 0 } });

        // Dirt paths (cross pattern)
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 1 });

        // Horizontal path
        const hPathGeo = new THREE.BoxGeometry(100, 0.05, 6);
        const hPath = new THREE.Mesh(hPathGeo, pathMat);
        hPath.position.y = 0.03;
        hPath.receiveShadow = true;
        this.scene.add(hPath);

        // Vertical path
        const vPathGeo = new THREE.BoxGeometry(6, 0.05, 60);
        const vPath = new THREE.Mesh(vPathGeo, pathMat);
        vPath.position.y = 0.03;
        vPath.receiveShadow = true;
        this.scene.add(vPath);

        // === STONE WALLS ===
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x5a5a5a, roughness: 0.8 });

        // Back wall
        const backWallGeo = new THREE.BoxGeometry(102, 5, 1.5);
        const backWall = new THREE.Mesh(backWallGeo, wallMat);
        backWall.position.set(0, 2.5, -30);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Front wall (low)
        const frontWallGeo = new THREE.BoxGeometry(102, 2, 1.5);
        const frontWall = new THREE.Mesh(frontWallGeo, wallMat);
        frontWall.position.set(0, 1, 30);
        frontWall.castShadow = true;
        this.scene.add(frontWall);

        // Side walls
        const sideWallGeo = new THREE.BoxGeometry(1.5, 4, 60);
        const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
        leftWall.position.set(-50, 2, 0);
        leftWall.castShadow = true;
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
        rightWall.position.set(50, 2, 0);
        rightWall.castShadow = true;
        this.scene.add(rightWall);

        // === TREES (scattered around large arena) ===
        const treePositions = [
            // Corners
            { x: -42, z: -24 }, { x: 42, z: -24 }, { x: -42, z: 24 }, { x: 42, z: 24 },
            // Along back wall
            { x: -30, z: -25 }, { x: -15, z: -26 }, { x: 15, z: -26 }, { x: 30, z: -25 },
            // Middle areas (avoiding paths)
            { x: -25, z: -12 }, { x: 25, z: -12 }, { x: -25, z: 12 }, { x: 25, z: 12 },
            { x: -35, z: 0 }, { x: 35, z: 0 },
            // Near front
            { x: -20, z: 20 }, { x: 20, z: 20 }, { x: -38, z: 18 }, { x: 38, z: 18 }
        ];
        treePositions.forEach(pos => {
            this.obstacles.push(createTree(this.scene, pos.x, pos.z));
        });

        // === ROCKS (scattered) ===
        const rockPositions = [
            { x: -18, z: -15, s: 1.2 }, { x: 22, z: -18, s: 1.0 },
            { x: -30, z: 8, s: 0.9 }, { x: 28, z: 10, s: 1.1 },
            { x: -12, z: 18, s: 0.8 }, { x: 14, z: 16, s: 0.7 },
            { x: -40, z: -8, s: 1.0 }, { x: 40, z: -5, s: 0.9 },
            { x: -8, z: -20, s: 0.6 }, { x: 10, z: -22, s: 0.8 },
            { x: 0, z: 22, s: 1.0 }, { x: -45, z: 15, s: 0.7 },
            { x: 45, z: -15, s: 0.8 }
        ];
        rockPositions.forEach(pos => {
            this.obstacles.push(createRock(this.scene, pos.x, pos.z, pos.s));
        });

        // === TORCHES (lighting the arena) ===
        const torchPositions = [
            // Along walls
            { x: -45, z: -20 }, { x: -45, z: 0 }, { x: -45, z: 20 },
            { x: 45, z: -20 }, { x: 45, z: 0 }, { x: 45, z: 20 },
            { x: -25, z: -27 }, { x: 0, z: -27 }, { x: 25, z: -27 },
            // Interior torches
            { x: -20, z: -8 }, { x: 20, z: -8 }, { x: -20, z: 8 }, { x: 20, z: 8 }
        ];
        torchPositions.forEach(pos => {
            this.obstacles.push(createTorch(this.scene, pos.x, pos.z));
        });

        // === TRAINING DUMMIES (scattered practice targets) ===
        const dummyPositions = [
            { x: -15, z: 5 }, { x: 15, z: -5 },
            { x: -32, z: -15 }, { x: 32, z: 15 }
        ];
        dummyPositions.forEach(pos => {
            this.obstacles.push(createDummy(this.scene, pos.x, pos.z));
        });

        // === GRASS PATCHES (dense coverage) ===
        const isOnPath = (x, z) => (Math.abs(x) < 4 || Math.abs(z) < 4);

        // Dense grass coverage
        for (let i = 0; i < 300; i++) {
            let x = (Math.random() - 0.5) * 90;
            let z = (Math.random() - 0.5) * 54;
            if (!isOnPath(x, z)) {
                createGrass(this.scene, x, z);
            }
        }

        // Extra grass along walls
        for (let i = 0; i < 60; i++) {
            createGrass(this.scene, -46 + Math.random() * 4, (Math.random() - 0.5) * 54);
            createGrass(this.scene, 44 + Math.random() * 4, (Math.random() - 0.5) * 54);
        }

        // Grass clusters near trees
        treePositions.forEach(pos => {
            for (let i = 0; i < 8; i++) {
                createGrass(this.scene, pos.x + (Math.random() - 0.5) * 6, pos.z + (Math.random() - 0.5) * 6);
            }
        });
    }

    createPlayer() {
        this.player = new Player(this.scene);
    }

    spawnInitialEnemies() {
        const positions = [
            { x: -15, z: -10 }, { x: 15, z: -10 },
            { x: -20, z: 5 }, { x: 20, z: 5 },
            { x: 0, z: -15 }
        ];
        positions.forEach((pos, i) => {
            this.enemies.push(new Enemy(this.scene, pos.x, pos.z, i));
        });
    }

    spawnEnemy() {
        if (this.enemies.length >= this.maxEnemiesAlive) return;

        // Spawn at random edge of arena
        const side = Math.floor(Math.random() * 4);
        let x, z;

        switch (side) {
            case 0: x = -45; z = (Math.random() - 0.5) * 50; break; // Left
            case 1: x = 45; z = (Math.random() - 0.5) * 50; break;  // Right
            case 2: x = (Math.random() - 0.5) * 90; z = -26; break; // Back
            case 3: x = (Math.random() - 0.5) * 90; z = 26; break;  // Front
        }

        // Apply difficulty scaling
        const config = this.getEnemyConfig();
        this.enemies.push(new Enemy(this.scene, x, z, Date.now(), config));
    }

    getEnemyConfig() {
        // Difficulty scaling - enemies get stronger over time
        const level = this.difficultyLevel;

        // Single roll to determine zombie type
        // Example: bigChance=5%, fastChance=3%
        // Roll 0.00-0.05 → Big (5%)
        // Roll 0.05-0.08 → Fast (3%)
        // Roll 0.08-1.00 → Normal (92%)
        const roll = Math.random();
        const bigChance = Math.min(0.05, 0.01 + level * 0.0015);   // 1% → 5%
        const fastChance = Math.min(0.08, 0.03 + level * 0.0025);  // 3% → 8%

        // Big zombie
        if (level >= 1 && roll < bigChance) {
            return {
                size: 1.3 + level * 0.039,
                health: 50 + level * 0.5,
                attackDamage: 10 + level * 0.01,
                speed: 1.2 + level * 0.039
            };
        }

        // Fast zombie
        if (level >= 2 && roll < bigChance + fastChance) {
            return {
                size: 0.8,
                health: 20,
                attackDamage: 8,
                speed: 2.5 + Math.random() * 0.1 + level * 0.07
            };
        }

        // Normal zombie with tiny scaling
        return {
            health: 30 + level * 0.07,
            attackDamage: 7 + level * 0.01,
            speed: 1.3 + Math.random() * 0.1 + level * 0.01
        };
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
                    this.game.sound.playVaried('jump', 0.2); // Reuse jump sound for now, higher pitch
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

                const attackArc = Math.PI / 3;
                if (Math.abs(angleDiff) < attackArc) {
                    const knockDir = new THREE.Vector3().subVectors(enemyPos, playerPos).normalize();
                    const isDead = enemy.takeDamage(this.player.attackDamage, knockDir);
                    this.game.sound.playVaried('hit', 0.1);

                    if (isDead) {
                        this.enemies.splice(i, 1);
                        this.score += 100 * this.difficultyLevel;
                        this.killCount++;
                        this.updateScore();
                        this.game.sound.playVaried('enemyDeath', 0.15);
                        enemy.die();
                    }
                }
            }
        }
    }

    onStart() {
        this.game.sound.playMusic('bgm');
    }

    update(delta) {
        // Spawn timer
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy();
        }

        // Difficulty scaling every 4 seconds
        this.difficultyTimer += delta;
        if (this.difficultyTimer >= 4) {
            this.difficultyTimer = 0;
            this.difficultyLevel++;
            this.maxEnemiesAlive = Math.min(999, 12 + this.difficultyLevel);
            this.spawnInterval = Math.max(0.9, 3.0 - this.difficultyLevel * 0.1);
        }

        // Update player
        const moveInput = this.controls.getMoveInput();
        const fell = this.player.update(delta, moveInput, this.platforms, this.arenaBounds, this.obstacles, this.enemies);

        // Update Dash UI
        this.game.ui.updateDashCooldown(this.player.dashCooldownTimer, this.player.dashCooldown);

        if (fell) {
            this.takeDamage(100);
        }

        // Camera follow (wider view for large map)
        const playerPos = this.player.getPosition();
        this.camera.position.x = playerPos.x;
        this.camera.position.y = 14 + playerPos.y * 0.5;
        this.camera.position.z = playerPos.z + 16;
        this.camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);

        // Update enemies
        this.enemies.forEach(enemy => {
            if (enemy.isDying) return;
            enemy.update(delta, playerPos, this.arenaBounds, this.obstacles, this.enemies, this.player.collisionRadius, this.player.mass);
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

    restart() {
        this.player.reset();
        this.score = 0;
        this.killCount = 0;
        this.spawnTimer = 0;
        this.difficultyTimer = 0;
        this.difficultyLevel = 1;
        this.maxEnemiesAlive = 12;
        this.spawnInterval = 3.0;
        this.game.ui.reset();

        this.enemies.forEach(e => e.destroy());
        this.enemies = [];
        this.spawnInitialEnemies();

        this.game.sound.playMusic('bgm');
    }

    destroy() {
        this.controls.onJump = null;
        this.controls.onAttack = null;
        this.controls.onDash = null;

        this.enemies.forEach(e => e.destroy());
        this.enemies = [];

        if (this.player) {
            this.scene.remove(this.player.mesh);
            this.player = null;
        }

        this.platforms = [];
        this.obstacles = [];
    }
}
