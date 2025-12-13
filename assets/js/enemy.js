// Enemy Module - Lost Saga

export class Enemy {
    constructor(scene, x, z, id) {
        this.scene = scene;
        this.mesh = null;
        this.id = id;
        this.health = 30;
        this.maxHealth = 30;
        this.speed = 2 + Math.random();
        this.attackCooldown = 0;
        this.attackDamage = 10;
        
        this.create(x, z);
    }
    
    create(x, z) {
        this.mesh = new THREE.Group();
        
        // Body
        const bodyGeo = new THREE.BoxGeometry(0.7, 1, 0.4);
        const bodyMat = new THREE.MeshStandardMaterial({ 
            color: 0xdc2626,
            roughness: 0.6
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.5;
        body.castShadow = true;
        this.mesh.add(body);
        
        // Head
        const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.4);
        const headMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.25;
        head.castShadow = true;
        this.mesh.add(head);
        
        // Eyes
        const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.05);
        const eyeMat = new THREE.MeshStandardMaterial({ 
            color: 0xffff00, 
            emissive: 0xffff00, 
            emissiveIntensity: 0.5 
        });
        
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.12, 1.3, 0.2);
        this.mesh.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.12, 1.3, 0.2);
        this.mesh.add(rightEye);
        
        this.mesh.position.set(x, 1, z);
        this.scene.add(this.mesh);
    }
    
    update(delta, playerPosition, arenaBounds) {
        const direction = new THREE.Vector3()
            .subVectors(playerPosition, this.mesh.position)
            .normalize();
        
        const distance = playerPosition.distanceTo(this.mesh.position);
        
        // Move towards player
        if (distance > 1.5) {
            this.mesh.position.x += direction.x * this.speed * delta;
            this.mesh.position.z += direction.z * this.speed * delta;
        }
        
        // Face player
        this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
        
        // Keep on ground
        this.mesh.position.y = 1;
        
        // Arena bounds
        this.mesh.position.x = Math.max(arenaBounds.minX, Math.min(arenaBounds.maxX, this.mesh.position.x));
        this.mesh.position.z = Math.max(arenaBounds.minZ, Math.min(arenaBounds.maxZ, this.mesh.position.z));
        
        // Attack cooldown
        this.attackCooldown -= delta;
        
        return distance;
    }
    
    canAttack() {
        return this.attackCooldown <= 0;
    }
    
    attack() {
        this.attackCooldown = 1.5;
        return this.attackDamage;
    }
    
    takeDamage(amount, knockbackDir) {
        this.health -= amount;
        
        // Knockback
        if (knockbackDir) {
            this.mesh.position.x += knockbackDir.x * 1.5;
            this.mesh.position.z += knockbackDir.z * 1.5;
        }
        
        // Flash effect
        this.mesh.children.forEach(child => {
            if (child.material) {
                const origColor = child.material.color.getHex();
                child.material.color.setHex(0xffffff);
                setTimeout(() => child.material.color.setHex(origColor), 100);
            }
        });
        
        return this.health <= 0;
    }
    
    destroy() {
        this.scene.remove(this.mesh);
    }
    
    getPosition() {
        return this.mesh.position;
    }
}
