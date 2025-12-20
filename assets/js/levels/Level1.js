// Level 1 - Training Grounds
// Extends BaseLevel for shared functionality

import { BaseLevel } from '../core/BaseLevel.js';
import { Enemy } from '../entities/Enemy.js';
import { createTree, createRock, createTorch, createDummy, createGrass } from '../props/index.js';

export class Level1 extends BaseLevel {
    constructor(game) {
        super(game, {
            arenaBounds: { minX: -24, maxX: 24, minZ: -14, maxZ: 14 },
            cameraOffset: { x: 0, y: 10, z: 12 },
            cameraHeightFactor: 0.5,
            scoreMultiplier: 1
        });
        
        // Level-specific config
        this.totalEnemies = 15;
        this.spawnedCount = 0;
        this.spawnInterval = 2.5; // seconds between spawns
        this.spawnTimer = 0;
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
    
    spawnInitialEnemies() {
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
    
    updateLevel(delta) {
        // Timed spawning until all enemies are on stage
        if (this.spawnedCount < this.totalEnemies) {
            this.spawnTimer += delta;
            if (this.spawnTimer >= this.spawnInterval) {
                this.spawnTimer = 0;
                this.spawnEnemy();
            }
        }
    }
    
    checkLevelComplete() {
        if (this.killCount >= this.totalEnemies) {
            this.game.isRunning = false;
            this.game.levelComplete(this.score);
        }
    }
    
    restart() {
        super.restart();
        this.spawnedCount = 0;
        this.spawnTimer = 0;
    }
}
