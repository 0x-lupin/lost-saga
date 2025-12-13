// Player Module - Lost Saga
// Reusable player character with detailed model

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.isGrounded = false;
        this.isAttacking = false;
        this.health = 100;
        this.maxHealth = 100;
        this.attackDamage = 15;
        this.moveSpeed = 8;
        this.jumpForce = 12;
        
        // Animation state
        this.animationTime = 0;
        this.isMoving = false;
        
        this.create();
    }
    
    create() {
        this.mesh = new THREE.Group();
        
        // === LEGS ===
        const legGroup = new THREE.Group();
        
        // Left leg
        const leftLegUpper = this.createLimb(0.22, 0.45, 0.22, 0x1e3a5f);
        leftLegUpper.position.set(-0.18, -0.22, 0);
        leftLegUpper.castShadow = true;
        legGroup.add(leftLegUpper);
        this.leftLegUpper = leftLegUpper;
        
        const leftLegLower = this.createLimb(0.18, 0.4, 0.18, 0x162d4d);
        leftLegLower.position.set(-0.18, -0.62, 0);
        leftLegLower.castShadow = true;
        legGroup.add(leftLegLower);
        this.leftLegLower = leftLegLower;
        
        // Left boot
        const leftBoot = this.createBoot(0x4a3728);
        leftBoot.position.set(-0.18, -0.9, 0.05);
        legGroup.add(leftBoot);
        this.leftBoot = leftBoot;
        
        // Right leg
        const rightLegUpper = this.createLimb(0.22, 0.45, 0.22, 0x1e3a5f);
        rightLegUpper.position.set(0.18, -0.22, 0);
        rightLegUpper.castShadow = true;
        legGroup.add(rightLegUpper);
        this.rightLegUpper = rightLegUpper;
        
        const rightLegLower = this.createLimb(0.18, 0.4, 0.18, 0x162d4d);
        rightLegLower.position.set(0.18, -0.62, 0);
        rightLegLower.castShadow = true;
        legGroup.add(rightLegLower);
        this.rightLegLower = rightLegLower;
        
        // Right boot
        const rightBoot = this.createBoot(0x4a3728);
        rightBoot.position.set(0.18, -0.9, 0.05);
        legGroup.add(rightBoot);
        this.rightBoot = rightBoot;
        
        legGroup.position.y = 0.9; // Feet at local y=0
        this.mesh.add(legGroup);
        this.legGroup = legGroup;
        
        // === TORSO ===
        const torsoGroup = new THREE.Group();
        
        // Main body
        const bodyGeo = new THREE.BoxGeometry(0.7, 0.8, 0.4);
        const bodyMat = new THREE.MeshStandardMaterial({ 
            color: 0x2563eb,
            roughness: 0.6,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        torsoGroup.add(body);
        
        // Chest armor plate
        const chestGeo = new THREE.BoxGeometry(0.55, 0.5, 0.12);
        const armorMat = new THREE.MeshStandardMaterial({ 
            color: 0x3b82f6,
            roughness: 0.3,
            metalness: 0.6
        });
        const chest = new THREE.Mesh(chestGeo, armorMat);
        chest.position.set(0, 0.05, 0.22);
        chest.castShadow = true;
        torsoGroup.add(chest);
        
        // Belt
        const beltGeo = new THREE.BoxGeometry(0.72, 0.12, 0.42);
        const beltMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
        const belt = new THREE.Mesh(beltGeo, beltMat);
        belt.position.y = -0.35;
        belt.castShadow = true;
        torsoGroup.add(belt);
        
        // Belt buckle
        const buckleGeo = new THREE.BoxGeometry(0.15, 0.1, 0.08);
        const buckleMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });
        const buckle = new THREE.Mesh(buckleGeo, buckleMat);
        buckle.position.set(0, -0.35, 0.24);
        torsoGroup.add(buckle);
        
        // Shoulder pads
        const shoulderGeo = new THREE.SphereGeometry(0.18, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        const shoulderMat = new THREE.MeshStandardMaterial({ 
            color: 0x1d4ed8,
            roughness: 0.4,
            metalness: 0.5
        });
        
        const leftShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
        leftShoulder.position.set(-0.45, 0.3, 0);
        leftShoulder.rotation.z = Math.PI / 6;
        leftShoulder.castShadow = true;
        torsoGroup.add(leftShoulder);
        
        const rightShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
        rightShoulder.position.set(0.45, 0.3, 0);
        rightShoulder.rotation.z = -Math.PI / 6;
        rightShoulder.castShadow = true;
        torsoGroup.add(rightShoulder);
        
        torsoGroup.position.y = 1.5; // Torso position
        this.mesh.add(torsoGroup);
        this.torsoGroup = torsoGroup;

        
        // === ARMS ===
        // Left arm
        const leftArmGroup = new THREE.Group();
        const leftArmUpper = this.createLimb(0.18, 0.4, 0.18, 0x2563eb);
        leftArmUpper.position.y = -0.2;
        leftArmGroup.add(leftArmUpper);
        
        const leftArmLower = this.createLimb(0.15, 0.35, 0.15, 0x1d4ed8);
        leftArmLower.position.y = -0.55;
        leftArmGroup.add(leftArmLower);
        
        // Left glove
        const leftGlove = this.createGlove(0x4a3728);
        leftGlove.position.set(0, -0.8, 0);
        leftArmGroup.add(leftGlove);
        
        leftArmGroup.position.set(-0.5, 1.7, 0); // Arm position
        this.mesh.add(leftArmGroup);
        this.leftArm = leftArmGroup;
        
        // Right arm (sword arm)
        const rightArmGroup = new THREE.Group();
        const rightArmUpper = this.createLimb(0.18, 0.4, 0.18, 0x2563eb);
        rightArmUpper.position.y = -0.2;
        rightArmGroup.add(rightArmUpper);
        
        const rightArmLower = this.createLimb(0.15, 0.35, 0.15, 0x1d4ed8);
        rightArmLower.position.y = -0.55;
        rightArmGroup.add(rightArmLower);
        
        // Right glove
        const rightGlove = this.createGlove(0x4a3728);
        rightGlove.position.set(0, -0.8, 0);
        rightArmGroup.add(rightGlove);
        
        // Sword attached to right hand - rotated to point FORWARD (+Z)
        this.sword = this.createSword();
        this.sword.position.set(0, -0.5, 0.15);
        this.sword.rotation.x = Math.PI / 2.5; // Angled up and forward
        rightArmGroup.add(this.sword);
        
        rightArmGroup.position.set(0.5, 1.7, 0); // Arm position
        this.mesh.add(rightArmGroup);
        this.rightArm = rightArmGroup;
        
        // === HEAD ===
        const headGroup = new THREE.Group();
        
        // Base head
        const headGeo = new THREE.BoxGeometry(0.5, 0.55, 0.45);
        const skinMat = new THREE.MeshStandardMaterial({ 
            color: 0xfcd9b6,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeo, skinMat);
        head.castShadow = true;
        headGroup.add(head);
        
        // Hair
        const hairGeo = new THREE.BoxGeometry(0.54, 0.25, 0.48);
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.set(0, 0.2, -0.02);
        hair.castShadow = true;
        headGroup.add(hair);
        
        // Hair front spikes
        const spikeGeo = new THREE.ConeGeometry(0.08, 0.2, 4);
        const spike1 = new THREE.Mesh(spikeGeo, hairMat);
        spike1.position.set(-0.12, 0.35, 0.1);
        spike1.rotation.x = 0.3;
        headGroup.add(spike1);
        
        const spike2 = new THREE.Mesh(spikeGeo, hairMat);
        spike2.position.set(0.12, 0.38, 0.08);
        spike2.rotation.x = 0.2;
        headGroup.add(spike2);
        
        const spike3 = new THREE.Mesh(spikeGeo, hairMat);
        spike3.position.set(0, 0.4, 0.05);
        spike3.rotation.x = 0.4;
        headGroup.add(spike3);
        
        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const eyePupilMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
        
        // Left eye
        const leftEyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
        leftEyeWhite.position.set(-0.12, 0, 0.22);
        leftEyeWhite.scale.z = 0.5;
        headGroup.add(leftEyeWhite);
        
        const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), eyePupilMat);
        leftPupil.position.set(-0.12, 0, 0.26);
        headGroup.add(leftPupil);
        
        // Right eye
        const rightEyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
        rightEyeWhite.position.set(0.12, 0, 0.22);
        rightEyeWhite.scale.z = 0.5;
        headGroup.add(rightEyeWhite);
        
        const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), eyePupilMat);
        rightPupil.position.set(0.12, 0, 0.26);
        headGroup.add(rightPupil);
        
        // Eyebrows
        const browGeo = new THREE.BoxGeometry(0.12, 0.03, 0.05);
        const browMat = new THREE.MeshStandardMaterial({ color: 0x1c1917 });
        
        const leftBrow = new THREE.Mesh(browGeo, browMat);
        leftBrow.position.set(-0.12, 0.12, 0.22);
        leftBrow.rotation.z = 0.15;
        headGroup.add(leftBrow);
        
        const rightBrow = new THREE.Mesh(browGeo, browMat);
        rightBrow.position.set(0.12, 0.12, 0.22);
        rightBrow.rotation.z = -0.15;
        headGroup.add(rightBrow);
        
        // Mouth
        const mouthGeo = new THREE.BoxGeometry(0.12, 0.03, 0.02);
        const mouthMat = new THREE.MeshStandardMaterial({ color: 0xc2410c });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, -0.15, 0.23);
        headGroup.add(mouth);
        
        // Headband
        const headbandGeo = new THREE.BoxGeometry(0.54, 0.08, 0.48);
        const headbandMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
        const headband = new THREE.Mesh(headbandGeo, headbandMat);
        headband.position.set(0, 0.08, 0);
        headGroup.add(headband);
        
        // Headband tail
        const tailGeo = new THREE.BoxGeometry(0.08, 0.25, 0.02);
        const tail1 = new THREE.Mesh(tailGeo, headbandMat);
        tail1.position.set(-0.1, 0, -0.26);
        tail1.rotation.x = 0.3;
        headGroup.add(tail1);
        
        const tail2 = new THREE.Mesh(tailGeo, headbandMat);
        tail2.position.set(0.1, -0.05, -0.28);
        tail2.rotation.x = 0.5;
        headGroup.add(tail2);
        
        headGroup.position.y = 2.2; // Head position
        this.mesh.add(headGroup);
        this.headGroup = headGroup;
        
        // Shadow disc at feet (for cleaner ground shadow)
        const shadowGeo = new THREE.CircleGeometry(0.5, 16);
        const shadowMat = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            transparent: true, 
            opacity: 0.3 
        });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.02; // At feet level (local y=0)
        this.mesh.add(shadow);
        this.shadowDisc = shadow;
        
        // Set initial position (feet at ground level y=0)
        this.mesh.position.set(0, 0, 5);
        this.scene.add(this.mesh);
    }

    
    createLimb(width, height, depth, color) {
        const geo = new THREE.BoxGeometry(width, height, depth);
        const mat = new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.6
        });
        const limb = new THREE.Mesh(geo, mat);
        limb.castShadow = true;
        return limb;
    }
    
    createBoot(color) {
        const bootGroup = new THREE.Group();
        
        // Boot main
        const bootGeo = new THREE.BoxGeometry(0.2, 0.18, 0.28);
        const bootMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 });
        const boot = new THREE.Mesh(bootGeo, bootMat);
        boot.castShadow = true;
        bootGroup.add(boot);
        
        // Boot sole
        const soleGeo = new THREE.BoxGeometry(0.22, 0.05, 0.32);
        const soleMat = new THREE.MeshStandardMaterial({ color: 0x1c1917 });
        const sole = new THREE.Mesh(soleGeo, soleMat);
        sole.position.set(0, -0.1, 0.02);
        bootGroup.add(sole);
        
        return bootGroup;
    }
    
    createGlove(color) {
        const gloveGroup = new THREE.Group();
        
        const gloveGeo = new THREE.BoxGeometry(0.14, 0.15, 0.12);
        const gloveMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 });
        const glove = new THREE.Mesh(gloveGeo, gloveMat);
        glove.castShadow = true;
        gloveGroup.add(glove);
        
        // Fingers hint
        const fingerGeo = new THREE.BoxGeometry(0.12, 0.06, 0.1);
        const fingers = new THREE.Mesh(fingerGeo, gloveMat);
        fingers.position.set(0, -0.08, 0.02);
        gloveGroup.add(fingers);
        
        return gloveGroup;
    }
    
    createSword() {
        const swordGroup = new THREE.Group();
        
        // Blade - using BoxGeometry for cleaner look, pointing UP (+Y)
        const bladeGeo = new THREE.BoxGeometry(0.08, 1.8, 0.025);
        const bladeMat = new THREE.MeshStandardMaterial({ 
            color: 0xe5e7eb,
            metalness: 0.9,
            roughness: 0.1
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 1.05; // Blade extends upward from guard
        blade.castShadow = true;
        swordGroup.add(blade);
        
        // Blade tip (pointed)
        const tipGeo = new THREE.ConeGeometry(0.04, 0.25, 4);
        const tip = new THREE.Mesh(tipGeo, bladeMat);
        tip.position.y = 2.1;
        tip.rotation.y = Math.PI / 4;
        tip.castShadow = true;
        swordGroup.add(tip);
        
        // Blade edge glow (on the front edge)
        const edgeGeo = new THREE.BoxGeometry(0.01, 1.8, 0.03);
        const edgeMat = new THREE.MeshStandardMaterial({ 
            color: 0x60a5fa,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.5
        });
        const edge = new THREE.Mesh(edgeGeo, edgeMat);
        edge.position.set(0, 1.05, 0.02);
        swordGroup.add(edge);
        
        // Guard (crossguard)
        const guardGeo = new THREE.BoxGeometry(0.3, 0.06, 0.06);
        const guardMat = new THREE.MeshStandardMaterial({ 
            color: 0xfbbf24,
            metalness: 0.7,
            roughness: 0.3
        });
        const guard = new THREE.Mesh(guardGeo, guardMat);
        guard.position.y = 0.12;
        guard.castShadow = true;
        swordGroup.add(guard);
        
        // Guard end caps
        const capGeo = new THREE.SphereGeometry(0.035, 6, 6);
        const leftCap = new THREE.Mesh(capGeo, guardMat);
        leftCap.position.set(-0.15, 0.12, 0);
        swordGroup.add(leftCap);
        const rightCap = new THREE.Mesh(capGeo, guardMat);
        rightCap.position.set(0.15, 0.12, 0);
        swordGroup.add(rightCap);
        
        // Guard gem (center front)
        const gemGeo = new THREE.OctahedronGeometry(0.04, 0);
        const gemMat = new THREE.MeshStandardMaterial({ 
            color: 0xef4444,
            emissive: 0xdc2626,
            emissiveIntensity: 0.5
        });
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(0, 0.12, 0.05);
        gem.rotation.y = Math.PI / 4;
        swordGroup.add(gem);
        
        // Handle
        const handleGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.22, 8);
        const handleMat = new THREE.MeshStandardMaterial({ 
            color: 0x78350f,
            roughness: 0.9
        });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = -0.02;
        handle.castShadow = true;
        swordGroup.add(handle);
        
        // Handle leather wraps
        const wrapMat = new THREE.MeshStandardMaterial({ color: 0x1c1917 });
        for (let i = 0; i < 3; i++) {
            const wrapGeo = new THREE.TorusGeometry(0.042, 0.01, 4, 8);
            const wrap = new THREE.Mesh(wrapGeo, wrapMat);
            wrap.position.y = -0.08 + i * 0.06;
            wrap.rotation.x = Math.PI / 2;
            swordGroup.add(wrap);
        }
        
        // Pommel
        const pommelGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const pommelMat = new THREE.MeshStandardMaterial({ 
            color: 0xfbbf24,
            metalness: 0.7,
            roughness: 0.3
        });
        const pommel = new THREE.Mesh(pommelGeo, pommelMat);
        pommel.position.y = -0.16;
        pommel.castShadow = true;
        swordGroup.add(pommel);
        
        return swordGroup;
    }

    
    update(delta, moveInput, platforms, arenaBounds, obstacles = []) {
        this.isMoving = moveInput.x !== 0 || moveInput.z !== 0;
        
        // Apply movement
        this.mesh.position.x += moveInput.x * this.moveSpeed * delta;
        this.mesh.position.z += moveInput.z * this.moveSpeed * delta;
        
        // Rotate to face movement direction
        if (this.isMoving) {
            const angle = Math.atan2(moveInput.x, moveInput.z);
            this.mesh.rotation.y = angle;
        }
        
        // Gravity
        this.velocity.y -= 30 * delta;
        this.mesh.position.y += this.velocity.y * delta;
        
        // Platform collision
        this.isGrounded = false;
        for (const platform of platforms) {
            const b = platform.bounds;
            if (this.mesh.position.x >= b.minX && this.mesh.position.x <= b.maxX &&
                this.mesh.position.z >= b.minZ && this.mesh.position.z <= b.maxZ) {
                if (this.mesh.position.y <= b.y && this.mesh.position.y >= b.y - 1.5) {
                    if (this.velocity.y <= 0) {
                        this.mesh.position.y = b.y;
                        this.velocity.y = 0;
                        this.isGrounded = true;
                    }
                }
            }
        }
        
        // Obstacle collision (circular)
        const playerRadius = 0.5;
        for (const obs of obstacles) {
            const dx = this.mesh.position.x - obs.x;
            const dz = this.mesh.position.z - obs.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const minDist = playerRadius + obs.radius;
            
            if (dist < minDist && dist > 0) {
                // Push player out
                const pushX = (dx / dist) * (minDist - dist);
                const pushZ = (dz / dist) * (minDist - dist);
                this.mesh.position.x += pushX;
                this.mesh.position.z += pushZ;
            }
        }
        
        // Arena bounds
        this.mesh.position.x = Math.max(arenaBounds.minX, Math.min(arenaBounds.maxX, this.mesh.position.x));
        this.mesh.position.z = Math.max(arenaBounds.minZ, Math.min(arenaBounds.maxZ, this.mesh.position.z));
        
        // Animate
        this.animate(delta);
        
        return this.mesh.position.y < -10; // Return true if fell
    }
    
    animate(delta) {
        this.animationTime += delta * 8;
        
        if (this.isMoving && this.isGrounded) {
            // Walking animation
            const swing = Math.sin(this.animationTime) * 0.4;
            
            // Leg swing
            if (this.leftLegUpper) {
                this.leftLegUpper.rotation.x = swing;
                this.leftBoot.position.z = 0.05 + Math.sin(this.animationTime) * 0.1;
            }
            if (this.rightLegUpper) {
                this.rightLegUpper.rotation.x = -swing;
                this.rightBoot.position.z = 0.05 - Math.sin(this.animationTime) * 0.1;
            }
            
            // Arm swing (opposite to legs)
            if (this.leftArm) {
                this.leftArm.rotation.x = -swing * 0.5;
            }
            if (this.rightArm && !this.isAttacking) {
                this.rightArm.rotation.x = swing * 0.3;
            }
            
            // Slight body bob
            if (this.torsoGroup) {
                this.torsoGroup.position.y = 1.5 + Math.abs(Math.sin(this.animationTime * 2)) * 0.03;
            }
        } else {
            // Idle - reset to neutral
            if (this.leftLegUpper) this.leftLegUpper.rotation.x *= 0.9;
            if (this.rightLegUpper) this.rightLegUpper.rotation.x *= 0.9;
            if (this.leftArm) this.leftArm.rotation.x *= 0.9;
            if (this.rightArm && !this.isAttacking) this.rightArm.rotation.x *= 0.9;
            
            // Idle breathing
            if (this.torsoGroup) {
                this.torsoGroup.position.y = 1.5 + Math.sin(this.animationTime * 0.5) * 0.02;
            }
        }
    }
    
    jump() {
        if (this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            return true;
        }
        return false;
    }
    
    attack(callback) {
        if (this.isAttacking) return false;
        this.isAttacking = true;
        
        // Store original rotations
        const origArmX = this.rightArm.rotation.x;
        const origArmZ = this.rightArm.rotation.z;
        
        // Wind up (arm raised back)
        this.rightArm.rotation.x = -0.8;
        this.rightArm.rotation.z = 0.5;
        
        // Swing forward after brief wind-up
        setTimeout(() => {
            this.rightArm.rotation.x = 0.6; // Swing forward
            this.rightArm.rotation.z = -0.3;
            
            // Trigger hit detection at swing
            if (callback) callback();
        }, 100);
        
        // Return to idle
        setTimeout(() => {
            this.rightArm.rotation.x = origArmX;
            this.rightArm.rotation.z = origArmZ;
            this.isAttacking = false;
        }, 350);
        
        return true;
    }
    
    takeDamage(amount) {
        this.health -= amount;
        this.health = Math.max(0, this.health);
        return this.health <= 0;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    reset() {
        this.mesh.position.set(0, 0, 5);
        this.velocity = { x: 0, y: 0, z: 0 };
        this.health = this.maxHealth;
        this.isGrounded = false;
        this.isAttacking = false;
    }
    
    getPosition() {
        return this.mesh.position;
    }
    
    getAttackRange() {
        return 3.5;
    }
}
