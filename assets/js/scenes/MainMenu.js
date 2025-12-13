// Main Menu Scene - Lost Saga
// Animated 3D main menu with options

export class MainMenu {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.objects = [];
        this.particles = [];
        this.animTime = 0;
        this.isDestroyed = false;
    }
    
    init() {
        this.createBackground();
        this.createTitle();
        this.createMenuCharacter();
        this.setupCamera();
    }
    
    createBackground() {
        // Dark atmospheric background
        this.scene.background = new THREE.Color(0x0a0a15);
        this.scene.fog = new THREE.Fog(0x0a0a15, 15, 50);
        
        // Ground plane
        const groundGeo = new THREE.PlaneGeometry(100, 100);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a2e,
            roughness: 0.9
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.objects.push(ground);
        
        // Floating particles
        this.particles = [];
        const particleMat = new THREE.MeshBasicMaterial({ 
            color: 0x4488ff,
            transparent: true,
            opacity: 0.6
        });
        for (let i = 0; i < 50; i++) {
            const size = 0.05 + Math.random() * 0.1;
            const particleGeo = new THREE.SphereGeometry(size, 4, 4);
            const particle = new THREE.Mesh(particleGeo, particleMat.clone());
            particle.position.set(
                (Math.random() - 0.5) * 30,
                Math.random() * 10,
                (Math.random() - 0.5) * 20 - 5
            );
            particle.userData = {
                speed: 0.2 + Math.random() * 0.3,
                offset: Math.random() * Math.PI * 2
            };
            this.scene.add(particle);
            this.particles.push(particle);
            this.objects.push(particle);
        }
    }

    
    createTitle() {
        // 3D title using boxes (LOST SAGA)
        this.titleGroup = new THREE.Group();
        
        // Glowing title light
        const titleLight = new THREE.PointLight(0xff6600, 2, 15);
        titleLight.position.set(0, 5, 2);
        this.titleGroup.add(titleLight);
        this.titleLight = titleLight;
        
        // Decorative swords crossed behind title
        const sword1 = this.createMenuSword();
        sword1.position.set(-3, 3.5, -1);
        sword1.rotation.z = Math.PI / 4;
        this.titleGroup.add(sword1);
        
        const sword2 = this.createMenuSword();
        sword2.position.set(3, 3.5, -1);
        sword2.rotation.z = -Math.PI / 4;
        this.titleGroup.add(sword2);
        
        this.titleGroup.position.set(0, 2, -5);
        this.scene.add(this.titleGroup);
        this.objects.push(this.titleGroup);
    }
    
    createMenuSword() {
        const swordGroup = new THREE.Group();
        
        // Blade
        const bladeGeo = new THREE.BoxGeometry(0.15, 3, 0.05);
        const bladeMat = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 0.9,
            roughness: 0.1
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 1.5;
        swordGroup.add(blade);
        
        // Guard
        const guardGeo = new THREE.BoxGeometry(0.6, 0.1, 0.1);
        const guardMat = new THREE.MeshStandardMaterial({ 
            color: 0xfbbf24,
            metalness: 0.7
        });
        const guard = new THREE.Mesh(guardGeo, guardMat);
        swordGroup.add(guard);
        
        // Handle
        const handleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = -0.3;
        swordGroup.add(handle);
        
        return swordGroup;
    }
    
    createMenuCharacter() {
        // Silhouette warrior in heroic pose
        this.character = new THREE.Group();
        
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a2e,
            roughness: 0.8
        });
        
        // Body
        const bodyGeo = new THREE.BoxGeometry(0.8, 1, 0.5);
        const body = new THREE.Mesh(bodyGeo, mat);
        body.position.y = 1.2;
        this.character.add(body);
        
        // Head
        const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.4);
        const head = new THREE.Mesh(headGeo, mat);
        head.position.y = 2;
        this.character.add(head);
        
        // Glowing eyes
        const eyeMat = new THREE.MeshStandardMaterial({ 
            color: 0x60a5fa,
            emissive: 0x3b82f6,
            emissiveIntensity: 1
        });
        const eyeGeo = new THREE.SphereGeometry(0.05, 6, 6);
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.1, 2, 0.2);
        this.character.add(leftEye);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.1, 2, 0.2);
        this.character.add(rightEye);
        
        // Cape
        const capeGeo = new THREE.BoxGeometry(0.9, 1.5, 0.1);
        const capeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
        const cape = new THREE.Mesh(capeGeo, capeMat);
        cape.position.set(0, 0.8, -0.3);
        cape.rotation.x = 0.2;
        this.character.add(cape);
        this.cape = cape;
        
        // Sword in hand (raised)
        const sword = this.createHeroSword();
        sword.position.set(0.6, 2.5, 0.3);
        sword.rotation.z = -0.3;
        sword.rotation.x = -0.5;
        this.character.add(sword);
        this.heroSword = sword;
        
        // Legs
        const legGeo = new THREE.BoxGeometry(0.25, 0.8, 0.25);
        const leftLeg = new THREE.Mesh(legGeo, mat);
        leftLeg.position.set(-0.2, 0.4, 0);
        this.character.add(leftLeg);
        const rightLeg = new THREE.Mesh(legGeo, mat);
        rightLeg.position.set(0.2, 0.4, 0);
        this.character.add(rightLeg);
        
        this.character.position.set(4, 0, 0);
        this.character.rotation.y = -0.4;
        this.scene.add(this.character);
        this.objects.push(this.character);
    }

    
    createHeroSword() {
        const swordGroup = new THREE.Group();
        
        // Blade with glow
        const bladeGeo = new THREE.BoxGeometry(0.1, 2, 0.03);
        const bladeMat = new THREE.MeshStandardMaterial({ 
            color: 0xe5e7eb,
            metalness: 0.9,
            roughness: 0.1
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 1;
        swordGroup.add(blade);
        
        // Blade glow edge
        const edgeGeo = new THREE.BoxGeometry(0.02, 2, 0.04);
        const edgeMat = new THREE.MeshStandardMaterial({ 
            color: 0x60a5fa,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.8
        });
        const edge = new THREE.Mesh(edgeGeo, edgeMat);
        edge.position.set(0, 1, 0.02);
        swordGroup.add(edge);
        
        // Guard
        const guardGeo = new THREE.BoxGeometry(0.4, 0.08, 0.08);
        const guardMat = new THREE.MeshStandardMaterial({ 
            color: 0xfbbf24,
            metalness: 0.7
        });
        const guard = new THREE.Mesh(guardGeo, guardMat);
        swordGroup.add(guard);
        
        // Handle
        const handleGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 6);
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = -0.2;
        swordGroup.add(handle);
        
        return swordGroup;
    }
    
    setupCamera() {
        this.camera.position.set(0, 3, 10);
        this.camera.lookAt(0, 2, 0);
    }
    
    update(delta) {
        if (this.isDestroyed) return;
        this.animTime += delta;
        
        // Animate particles
        this.particles.forEach(p => {
            p.position.y += Math.sin(this.animTime * p.userData.speed + p.userData.offset) * 0.01;
            p.material.opacity = 0.3 + Math.sin(this.animTime + p.userData.offset) * 0.3;
        });
        
        // Animate title light
        if (this.titleLight) {
            this.titleLight.intensity = 1.5 + Math.sin(this.animTime * 2) * 0.5;
        }
        
        // Animate character
        if (this.character) {
            this.character.position.y = Math.sin(this.animTime * 0.5) * 0.1;
            this.character.rotation.y = -0.4 + Math.sin(this.animTime * 0.3) * 0.1;
        }
        
        // Animate cape
        if (this.cape) {
            this.cape.rotation.x = 0.2 + Math.sin(this.animTime * 2) * 0.1;
        }
        
        // Animate hero sword glow
        if (this.heroSword) {
            this.heroSword.rotation.z = -0.3 + Math.sin(this.animTime) * 0.1;
        }
    }
    
    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        
        // Remove all objects from scene
        this.objects.forEach(obj => {
            this.scene.remove(obj);
        });
        this.objects = [];
        this.particles = [];
        
        // Clear references
        this.titleGroup = null;
        this.titleLight = null;
        this.character = null;
        this.cape = null;
        this.heroSword = null;
    }
}
