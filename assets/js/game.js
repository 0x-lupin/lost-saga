// Lost Saga - Level 1: Training Grounds
// Main Game Module

import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Level } from './level.js';
import { Controls } from './controls.js';

class LostSagaGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.enemies = [];
        this.level = null;
        this.controls = null;
        this.score = 0;
        this.isGameRunning = false;
        this.clock = new THREE.Clock();
        
        this.init();
    }
    
    init() {
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupLights();
        
        // Create level
        this.level = new Level(this.scene);
        this.level.create();
        
        // Create player
        this.player = new Player(this.scene);
        
        // Spawn enemies
        this.spawnEnemies();
        
        // Setup controls
        this.controls = new Controls();
        this.controls.onJump = () => this.handleJump();
        this.controls.onAttack = () => this.handleAttack();
        
        // Setup UI
        this.setupUI();
        
        // Start game loop
        this.animate();
    }
    
    setupRenderer() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        window.addEventListener('resize', () => this.onResize());
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 20, 80);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.set(0, 8, 15);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff6600, 0.8, 30);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
    }
    
    spawnEnemies() {
        const positions = this.level.getEnemySpawnPositions();
        positions.forEach((pos, index) => {
            const enemy = new Enemy(this.scene, pos.x, pos.z, index);
            this.enemies.push(enemy);
        });
    }
    
    setupUI() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
    }
    
    toggleFullscreen() {
        const container = document.getElementById('game-container');
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) container.requestFullscreen();
            else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
            else if (container.msRequestFullscreen) container.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    }
    
    startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        this.isGameRunning = true;
        this.clock.start();
    }
    
    restartGame() {
        this.player.reset();
        this.score = 0;
        this.updateHealthBar();
        this.updateScore();
        
        // Remove and respawn enemies
        this.enemies.forEach(e => e.destroy());
        this.enemies = [];
        this.spawnEnemies();
        
        document.getElementById('game-over-screen').classList.add('hidden');
        this.isGameRunning = true;
    }

    
    handleJump() {
        if (this.isGameRunning) {
            this.player.jump();
        }
    }
    
    handleAttack() {
        if (!this.isGameRunning) return;
        
        this.player.attack(() => {
            // Check for enemy hits
            const playerPos = this.player.getPosition();
            const attackRange = this.player.getAttackRange();
            
            this.enemies.forEach((enemy, index) => {
                const distance = playerPos.distanceTo(enemy.getPosition());
                if (distance < attackRange) {
                    const knockDir = new THREE.Vector3()
                        .subVectors(enemy.getPosition(), playerPos)
                        .normalize();
                    
                    const isDead = enemy.takeDamage(this.player.attackDamage, knockDir);
                    
                    if (isDead) {
                        enemy.destroy();
                        this.enemies.splice(index, 1);
                        this.score += 100;
                        this.updateScore();
                        
                        // Respawn after delay
                        setTimeout(() => {
                            if (this.isGameRunning) {
                                const x = (Math.random() - 0.5) * 30;
                                const z = (Math.random() - 0.5) * 14;
                                const newEnemy = new Enemy(this.scene, x, z, Date.now());
                                this.enemies.push(newEnemy);
                            }
                        }, 3000);
                    }
                }
            });
        });
    }
    
    updatePlayer(delta) {
        if (!this.isGameRunning) return;
        
        const moveInput = this.controls.getMoveInput();
        const fell = this.player.update(
            delta, 
            moveInput, 
            this.level.getPlatforms(), 
            this.level.getArenaBounds()
        );
        
        if (fell) {
            this.takeDamage(100);
        }
        
        // Camera follow - fixed position behind player, no rotation
        const playerPos = this.player.getPosition();
        this.camera.position.x = playerPos.x;
        this.camera.position.y = 10 + playerPos.y * 0.5;
        this.camera.position.z = playerPos.z + 12;
        this.camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);
    }
    
    updateEnemies(delta) {
        if (!this.isGameRunning) return;
        
        const playerPos = this.player.getPosition();
        const arenaBounds = this.level.getArenaBounds();
        
        this.enemies.forEach(enemy => {
            const distance = enemy.update(delta, playerPos, arenaBounds);
            
            if (distance < 1.8 && enemy.canAttack()) {
                this.takeDamage(enemy.attack());
            }
        });
    }
    
    takeDamage(amount) {
        const isDead = this.player.takeDamage(amount);
        this.updateHealthBar();
        
        // Screen flash
        document.body.style.backgroundColor = '#ff0000';
        setTimeout(() => document.body.style.backgroundColor = '#000', 100);
        
        if (isDead) {
            this.gameOver();
        }
    }
    
    updateHealthBar() {
        const health = this.player.health;
        document.getElementById('health-fill').style.width = `${health}%`;
        document.getElementById('health-text').textContent = Math.round(health);
        
        const fill = document.getElementById('health-fill');
        if (health > 60) {
            fill.style.background = 'linear-gradient(to bottom, #4ade80, #22c55e)';
        } else if (health > 30) {
            fill.style.background = 'linear-gradient(to bottom, #fbbf24, #f59e0b)';
        } else {
            fill.style.background = 'linear-gradient(to bottom, #f87171, #dc2626)';
        }
    }
    
    updateScore() {
        document.getElementById('score-value').textContent = this.score;
    }
    
    gameOver() {
        this.isGameRunning = false;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over-screen').classList.remove('hidden');
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = Math.min(this.clock.getDelta(), 0.1);
        
        this.updatePlayer(delta);
        this.updateEnemies(delta);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    new LostSagaGame();
});
