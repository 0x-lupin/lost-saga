// Enemy Module - Lost Saga
// Zombie Enemy

export class Enemy {
    constructor(scene, x, z, id) {
        this.scene = scene;
        this.mesh = null;
        this.id = id;
        this.health = 30;
        this.maxHealth = 30;
        this.speed = 1.5 + Math.random() * 0.5;
        this.attackCooldown = 0;
        this.attackDamage = 10;
        this.isAttacking = false;
        this.animTime = Math.random() * Math.PI * 2;
        
        this.create(x, z);
    }
    
    create(x, z) {
        this.mesh = new THREE.Group();
        
        // Zombie colors
        const skinColor = 0x6b8e6b; // Greenish dead skin
        const clothColor = 0x3d3d3d; // Torn dark clothes
        const darkSkin = 0x4a6b4a;
        
        // === LEGS ===
        const legGroup = new THREE.Group();
        
        // Left leg (torn pants)
        const leftLeg = this.createLimb(0.18, 0.5, 0.18, clothColor);
        leftLeg.position.set(-0.15, -0.25, 0);
        legGroup.add(leftLeg);
        this.leftLeg = leftLeg;
        
        // Right leg
        const rightLeg = this.createLimb(0.18, 0.5, 0.18, clothColor);
        rightLeg.position.set(0.15, -0.25, 0);
        legGroup.add(rightLeg);
        this.rightLeg = rightLeg;
        
        // Feet
        const footGeo = new THREE.BoxGeometry(0.2, 0.1, 0.25);
        const footMat = new THREE.MeshStandardMaterial({ color: darkSkin, roughness: 0.9 });
        const leftFoot = new THREE.Mesh(footGeo, footMat);
        leftFoot.position.set(-0.15, -0.55, 0.03);
        legGroup.add(leftFoot);
        const rightFoot = new THREE.Mesh(footGeo, footMat);
        rightFoot.position.set(0.15, -0.55, 0.03);
        legGroup.add(rightFoot);
        
        legGroup.position.y = 0.6; // Feet at local y=0
        this.mesh.add(legGroup);
        this.legGroup = legGroup;
        
        // === TORSO ===
        const torsoGroup = new THREE.Group();
        
        // Body (torn shirt)
        const bodyGeo = new THREE.BoxGeometry(0.6, 0.7, 0.35);
        const bodyMat = new THREE.MeshStandardMaterial({ color: clothColor, roughness: 0.9 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        torsoGroup.add(body);
        
        // Exposed chest wound
        const woundGeo = new THREE.BoxGeometry(0.2, 0.15, 0.05);
        const woundMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 1 });
        const wound = new THREE.Mesh(woundGeo, woundMat);
        wound.position.set(0.1, 0.1, 0.18);
        torsoGroup.add(wound);
        
        // Ribs showing
        const ribMat = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.8 });
        for (let i = 0; i < 2; i++) {
            const ribGeo = new THREE.BoxGeometry(0.15, 0.03, 0.02);
            const rib = new THREE.Mesh(ribGeo, ribMat);
            rib.position.set(0.1, 0.05 + i * 0.06, 0.2);
            torsoGroup.add(rib);
        }
        
        torsoGroup.position.y = 1.2; // Torso position
        this.mesh.add(torsoGroup);
        
        // === ARMS ===
        // Left arm (reaching forward)
        const leftArmGroup = new THREE.Group();
        const leftArmUpper = this.createLimb(0.14, 0.35, 0.14, skinColor);
        leftArmUpper.position.y = -0.17;
        leftArmGroup.add(leftArmUpper);
        const leftArmLower = this.createLimb(0.12, 0.3, 0.12, darkSkin);
        leftArmLower.position.y = -0.45;
        leftArmGroup.add(leftArmLower);
        // Zombie hand
        const leftHand = this.createZombieHand(darkSkin);
        leftHand.position.set(0, -0.65, 0);
        leftArmGroup.add(leftHand);
        
        leftArmGroup.position.set(-0.4, 1.35, 0); // Arm position
        leftArmGroup.rotation.x = -0.8; // Arms reaching forward
        this.mesh.add(leftArmGroup);
        this.leftArm = leftArmGroup;
        
        // Right arm
        const rightArmGroup = new THREE.Group();
        const rightArmUpper = this.createLimb(0.14, 0.35, 0.14, skinColor);
        rightArmUpper.position.y = -0.17;
        rightArmGroup.add(rightArmUpper);
        const rightArmLower = this.createLimb(0.12, 0.3, 0.12, darkSkin);
        rightArmLower.position.y = -0.45;
        rightArmGroup.add(rightArmLower);
        // Zombie hand
        const rightHand = this.createZombieHand(darkSkin);
        rightHand.position.set(0, -0.65, 0);
        rightArmGroup.add(rightHand);
        
        rightArmGroup.position.set(0.4, 1.35, 0); // Arm position
        rightArmGroup.rotation.x = -0.8;
        this.mesh.add(rightArmGroup);
        this.rightArm = rightArmGroup;

        
        // === HEAD ===
        const headGroup = new THREE.Group();
        
        // Skull-like head
        const headGeo = new THREE.BoxGeometry(0.45, 0.5, 0.4);
        const headMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.castShadow = true;
        headGroup.add(head);
        
        // Sunken eyes (dark sockets)
        const socketGeo = new THREE.BoxGeometry(0.12, 0.1, 0.05);
        const socketMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const leftSocket = new THREE.Mesh(socketGeo, socketMat);
        leftSocket.position.set(-0.1, 0.05, 0.2);
        headGroup.add(leftSocket);
        const rightSocket = new THREE.Mesh(socketGeo, socketMat);
        rightSocket.position.set(0.1, 0.05, 0.2);
        headGroup.add(rightSocket);
        
        // Glowing eyes
        const eyeGeo = new THREE.SphereGeometry(0.04, 6, 6);
        const eyeMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            emissive: 0xff0000, 
            emissiveIntensity: 0.8 
        });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.1, 0.05, 0.2);
        headGroup.add(leftEye);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.1, 0.05, 0.2);
        headGroup.add(rightEye);
        
        // Rotting jaw
        const jawGeo = new THREE.BoxGeometry(0.35, 0.15, 0.25);
        const jawMat = new THREE.MeshStandardMaterial({ color: darkSkin, roughness: 0.9 });
        const jaw = new THREE.Mesh(jawGeo, jawMat);
        jaw.position.set(0, -0.25, 0.05);
        headGroup.add(jaw);
        
        // Teeth
        const teethGeo = new THREE.BoxGeometry(0.25, 0.05, 0.05);
        const teethMat = new THREE.MeshStandardMaterial({ color: 0xd4c4a8 });
        const teeth = new THREE.Mesh(teethGeo, teethMat);
        teeth.position.set(0, -0.15, 0.18);
        headGroup.add(teeth);
        
        // Missing hair patches
        const hairGeo = new THREE.BoxGeometry(0.3, 0.1, 0.3);
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 1 });
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.set(-0.05, 0.28, -0.05);
        headGroup.add(hair);
        
        headGroup.position.y = 1.75; // Head position
        headGroup.rotation.z = 0.15; // Tilted head
        this.mesh.add(headGroup);
        this.headGroup = headGroup;
        
        this.mesh.position.set(x, 0, z); // Feet at ground level y=0
        this.scene.add(this.mesh);
    }
    
    createLimb(w, h, d, color) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
        const limb = new THREE.Mesh(geo, mat);
        limb.castShadow = true;
        return limb;
    }
    
    createZombieHand(color) {
        const handGroup = new THREE.Group();
        const palmGeo = new THREE.BoxGeometry(0.12, 0.08, 0.1);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
        const palm = new THREE.Mesh(palmGeo, mat);
        handGroup.add(palm);
        
        // Clawed fingers
        for (let i = 0; i < 3; i++) {
            const fingerGeo = new THREE.BoxGeometry(0.03, 0.12, 0.03);
            const finger = new THREE.Mesh(fingerGeo, mat);
            finger.position.set(-0.035 + i * 0.035, -0.08, 0.02);
            finger.rotation.x = 0.3;
            handGroup.add(finger);
        }
        return handGroup;
    }
    
    update(delta, playerPosition, arenaBounds) {
        const direction = new THREE.Vector3()
            .subVectors(playerPosition, this.mesh.position)
            .normalize();
        
        const distance = playerPosition.distanceTo(this.mesh.position);
        
        // Shambling movement
        if (distance > 1.5 && !this.isAttacking) {
            this.mesh.position.x += direction.x * this.speed * delta;
            this.mesh.position.z += direction.z * this.speed * delta;
        }
        
        // Face player
        this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
        
        // Keep on ground
        this.mesh.position.y = 0;
        
        // Arena bounds
        this.mesh.position.x = Math.max(arenaBounds.minX, Math.min(arenaBounds.maxX, this.mesh.position.x));
        this.mesh.position.z = Math.max(arenaBounds.minZ, Math.min(arenaBounds.maxZ, this.mesh.position.z));
        
        // Attack cooldown
        this.attackCooldown -= delta;
        
        // Shambling animation
        this.animate(delta);
        
        return distance;
    }
    
    animate(delta) {
        this.animTime += delta * 4;
        const sway = Math.sin(this.animTime);
        
        // Leg shamble
        if (this.leftLeg) this.leftLeg.rotation.x = sway * 0.3;
        if (this.rightLeg) this.rightLeg.rotation.x = -sway * 0.3;
        
        // Arm sway (zombie reaching)
        if (!this.isAttacking) {
            if (this.leftArm) this.leftArm.rotation.x = -0.8 + sway * 0.15;
            if (this.rightArm) this.rightArm.rotation.x = -0.8 - sway * 0.15;
        }
        
        // Head bob
        if (this.headGroup) {
            this.headGroup.rotation.x = Math.sin(this.animTime * 0.5) * 0.1;
        }
    }
    
    canAttack() {
        return this.attackCooldown <= 0 && !this.isAttacking;
    }
    
    attack() {
        this.attackCooldown = 1.5;
        this.isAttacking = true;
        
        // Attack animation - lunge forward with arms
        if (this.leftArm) this.leftArm.rotation.x = -1.5;
        if (this.rightArm) this.rightArm.rotation.x = -1.5;
        
        setTimeout(() => {
            if (this.leftArm) this.leftArm.rotation.x = -0.8;
            if (this.rightArm) this.rightArm.rotation.x = -0.8;
            this.isAttacking = false;
        }, 300);
        
        return this.attackDamage;
    }
    
    takeDamage(amount, knockbackDir) {
        this.health -= amount;
        
        if (knockbackDir) {
            this.mesh.position.x += knockbackDir.x * 1.5;
            this.mesh.position.z += knockbackDir.z * 1.5;
        }
        
        // Flash white
        this.mesh.traverse(child => {
            if (child.material && child.material.color) {
                const orig = child.material.color.getHex();
                child.material.color.setHex(0xffffff);
                setTimeout(() => child.material.color.setHex(orig), 100);
            }
        });
        
        return this.health <= 0;
    }
    
    die(callback) {
        this.isDying = true;
        
        // Death animation - fall backward and sink
        let deathTime = 0;
        const deathDuration = 0.8;
        
        const animateDeath = () => {
            deathTime += 0.016;
            const progress = Math.min(deathTime / deathDuration, 1);
            
            // Fall backward
            this.mesh.rotation.x = progress * (Math.PI / 2);
            
            // Sink into ground
            this.mesh.position.y = 0 - progress * 1.5;
            
            // Fade out (scale down)
            const scale = 1 - progress * 0.3;
            this.mesh.scale.set(scale, scale, scale);
            
            // Arms flail
            if (this.leftArm) this.leftArm.rotation.x = -0.8 - progress * 1;
            if (this.rightArm) this.rightArm.rotation.x = -0.8 - progress * 1;
            if (this.leftArm) this.leftArm.rotation.z = -progress * 0.5;
            if (this.rightArm) this.rightArm.rotation.z = progress * 0.5;
            
            if (progress < 1) {
                requestAnimationFrame(animateDeath);
            } else {
                this.destroy();
                if (callback) callback();
            }
        };
        
        animateDeath();
    }
    
    destroy() {
        this.scene.remove(this.mesh);
    }
    
    getPosition() {
        return this.mesh.position;
    }
}
