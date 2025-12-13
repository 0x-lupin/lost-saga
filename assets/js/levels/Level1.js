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
        this.obstacles = []; // Circular obstacles (trees, torches, etc.)
        this.score = 0;
        
        // Level config
        this.totalEnemies = 10;
        this.spawnedCount = 0;
        this.killCount = 0;
        this.arenaBounds = { minX: -24, maxX: 24, minZ: -14, maxZ: 14 };
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
        this.createTree(-18, -10);
        this.createTree(-20, 5);
        this.createTree(18, -8);
        this.createTree(20, 6);
        this.createTree(-10, -12);
        this.createTree(10, -11);
        this.createTree(0, 12);
        
        // === ROCKS ===
        this.createRock(-15, 3, 1.0);
        this.createRock(16, -4, 0.8);
        this.createRock(-8, -10, 0.7);
        this.createRock(12, 8, 0.9);
        this.createRock(-5, 10, 0.6);
        
        // === TORCHES ===
        this.createTorch(-12, -9);
        this.createTorch(12, -9);
        this.createTorch(-18, 3);
        this.createTorch(18, 3);
        
        // === WOODEN TRAINING DUMMIES ===
        this.createDummy(-8, 5);
        this.createDummy(8, -5);
        
        // === GRASS PATCHES ===
        for (let i = 0; i < 50; i++) {
            this.createGrass(
                (Math.random() - 0.5) * 44,
                (Math.random() - 0.5) * 24
            );
        }
    }
    
    createTree(x, z) {
        const tree = new THREE.Group();
        
        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // Foliage layers
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d5a2d, roughness: 0.8 });
        
        const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(2, 3, 8), foliageMat);
        foliage1.position.y = 4;
        foliage1.castShadow = true;
        tree.add(foliage1);
        
        const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.5, 8), foliageMat);
        foliage2.position.y = 5.5;
        foliage2.castShadow = true;
        tree.add(foliage2);
        
        const foliage3 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 8), foliageMat);
        foliage3.position.y = 6.8;
        foliage3.castShadow = true;
        tree.add(foliage3);
        
        tree.position.set(x, 0, z);
        this.scene.add(tree);
        
        // Add collision (trunk radius)
        this.obstacles.push({ x, z, radius: 0.6 });
    }
    
    createRock(x, z, scale) {
        const rockGeo = new THREE.DodecahedronGeometry(scale, 0);
        const rockMat = new THREE.MeshStandardMaterial({ 
            color: 0x6b6b6b, 
            roughness: 0.9,
            flatShading: true
        });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(x, scale * 0.5, z);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        rock.receiveShadow = true;
        this.scene.add(rock);
    }
    
    createTorch(x, z) {
        const torch = new THREE.Group();
        
        // Base (so it doesn't float)
        const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.15, 8);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.075;
        base.castShadow = true;
        base.receiveShadow = true;
        torch.add(base);
        
        // Pole
        const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 2.5, 6);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 1.4;
        pole.castShadow = true;
        torch.add(pole);
        
        // Flame holder
        const holderGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.3, 6);
        const holderMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
        const holder = new THREE.Mesh(holderGeo, holderMat);
        holder.position.y = 2.8;
        holder.castShadow = true;
        torch.add(holder);
        
        // Flame (glowing)
        const flameGeo = new THREE.ConeGeometry(0.12, 0.4, 6);
        const flameMat = new THREE.MeshStandardMaterial({ 
            color: 0xff6600,
            emissive: 0xff4400,
            emissiveIntensity: 1
        });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.y = 3.1;
        torch.add(flame);
        
        // Point light
        const light = new THREE.PointLight(0xff6600, 0.5, 8);
        light.position.y = 3;
        torch.add(light);
        
        torch.position.set(x, 0, z);
        this.scene.add(torch);
        
        // Add collision
        this.obstacles.push({ x, z, radius: 0.3 });
    }
    
    createDummy(x, z) {
        const dummy = new THREE.Group();
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.9 });
        
        // Post
        const postGeo = new THREE.CylinderGeometry(0.15, 0.2, 2.5, 8);
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.y = 1.25;
        post.castShadow = true;
        dummy.add(post);
        
        // Crossbar (arms)
        const armGeo = new THREE.BoxGeometry(1.5, 0.15, 0.15);
        const arms = new THREE.Mesh(armGeo, woodMat);
        arms.position.y = 2;
        arms.castShadow = true;
        dummy.add(arms);
        
        // Head (straw)
        const headGeo = new THREE.SphereGeometry(0.3, 8, 6);
        const strawMat = new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 1 });
        const head = new THREE.Mesh(headGeo, strawMat);
        head.position.y = 2.6;
        head.castShadow = true;
        dummy.add(head);
        
        dummy.position.set(x, 0, z);
        this.scene.add(dummy);
        
        // Add collision
        this.obstacles.push({ x, z, radius: 0.4 });
    }
    
    createGrass(x, z) {
        const grassMat = new THREE.MeshStandardMaterial({ 
            color: 0x4a7c4a, 
            side: THREE.DoubleSide 
        });
        
        for (let i = 0; i < 3; i++) {
            const bladeGeo = new THREE.PlaneGeometry(0.1, 0.4);
            const blade = new THREE.Mesh(bladeGeo, grassMat);
            blade.position.set(
                x + (Math.random() - 0.5) * 0.3,
                0.2,
                z + (Math.random() - 0.5) * 0.3
            );
            blade.rotation.y = Math.random() * Math.PI;
            blade.rotation.x = -0.2;
            this.scene.add(blade);
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
            this.game.sound.playVaried('swing', 0.1);
            this.player.attack(() => this.handleAttack());
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
    }
    
    onStart() {
        // Start procedural background music
        this.game.sound.playMusic('bgm');
    }
    
    update(delta) {
        // Update player
        const moveInput = this.controls.getMoveInput();
        const fell = this.player.update(delta, moveInput, this.platforms, this.arenaBounds, this.obstacles);
        
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
