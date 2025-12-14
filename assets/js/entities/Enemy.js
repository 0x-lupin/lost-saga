// Enemy Module - Lost Saga
// Zombie Enemy

export class Enemy {
    constructor(scene, x, z, id, config = {}) {
        this.scene = scene;
        this.mesh = null;
        this.id = id;
        
        // Configurable stats with defaults for backward compatibility
        const defaults = {
            size: 1.0,
            health: 30,
            attackDamage: 10,
            speed: 1.5 + Math.random() * 0.5,
            lungeMultiplier: 1.5,
            windUpDuration: 0.5
        };
        const settings = { ...defaults, ...config };
        
        // Apply settings
        this.size = settings.size;
        this.health = settings.health;
        this.maxHealth = settings.health;
        this.speed = settings.speed;
        this.attackDamage = settings.attackDamage;
        
        // Physical properties (all derived from size)
        this.collisionRadius = 0.5 * this.size;  // Body radius
        this.armReach = 0.5 * this.size;         // Arms reach as far as body radius
        this.attackRange = this.collisionRadius + this.armReach; // = size (center to fingertips)
        this.lungeRange = this.attackRange * settings.lungeMultiplier;
        this.mass = this.size * this.size;
        this.playerRadius = 0.5; // Updated in update(), default to standard player

        // Attack state
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.distanceToPlayer = Infinity; // Updated each frame in update()
        
        // Wind-up attack state
        this.isWindingUp = false;
        this.attackInterrupted = false;
        this.windUpProgress = 0;
        this.windUpDuration = settings.windUpDuration;
        this.onAttackHit = null;
        
        // Spawn animation state
        this.isSpawning = true;
        this.spawnProgress = 0;
        this.spawnDuration = 1.2; // seconds to rise from ground
        
        // Animation state
        this.animTime = Math.random() * Math.PI * 2;
        
        this.create(x, z);
        this.startSpawnAnimation();
    }
    
    create(x, z) {
        this.mesh = new THREE.Group();
        
        // Zombie colors
        const skinColor = 0x6b8e6b; // Greenish dead skin
        const clothColor = 0x3d3d3d; // Torn dark clothes (shirt)
        const pantsColor = 0x4a3728; // Dirty brown torn pants
        const darkSkin = 0x4a6b4a;
        
        // === LEGS ===
        const legGroup = new THREE.Group();
        
        // Left leg (torn pants)
        const leftLeg = this.createLimb(0.18, 0.5, 0.18, pantsColor);
        leftLeg.position.set(-0.15, -0.25, 0);
        legGroup.add(leftLeg);
        this.leftLeg = leftLeg;
        
        // Right leg
        const rightLeg = this.createLimb(0.18, 0.5, 0.18, pantsColor);
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
        
        torsoGroup.position.y = 0.95; // Torso position (bottom touches leg top at y=0.6)
        this.mesh.add(torsoGroup);
        this.torsoGroup = torsoGroup;
        
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
        
        leftArmGroup.position.set(-0.4, 0.15, 0); // Arm position (relative to torso)
        leftArmGroup.rotation.x = -0.8; // Arms reaching forward
        torsoGroup.add(leftArmGroup); // Attach to torso so it moves with torso
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
        
        rightArmGroup.position.set(0.4, 0.15, 0); // Arm position (relative to torso)
        rightArmGroup.rotation.x = -0.8;
        torsoGroup.add(rightArmGroup); // Attach to torso so it moves with torso
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
        
        headGroup.position.y = 0.55; // Head position (relative to torso)
        headGroup.rotation.z = 0.15; // Tilted head
        torsoGroup.add(headGroup); // Attach to torso so it moves with torso
        this.headGroup = headGroup;
        
        this.mesh.position.set(x, 0, z);
        
        // Apply size scaling
        if (this.size !== 1.0) {
            this.mesh.scale.set(this.size, this.size, this.size);
        }
        
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
    
    startSpawnAnimation() {
        this.isSpawning = true;
        this.spawnProgress = 0;
        
        // Initial pose - zombie underground
        if (this.leftArm) this.leftArm.rotation.x = -1.5;
        if (this.rightArm) this.rightArm.rotation.x = -1.5;
        this.mesh.position.y = -1.8;
        this.mesh.rotation.x = 0.3;
    }
    
    updateSpawnAnimation(delta) {
        if (!this.isSpawning) return false;
        
        this.spawnProgress += delta;
        const progress = Math.min(this.spawnProgress / this.spawnDuration, 1);
        
        // Ease out - slow down as zombie emerges
        const easeOut = 1 - Math.pow(1 - progress, 2);
        
        // Rise from y=-1.8 to y=0
        this.mesh.position.y = -1.8 + (1.8 * easeOut);
        
        // Arms burst out first, reaching upward
        if (this.leftArm) this.leftArm.rotation.x = -1.5 + (0.7 * progress);
        if (this.rightArm) this.rightArm.rotation.x = -1.5 + (0.7 * progress);
        
        // Slight body rotation as emerging
        this.mesh.rotation.x = (1 - progress) * 0.3;
        
        if (progress >= 1) {
            this.isSpawning = false;
            this.mesh.position.y = 0;
            this.mesh.rotation.x = 0;
            return true; // Spawn complete
        }
        
        return false; // Still spawning
    }
    
    update(delta, playerPosition, arenaBounds, obstacles = [], enemies = [], playerRadius = 0.5, playerMass = 1.0) {
        // Store player radius for canAttack() check
        this.playerRadius = playerRadius;
        
        // Handle spawn animation
        if (this.isSpawning) {
            this.updateSpawnAnimation(delta);
            return playerPosition.distanceTo(this.mesh.position);
        }
        
        const direction = new THREE.Vector3()
            .subVectors(playerPosition, this.mesh.position)
            .normalize();
        
        const distance = playerPosition.distanceTo(this.mesh.position);
        
        // Shambling movement (stop during wind-up and attack)
        if (distance > this.attackRange && !this.isAttacking && !this.isWindingUp) {
            this.mesh.position.x += direction.x * this.speed * delta;
            this.mesh.position.z += direction.z * this.speed * delta;
        }
        
        // Update wind-up animation
        this.updateWindUp(delta);
        
        // Face player
        this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
        
        // Keep on ground
        this.mesh.position.y = 0;
        
        // Arena bounds
        this.mesh.position.x = Math.max(arenaBounds.minX, Math.min(arenaBounds.maxX, this.mesh.position.x));
        this.mesh.position.z = Math.max(arenaBounds.minZ, Math.min(arenaBounds.maxZ, this.mesh.position.z));
        
        // Collision with obstacles (environment)
        for (const obs of obstacles) {
            const dx = this.mesh.position.x - obs.x;
            const dz = this.mesh.position.z - obs.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const minDist = this.collisionRadius + obs.radius;
            if (dist < minDist && dist > 0) {
                const pushX = (dx / dist) * (minDist - dist);
                const pushZ = (dz / dist) * (minDist - dist);
                this.mesh.position.x += pushX;
                this.mesh.position.z += pushZ;
            }
        }
        
        // Collision with other enemies (mass-based push)
        for (const other of enemies) {
            if (other === this || other.isDying || other.isSpawning) continue;
            const dx = this.mesh.position.x - other.mesh.position.x;
            const dz = this.mesh.position.z - other.mesh.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const minDist = this.collisionRadius + other.collisionRadius;
            if (dist < minDist && dist > 0) {
                // Push based on mass ratio (heavier pushes lighter more)
                const totalMass = this.mass + other.mass;
                const pushRatio = other.mass / totalMass;
                const pushX = (dx / dist) * (minDist - dist) * pushRatio;
                const pushZ = (dz / dist) * (minDist - dist) * pushRatio;
                this.mesh.position.x += pushX;
                this.mesh.position.z += pushZ;
            }
        }
        
        // Collision with player (mass-based push)
        const dx = this.mesh.position.x - playerPosition.x;
        const dz = this.mesh.position.z - playerPosition.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const minDist = this.collisionRadius + playerRadius;
        if (dist < minDist && dist > 0) {
            const totalMass = this.mass + playerMass;
            const pushRatio = playerMass / totalMass;
            const pushX = (dx / dist) * (minDist - dist) * pushRatio;
            const pushZ = (dz / dist) * (minDist - dist) * pushRatio;
            this.mesh.position.x += pushX;
            this.mesh.position.z += pushZ;
        }
        
        // Attack cooldown
        this.attackCooldown -= delta;
        
        // Shambling animation
        this.animate(delta);
        
        // Store distance for canAttack() check
        this.distanceToPlayer = distance;
        
        return distance;
    }
    
    animate(delta) {
        this.animTime += delta * 4;
        const sway = Math.sin(this.animTime);
        
        // Leg shamble (not during wind-up/attack)
        if (!this.isWindingUp && !this.isAttacking) {
            if (this.leftLeg) this.leftLeg.rotation.x = sway * 0.3;
            if (this.rightLeg) this.rightLeg.rotation.x = -sway * 0.3;
            
            // Zombie torso shamble - exaggerated swaying and lurching
            if (this.torsoGroup) {
                // Side-to-side sway (opposite to legs for zombie lurch)
                this.torsoGroup.rotation.z = sway * 0.15;
                // Forward hunch with bob
                this.torsoGroup.rotation.x = 0.2 + Math.abs(sway) * 0.1;
                // Slight twist as zombie shambles
                this.torsoGroup.rotation.y = sway * 0.08;
                // Vertical bob (lurching up and down)
                this.torsoGroup.position.y = 0.95 + Math.abs(sway) * 0.05;
            }
        }
        
        // Wind-up animation
        if (this.isWindingUp) {
            const progress = this.windUpProgress;
            const shake = Math.sin(this.animTime * 15) * 0.1 * progress; // Trembling increases
            
            // Arms raise back progressively
            const armRaise = -0.8 + (progress * 1.2); // From -0.8 to 0.4 (raised back)
            if (this.leftArm) {
                this.leftArm.rotation.x = armRaise;
                this.leftArm.rotation.z = -progress * 0.4 + shake;
            }
            if (this.rightArm) {
                this.rightArm.rotation.x = armRaise;
                this.rightArm.rotation.z = progress * 0.4 + shake;
            }
            
            // Body leans back then forward
            this.mesh.rotation.x = -progress * 0.2;
            
            // Torso tenses up during wind-up
            if (this.torsoGroup) {
                this.torsoGroup.rotation.z = 0;
                this.torsoGroup.rotation.x = 0.1 + progress * 0.2;
                this.torsoGroup.rotation.y = 0;
                this.torsoGroup.position.y = 0.95;
            }
            
            // Head tilts up (looking at player menacingly)
            if (this.headGroup) {
                this.headGroup.rotation.x = -progress * 0.3;
                this.headGroup.rotation.z = shake;
            }
        } else if (!this.isAttacking) {
            // Normal arm sway (zombie reaching)
            if (this.leftArm) this.leftArm.rotation.x = -0.8 + sway * 0.15;
            if (this.rightArm) this.rightArm.rotation.x = -0.8 - sway * 0.15;
            
            // Reset body rotation
            this.mesh.rotation.x *= 0.9;
            
            // Torso slowly returns to hunched idle
            if (this.torsoGroup) {
                this.torsoGroup.rotation.z *= 0.9;
                this.torsoGroup.rotation.x = 0.2 + Math.sin(this.animTime * 0.3) * 0.05; // Subtle breathing
                this.torsoGroup.rotation.y *= 0.9;
                this.torsoGroup.position.y = 0.95;
            }
            
            // Head bob
            if (this.headGroup) {
                this.headGroup.rotation.x = Math.sin(this.animTime * 0.5) * 0.1;
                this.headGroup.rotation.z *= 0.9;
            }
        }
    }
    
    canAttack() {
        return this.attackCooldown <= 0 && 
               !this.isAttacking && 
               !this.isSpawning && 
               !this.isWindingUp &&
               this.distanceToPlayer <= this.attackRange + this.playerRadius;
    }
    
    attack(onHitCallback) {
        this.attackCooldown = 1.5;
        this.isWindingUp = true;
        this.windUpProgress = 0;
        this.attackInterrupted = false;
        this.onAttackHit = onHitCallback;
    }
    
    startWindUp() {
        // Not used in Lost Saga - attack() handles it
        return false;
    }
    
    updateWindUp(delta) {
        if (!this.isWindingUp) return;
        
        this.windUpProgress += delta / this.windUpDuration;
        
        if (this.windUpProgress >= 1) {
            this.isWindingUp = false;
            this.windUpProgress = 0;
            
            if (this.attackInterrupted || this.isDying) {
                this.resetArmPosition();
                this.mesh.rotation.x = 0;
                return;
            }
            
            // Execute the attack lunge
            this.isAttacking = true;
            
            // Lunge forward with arms
            if (this.leftArm) this.leftArm.rotation.x = -1.5;
            if (this.rightArm) this.rightArm.rotation.x = -1.5;
            if (this.leftArm) this.leftArm.rotation.z = 0;
            if (this.rightArm) this.rightArm.rotation.z = 0;
            
            // Body lunges forward
            this.mesh.rotation.x = 0.3;
            
            // Notify that attack is landing now
            if (this.onAttackHit) this.onAttackHit(this.attackDamage);
            
            // Return to idle after lunge
            setTimeout(() => {
                this.resetArmPosition();
                this.mesh.rotation.x = 0;
                this.isAttacking = false;
            }, 250);
        }
    }
    
    cancelWindUp() {
        // Wrapper for interruptAttack
        this.interruptAttack();
        this.resetArmPosition();
    }
    
    resetArmPosition() {
        if (this.leftArm) this.leftArm.rotation.x = -0.8;
        if (this.rightArm) this.rightArm.rotation.x = -0.8;
        if (this.leftArm) this.leftArm.rotation.z = 0;
        if (this.rightArm) this.rightArm.rotation.z = 0;
    }
    
    interruptAttack() {
        if (this.isWindingUp) {
            this.attackInterrupted = true;
            this.onAttackHit = null;
        }
    }
    
    takeDamage(amount, knockbackDir) {
        // Invulnerable while spawning
        if (this.isSpawning) return false;
        
        // Interrupt wind-up if hit
        this.interruptAttack();
        
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
