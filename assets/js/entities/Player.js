// Player Module - Lost Saga
// Realistic warrior character with detailed model

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
        
        // Knockback state
        this.knockbackVelocity = { x: 0, z: 0 };
        this.knockbackFriction = 8;
        
        // Colors
        this.colors = {
            skin: 0xd4a574,
            skinDark: 0xc49464,
            hair: 0x2c1810,
            armor: 0x4a5568,
            armorLight: 0x718096,
            armorDark: 0x2d3748,
            leather: 0x5c4033,
            leatherDark: 0x3d2817,
            gold: 0xd4af37,
            cloth: 0x1a365d,
            clothLight: 0x2c5282
        };
        
        this.create();
    }
    
    create() {
        this.mesh = new THREE.Group();
        
        this.createLegs();
        this.createTorso();
        this.createArms();
        this.createHead();
        this.createShadow();
        
        // Set initial position (feet at ground level y=0)
        this.mesh.position.set(0, 0, 5);
        this.scene.add(this.mesh);
    }
    
    createLegs() {
        const legGroup = new THREE.Group();
        
        // Materials
        const armorMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armorDark, roughness: 0.4, metalness: 0.6 
        });
        const thighPlateMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armor, roughness: 0.3, metalness: 0.7 
        });
        const kneeMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armorLight, roughness: 0.3, metalness: 0.6 
        });
        const bootMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.leather, roughness: 0.7 
        });
        const bootDarkMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.leatherDark, roughness: 0.8 
        });
        
        // Geometries (shared)
        const thighGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.4, 12);
        const thighPlateGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.25, 8, 1, false, 0, Math.PI);
        const kneeGeo = new THREE.SphereGeometry(0.1, 10, 10);
        const kneeCapGeo = new THREE.SphereGeometry(0.08, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const shinGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.38, 10);
        const shinGuardGeo = new THREE.BoxGeometry(0.12, 0.3, 0.06);
        
        // === LEFT LEG ===
        const leftLegGroup = new THREE.Group();
        
        // Upper thigh
        const leftThigh = new THREE.Mesh(thighGeo, armorMat);
        leftThigh.castShadow = true;
        leftLegGroup.add(leftThigh);
        
        // Thigh armor plate
        const leftThighPlate = new THREE.Mesh(thighPlateGeo, thighPlateMat);
        leftThighPlate.position.z = 0.02;
        leftThighPlate.castShadow = true;
        leftLegGroup.add(leftThighPlate);
        
        // Knee joint
        const leftKnee = new THREE.Mesh(kneeGeo, kneeMat);
        leftKnee.position.y = -0.25;
        leftKnee.castShadow = true;
        leftLegGroup.add(leftKnee);
        
        // Knee cap armor
        const leftKneeCap = new THREE.Mesh(kneeCapGeo, thighPlateMat);
        leftKneeCap.position.set(0, -0.25, 0.06);
        leftKneeCap.rotation.x = -Math.PI / 2;
        leftLegGroup.add(leftKneeCap);
        
        // Lower leg (shin)
        const leftShin = new THREE.Mesh(shinGeo, armorMat);
        leftShin.position.y = -0.45;
        leftShin.castShadow = true;
        leftLegGroup.add(leftShin);
        
        // Shin guard
        const leftShinGuard = new THREE.Mesh(shinGuardGeo, thighPlateMat);
        leftShinGuard.position.set(0, -0.42, 0.06);
        leftShinGuard.castShadow = true;
        leftLegGroup.add(leftShinGuard);
        
        // Left boot (attached to leg group so it moves with leg)
        const leftBoot = this.createBoot(bootMat, bootDarkMat);
        leftBoot.position.set(0, -0.65, 0.02);
        leftLegGroup.add(leftBoot);
        this.leftBoot = leftBoot;
        
        leftLegGroup.position.set(-0.15, -0.2, 0);
        legGroup.add(leftLegGroup);
        this.leftLeg = leftLegGroup;
        
        // === RIGHT LEG ===
        const rightLegGroup = new THREE.Group();
        
        // Upper thigh
        const rightThigh = new THREE.Mesh(thighGeo, armorMat);
        rightThigh.castShadow = true;
        rightLegGroup.add(rightThigh);
        
        // Thigh armor plate
        const rightThighPlate = new THREE.Mesh(thighPlateGeo, thighPlateMat);
        rightThighPlate.position.z = 0.02;
        rightThighPlate.castShadow = true;
        rightLegGroup.add(rightThighPlate);
        
        // Knee joint
        const rightKnee = new THREE.Mesh(kneeGeo, kneeMat);
        rightKnee.position.y = -0.25;
        rightKnee.castShadow = true;
        rightLegGroup.add(rightKnee);
        
        // Knee cap armor
        const rightKneeCap = new THREE.Mesh(kneeCapGeo, thighPlateMat);
        rightKneeCap.position.set(0, -0.25, 0.06);
        rightKneeCap.rotation.x = -Math.PI / 2;
        rightLegGroup.add(rightKneeCap);
        
        // Lower leg (shin)
        const rightShin = new THREE.Mesh(shinGeo, armorMat);
        rightShin.position.y = -0.45;
        rightShin.castShadow = true;
        rightLegGroup.add(rightShin);
        
        // Shin guard
        const rightShinGuard = new THREE.Mesh(shinGuardGeo, thighPlateMat);
        rightShinGuard.position.set(0, -0.42, 0.06);
        rightShinGuard.castShadow = true;
        rightLegGroup.add(rightShinGuard);
        
        // Right boot (attached to leg group)
        const rightBoot = this.createBoot(bootMat, bootDarkMat);
        rightBoot.position.set(0, -0.65, 0.02);
        rightLegGroup.add(rightBoot);
        this.rightBoot = rightBoot;
        
        rightLegGroup.position.set(0.15, -0.2, 0);
        legGroup.add(rightLegGroup);
        this.rightLeg = rightLegGroup;
        
        legGroup.position.y = 0.9;
        this.mesh.add(legGroup);
        this.legGroup = legGroup;
    }

    
    createBoot(bootMat, bootDarkMat) {
        const bootGroup = new THREE.Group();
        
        // Boot ankle
        const ankleGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.12, 10);
        const ankle = new THREE.Mesh(ankleGeo, bootMat);
        ankle.position.y = 0.06;
        ankle.castShadow = true;
        bootGroup.add(ankle);
        
        // Boot main body
        const bootBodyGeo = new THREE.BoxGeometry(0.18, 0.12, 0.26);
        const bootBody = new THREE.Mesh(bootBodyGeo, bootMat);
        bootBody.position.set(0, -0.02, 0.02);
        bootBody.castShadow = true;
        bootGroup.add(bootBody);
        
        // Boot toe cap
        const toeGeo = new THREE.SphereGeometry(0.09, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        const toe = new THREE.Mesh(toeGeo, bootMat);
        toe.position.set(0, -0.04, 0.1);
        toe.rotation.x = Math.PI / 2;
        toe.castShadow = true;
        bootGroup.add(toe);
        
        // Boot sole
        const soleGeo = new THREE.BoxGeometry(0.2, 0.04, 0.3);
        const sole = new THREE.Mesh(soleGeo, bootDarkMat);
        sole.position.set(0, -0.1, 0.02);
        bootGroup.add(sole);
        
        // Boot strap
        const strapGeo = new THREE.TorusGeometry(0.1, 0.015, 6, 12);
        const strapMat = new THREE.MeshStandardMaterial({ color: this.colors.gold, metalness: 0.7, roughness: 0.3 });
        const strap = new THREE.Mesh(strapGeo, strapMat);
        strap.position.y = 0.04;
        strap.rotation.x = Math.PI / 2;
        bootGroup.add(strap);
        
        return bootGroup;
    }
    
    createTorso() {
        const torsoGroup = new THREE.Group();
        
        // === LOWER TORSO (waist/hips) ===
        const waistGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.25, 12);
        const clothMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.cloth, roughness: 0.7 
        });
        const waist = new THREE.Mesh(waistGeo, clothMat);
        waist.position.y = -0.3;
        waist.castShadow = true;
        torsoGroup.add(waist);
        
        // Belt
        const beltGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 24);
        const beltMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.leather, roughness: 0.6 
        });
        const belt = new THREE.Mesh(beltGeo, beltMat);
        belt.position.y = -0.18;
        belt.rotation.x = Math.PI / 2;
        belt.castShadow = true;
        torsoGroup.add(belt);
        
        // Belt buckle
        const buckleGeo = new THREE.BoxGeometry(0.12, 0.1, 0.04);
        const buckleMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.gold, metalness: 0.8, roughness: 0.2 
        });
        const buckle = new THREE.Mesh(buckleGeo, buckleMat);
        buckle.position.set(0, -0.18, 0.32);
        torsoGroup.add(buckle);
        
        // Buckle gem
        const buckleGemGeo = new THREE.OctahedronGeometry(0.025, 0);
        const gemMat = new THREE.MeshStandardMaterial({ 
            color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.4 
        });
        const buckleGem = new THREE.Mesh(buckleGemGeo, gemMat);
        buckleGem.position.set(0, -0.18, 0.35);
        buckleGem.rotation.y = Math.PI / 4;
        torsoGroup.add(buckleGem);
        
        // === MAIN TORSO (chest) ===
        // Core body shape (more anatomical)
        const chestGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.55, 12);
        const armorMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armor, roughness: 0.3, metalness: 0.7 
        });
        const chest = new THREE.Mesh(chestGeo, armorMat);
        chest.castShadow = true;
        torsoGroup.add(chest);
        
        // Chest plate (front armor)
        const chestPlateGeo = new THREE.SphereGeometry(0.35, 12, 8, 0, Math.PI, 0, Math.PI / 2);
        const chestPlateMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armorLight, roughness: 0.25, metalness: 0.8 
        });
        const chestPlate = new THREE.Mesh(chestPlateGeo, chestPlateMat);
        chestPlate.position.set(0, 0.05, 0.08);
        chestPlate.rotation.x = -Math.PI / 2;
        chestPlate.scale.set(0.9, 0.6, 0.8);
        chestPlate.castShadow = true;
        torsoGroup.add(chestPlate);
        
        // Chest plate center ridge
        const ridgeGeo = new THREE.BoxGeometry(0.04, 0.4, 0.08);
        const ridge = new THREE.Mesh(ridgeGeo, chestPlateMat);
        ridge.position.set(0, 0.05, 0.28);
        torsoGroup.add(ridge);
        
        // Pectoral definition (left)
        const pecGeo = new THREE.SphereGeometry(0.12, 8, 6);
        const leftPec = new THREE.Mesh(pecGeo, armorMat);
        leftPec.position.set(-0.12, 0.1, 0.22);
        leftPec.scale.set(1, 0.7, 0.5);
        torsoGroup.add(leftPec);
        
        // Pectoral definition (right)
        const rightPec = new THREE.Mesh(pecGeo, armorMat);
        rightPec.position.set(0.12, 0.1, 0.22);
        rightPec.scale.set(1, 0.7, 0.5);
        torsoGroup.add(rightPec);
        
        // === SHOULDER PAULDRONS ===
        const pauldronMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armorLight, roughness: 0.25, metalness: 0.8 
        });
        
        // Left pauldron
        const leftPauldron = this.createPauldron(pauldronMat);
        leftPauldron.position.set(-0.4, 0.25, 0);
        leftPauldron.rotation.z = Math.PI / 8;
        torsoGroup.add(leftPauldron);
        
        // Right pauldron
        const rightPauldron = this.createPauldron(pauldronMat);
        rightPauldron.position.set(0.4, 0.25, 0);
        rightPauldron.rotation.z = -Math.PI / 8;
        torsoGroup.add(rightPauldron);
        
        // === NECK ===
        const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 10);
        const skinMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.skin, roughness: 0.8 
        });
        const neck = new THREE.Mesh(neckGeo, skinMat);
        neck.position.y = 0.35;
        neck.castShadow = true;
        torsoGroup.add(neck);
        
        // Neck guard (gorget)
        const gorgetGeo = new THREE.TorusGeometry(0.14, 0.03, 8, 16, Math.PI);
        const gorget = new THREE.Mesh(gorgetGeo, armorMat);
        gorget.position.set(0, 0.28, 0.08);
        gorget.rotation.x = Math.PI / 2;
        gorget.rotation.z = Math.PI;
        torsoGroup.add(gorget);
        
        torsoGroup.position.y = 1.45;
        this.mesh.add(torsoGroup);
        this.torsoGroup = torsoGroup;
    }
    
    createPauldron(mat) {
        const pauldronGroup = new THREE.Group();
        
        // Main dome
        const domeGeo = new THREE.SphereGeometry(0.16, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, mat);
        dome.rotation.x = Math.PI;
        dome.castShadow = true;
        pauldronGroup.add(dome);
        
        // Rim
        const rimGeo = new THREE.TorusGeometry(0.16, 0.02, 6, 16);
        const rimMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.gold, metalness: 0.8, roughness: 0.2 
        });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.x = Math.PI / 2;
        pauldronGroup.add(rim);
        
        // Spike
        const spikeGeo = new THREE.ConeGeometry(0.03, 0.12, 6);
        const spike = new THREE.Mesh(spikeGeo, mat);
        spike.position.y = 0.1;
        spike.castShadow = true;
        pauldronGroup.add(spike);
        
        return pauldronGroup;
    }

    
    createArms() {
        const skinMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.skin, roughness: 0.8 
        });
        const armorMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armor, roughness: 0.3, metalness: 0.6 
        });
        const gloveMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.leather, roughness: 0.6 
        });
        
        // === LEFT ARM ===
        const leftArmGroup = new THREE.Group();
        
        // Upper arm
        const upperArmGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.35, 10);
        const leftUpperArm = new THREE.Mesh(upperArmGeo, armorMat);
        leftUpperArm.position.y = -0.18;
        leftUpperArm.castShadow = true;
        leftArmGroup.add(leftUpperArm);
        
        // Bicep armor
        const bicepGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.2, 8, 1, false, 0, Math.PI);
        const leftBicep = new THREE.Mesh(bicepGeo, armorMat);
        leftBicep.position.set(0, -0.12, 0.02);
        leftBicep.castShadow = true;
        leftArmGroup.add(leftBicep);
        
        // Elbow joint
        const elbowGeo = new THREE.SphereGeometry(0.07, 8, 8);
        const leftElbow = new THREE.Mesh(elbowGeo, armorMat);
        leftElbow.position.y = -0.38;
        leftElbow.castShadow = true;
        leftArmGroup.add(leftElbow);
        
        // Forearm
        const forearmGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.3, 10);
        const leftForearm = new THREE.Mesh(forearmGeo, skinMat);
        leftForearm.position.y = -0.55;
        leftForearm.castShadow = true;
        leftArmGroup.add(leftForearm);
        
        // Bracer (forearm armor)
        const bracerGeo = new THREE.CylinderGeometry(0.085, 0.09, 0.18, 8);
        const bracerMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armorLight, roughness: 0.3, metalness: 0.7 
        });
        const leftBracer = new THREE.Mesh(bracerGeo, bracerMat);
        leftBracer.position.y = -0.52;
        leftBracer.castShadow = true;
        leftArmGroup.add(leftBracer);
        
        // Hand/Glove
        const leftHand = this.createHand(gloveMat);
        leftHand.position.y = -0.75;
        leftArmGroup.add(leftHand);
        
        leftArmGroup.position.set(-0.48, 1.65, 0);
        this.mesh.add(leftArmGroup);
        this.leftArm = leftArmGroup;
        
        // === RIGHT ARM (sword arm) ===
        const rightArmGroup = new THREE.Group();
        
        // Upper arm
        const rightUpperArm = new THREE.Mesh(upperArmGeo, armorMat);
        rightUpperArm.position.y = -0.18;
        rightUpperArm.castShadow = true;
        rightArmGroup.add(rightUpperArm);
        
        // Bicep armor
        const rightBicep = new THREE.Mesh(bicepGeo, armorMat);
        rightBicep.position.set(0, -0.12, 0.02);
        rightBicep.castShadow = true;
        rightArmGroup.add(rightBicep);
        
        // Elbow joint
        const rightElbow = new THREE.Mesh(elbowGeo, armorMat);
        rightElbow.position.y = -0.38;
        rightElbow.castShadow = true;
        rightArmGroup.add(rightElbow);
        
        // Forearm
        const rightForearm = new THREE.Mesh(forearmGeo, skinMat);
        rightForearm.position.y = -0.55;
        rightForearm.castShadow = true;
        rightArmGroup.add(rightForearm);
        
        // Bracer
        const rightBracer = new THREE.Mesh(bracerGeo, bracerMat);
        rightBracer.position.y = -0.52;
        rightBracer.castShadow = true;
        rightArmGroup.add(rightBracer);
        
        // Hand/Glove
        const rightHand = this.createHand(gloveMat);
        rightHand.position.y = -0.75;
        rightArmGroup.add(rightHand);
        
        // Sword
        this.sword = this.createSword();
        this.sword.position.set(0, -0.5, 0.12);
        this.sword.rotation.x = Math.PI / 2.5;
        rightArmGroup.add(this.sword);
        
        rightArmGroup.position.set(0.48, 1.65, 0);
        this.mesh.add(rightArmGroup);
        this.rightArm = rightArmGroup;
    }
    
    createHand(mat) {
        const handGroup = new THREE.Group();
        
        // Palm
        const palmGeo = new THREE.BoxGeometry(0.1, 0.08, 0.08);
        const palm = new THREE.Mesh(palmGeo, mat);
        palm.castShadow = true;
        handGroup.add(palm);
        
        // Fingers (4)
        const fingerGeo = new THREE.CylinderGeometry(0.015, 0.012, 0.08, 6);
        for (let i = 0; i < 4; i++) {
            const finger = new THREE.Mesh(fingerGeo, mat);
            finger.position.set(-0.03 + i * 0.02, -0.06, 0.02);
            finger.rotation.x = 0.3;
            handGroup.add(finger);
        }
        
        // Thumb
        const thumb = new THREE.Mesh(fingerGeo, mat);
        thumb.position.set(-0.06, -0.02, 0.02);
        thumb.rotation.z = Math.PI / 3;
        thumb.rotation.x = 0.2;
        handGroup.add(thumb);
        
        // Knuckle guard
        const knuckleGeo = new THREE.BoxGeometry(0.11, 0.03, 0.04);
        const knuckleMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.armorLight, metalness: 0.6, roughness: 0.3 
        });
        const knuckle = new THREE.Mesh(knuckleGeo, knuckleMat);
        knuckle.position.set(0, -0.02, 0.05);
        handGroup.add(knuckle);
        
        return handGroup;
    }
    
    createHead() {
        const headGroup = new THREE.Group();
        
        const skinMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.skin, roughness: 0.8 
        });
        const skinDarkMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.skinDark, roughness: 0.8 
        });
        const hairMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.hair, roughness: 0.9 
        });
        
        // === HEAD SHAPE ===
        // Main skull (more rounded)
        const skullGeo = new THREE.SphereGeometry(0.24, 14, 12);
        const skull = new THREE.Mesh(skullGeo, skinMat);
        skull.scale.set(1, 1.1, 1);
        skull.castShadow = true;
        headGroup.add(skull);
        
        // Jaw/chin area
        const jawGeo = new THREE.SphereGeometry(0.18, 10, 8);
        const jaw = new THREE.Mesh(jawGeo, skinMat);
        jaw.position.set(0, -0.12, 0.06);
        jaw.scale.set(0.9, 0.7, 0.8);
        jaw.castShadow = true;
        headGroup.add(jaw);
        
        // Chin
        const chinGeo = new THREE.SphereGeometry(0.06, 8, 6);
        const chin = new THREE.Mesh(chinGeo, skinMat);
        chin.position.set(0, -0.2, 0.12);
        headGroup.add(chin);
        
        // === FACIAL FEATURES ===
        // Brow ridge
        const browRidgeGeo = new THREE.BoxGeometry(0.35, 0.04, 0.08);
        const browRidge = new THREE.Mesh(browRidgeGeo, skinDarkMat);
        browRidge.position.set(0, 0.08, 0.2);
        headGroup.add(browRidge);
        
        // Eye sockets (darker areas)
        const socketGeo = new THREE.SphereGeometry(0.05, 8, 6);
        const socketMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.9 });
        
        const leftSocket = new THREE.Mesh(socketGeo, socketMat);
        leftSocket.position.set(-0.09, 0.02, 0.2);
        leftSocket.scale.set(1.2, 0.8, 0.3);
        headGroup.add(leftSocket);
        
        const rightSocket = new THREE.Mesh(socketGeo, socketMat);
        rightSocket.position.set(0.09, 0.02, 0.2);
        rightSocket.scale.set(1.2, 0.8, 0.3);
        headGroup.add(rightSocket);
        
        // Eyes
        const eyeWhiteGeo = new THREE.SphereGeometry(0.035, 8, 8);
        const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
        leftEyeWhite.position.set(-0.09, 0.02, 0.21);
        leftEyeWhite.scale.z = 0.5;
        headGroup.add(leftEyeWhite);
        
        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
        rightEyeWhite.position.set(0.09, 0.02, 0.21);
        rightEyeWhite.scale.z = 0.5;
        headGroup.add(rightEyeWhite);
        
        // Pupils (intense blue)
        const pupilGeo = new THREE.SphereGeometry(0.02, 6, 6);
        const pupilMat = new THREE.MeshStandardMaterial({ 
            color: 0x1e40af, emissive: 0x1e3a8a, emissiveIntensity: 0.2 
        });
        
        const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
        leftPupil.position.set(-0.09, 0.02, 0.24);
        headGroup.add(leftPupil);
        
        const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
        rightPupil.position.set(0.09, 0.02, 0.24);
        headGroup.add(rightPupil);
        
        // Eyebrows
        const browGeo = new THREE.BoxGeometry(0.08, 0.02, 0.03);
        
        const leftBrow = new THREE.Mesh(browGeo, hairMat);
        leftBrow.position.set(-0.09, 0.1, 0.21);
        leftBrow.rotation.z = 0.15;
        headGroup.add(leftBrow);
        
        const rightBrow = new THREE.Mesh(browGeo, hairMat);
        rightBrow.position.set(0.09, 0.1, 0.21);
        rightBrow.rotation.z = -0.15;
        headGroup.add(rightBrow);
        
        // Nose
        const noseGeo = new THREE.ConeGeometry(0.03, 0.08, 4);
        const nose = new THREE.Mesh(noseGeo, skinMat);
        nose.position.set(0, -0.02, 0.24);
        nose.rotation.x = -Math.PI / 2;
        headGroup.add(nose);
        
        // Nose bridge
        const noseBridgeGeo = new THREE.BoxGeometry(0.04, 0.08, 0.04);
        const noseBridge = new THREE.Mesh(noseBridgeGeo, skinMat);
        noseBridge.position.set(0, 0.02, 0.22);
        headGroup.add(noseBridge);
        
        // Mouth
        const mouthGeo = new THREE.BoxGeometry(0.08, 0.015, 0.02);
        const mouthMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, -0.12, 0.2);
        headGroup.add(mouth);
        
        // Ears
        const earGeo = new THREE.SphereGeometry(0.04, 6, 6);
        
        const leftEar = new THREE.Mesh(earGeo, skinMat);
        leftEar.position.set(-0.24, 0, 0);
        leftEar.scale.set(0.4, 1, 0.8);
        headGroup.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeo, skinMat);
        rightEar.position.set(0.24, 0, 0);
        rightEar.scale.set(0.4, 1, 0.8);
        headGroup.add(rightEar);
        
        // === HAIR ===
        // Main hair volume
        const hairMainGeo = new THREE.SphereGeometry(0.26, 12, 10);
        const hairMain = new THREE.Mesh(hairMainGeo, hairMat);
        hairMain.position.set(0, 0.08, -0.02);
        hairMain.scale.set(1, 0.9, 0.9);
        hairMain.castShadow = true;
        headGroup.add(hairMain);
        
        // Hair spikes (warrior style)
        const spikeGeo = new THREE.ConeGeometry(0.04, 0.15, 5);
        
        const spike1 = new THREE.Mesh(spikeGeo, hairMat);
        spike1.position.set(-0.08, 0.28, 0.05);
        spike1.rotation.x = 0.3;
        spike1.rotation.z = 0.2;
        headGroup.add(spike1);
        
        const spike2 = new THREE.Mesh(spikeGeo, hairMat);
        spike2.position.set(0, 0.32, 0.02);
        spike2.rotation.x = 0.2;
        headGroup.add(spike2);
        
        const spike3 = new THREE.Mesh(spikeGeo, hairMat);
        spike3.position.set(0.08, 0.28, 0.05);
        spike3.rotation.x = 0.3;
        spike3.rotation.z = -0.2;
        headGroup.add(spike3);
        
        const spike4 = new THREE.Mesh(spikeGeo, hairMat);
        spike4.position.set(-0.12, 0.22, -0.08);
        spike4.rotation.x = -0.3;
        spike4.rotation.z = 0.3;
        headGroup.add(spike4);
        
        const spike5 = new THREE.Mesh(spikeGeo, hairMat);
        spike5.position.set(0.12, 0.22, -0.08);
        spike5.rotation.x = -0.3;
        spike5.rotation.z = -0.3;
        headGroup.add(spike5);
        
        // === HEADBAND ===
        const headbandGeo = new THREE.TorusGeometry(0.25, 0.025, 8, 24);
        const headbandMat = new THREE.MeshStandardMaterial({ 
            color: 0xdc2626, roughness: 0.6 
        });
        const headband = new THREE.Mesh(headbandGeo, headbandMat);
        headband.position.y = 0.06;
        headband.rotation.x = Math.PI / 2;
        headGroup.add(headband);
        
        // Headband knot (back)
        const knotGeo = new THREE.SphereGeometry(0.04, 6, 6);
        const knot = new THREE.Mesh(knotGeo, headbandMat);
        knot.position.set(0, 0.06, -0.25);
        headGroup.add(knot);
        
        // Headband tails
        const tailGeo = new THREE.BoxGeometry(0.04, 0.2, 0.015);
        
        const tail1 = new THREE.Mesh(tailGeo, headbandMat);
        tail1.position.set(-0.04, -0.02, -0.28);
        tail1.rotation.x = 0.4;
        tail1.rotation.z = 0.1;
        headGroup.add(tail1);
        
        const tail2 = new THREE.Mesh(tailGeo, headbandMat);
        tail2.position.set(0.04, -0.05, -0.3);
        tail2.rotation.x = 0.6;
        tail2.rotation.z = -0.1;
        headGroup.add(tail2);
        
        // Headband gem (forehead)
        const gemGeo = new THREE.OctahedronGeometry(0.035, 0);
        const gemMat = new THREE.MeshStandardMaterial({ 
            color: 0x3b82f6, emissive: 0x2563eb, emissiveIntensity: 0.5 
        });
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(0, 0.06, 0.26);
        gem.rotation.y = Math.PI / 4;
        headGroup.add(gem);
        
        headGroup.position.y = 2.15;
        this.mesh.add(headGroup);
        this.headGroup = headGroup;
    }

    
    createSword() {
        const swordGroup = new THREE.Group();
        
        // === BLADE ===
        // Main blade body (tapered)
        const bladeGeo = new THREE.BoxGeometry(0.06, 1.6, 0.02);
        const bladeMat = new THREE.MeshStandardMaterial({ 
            color: 0xd1d5db,
            metalness: 0.95,
            roughness: 0.05
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.95;
        blade.castShadow = true;
        swordGroup.add(blade);
        
        // Blade edge (sharper look)
        const edgeGeo = new THREE.BoxGeometry(0.065, 1.6, 0.005);
        const edgeMat = new THREE.MeshStandardMaterial({ 
            color: 0xf3f4f6,
            metalness: 1,
            roughness: 0
        });
        const edge = new THREE.Mesh(edgeGeo, edgeMat);
        edge.position.set(0, 0.95, 0.012);
        swordGroup.add(edge);
        
        // Blade fuller (blood groove)
        const fullerGeo = new THREE.BoxGeometry(0.02, 1.3, 0.008);
        const fullerMat = new THREE.MeshStandardMaterial({ 
            color: 0x9ca3af,
            metalness: 0.8,
            roughness: 0.2
        });
        const fuller = new THREE.Mesh(fullerGeo, fullerMat);
        fuller.position.set(0, 0.85, 0.012);
        swordGroup.add(fuller);
        
        // Blade tip
        const tipGeo = new THREE.ConeGeometry(0.03, 0.2, 4);
        const tip = new THREE.Mesh(tipGeo, bladeMat);
        tip.position.y = 1.85;
        tip.rotation.y = Math.PI / 4;
        tip.castShadow = true;
        swordGroup.add(tip);
        
        // Blade glow effect
        const glowGeo = new THREE.BoxGeometry(0.008, 1.5, 0.025);
        const glowMat = new THREE.MeshStandardMaterial({ 
            color: 0x60a5fa,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.8
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.set(0, 0.9, 0.018);
        swordGroup.add(glow);
        
        // === GUARD (crossguard) ===
        const guardMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.gold,
            metalness: 0.85,
            roughness: 0.15
        });
        
        // Main guard bar
        const guardGeo = new THREE.BoxGeometry(0.28, 0.05, 0.05);
        const guard = new THREE.Mesh(guardGeo, guardMat);
        guard.position.y = 0.12;
        guard.castShadow = true;
        swordGroup.add(guard);
        
        // Guard curves (S-shape ends)
        const guardCurveGeo = new THREE.TorusGeometry(0.03, 0.015, 6, 8, Math.PI);
        
        const leftGuardCurve = new THREE.Mesh(guardCurveGeo, guardMat);
        leftGuardCurve.position.set(-0.14, 0.12, 0);
        leftGuardCurve.rotation.y = Math.PI / 2;
        leftGuardCurve.rotation.z = Math.PI / 2;
        swordGroup.add(leftGuardCurve);
        
        const rightGuardCurve = new THREE.Mesh(guardCurveGeo, guardMat);
        rightGuardCurve.position.set(0.14, 0.12, 0);
        rightGuardCurve.rotation.y = -Math.PI / 2;
        rightGuardCurve.rotation.z = -Math.PI / 2;
        swordGroup.add(rightGuardCurve);
        
        // Guard gem
        const guardGemGeo = new THREE.OctahedronGeometry(0.03, 0);
        const guardGemMat = new THREE.MeshStandardMaterial({ 
            color: 0xef4444,
            emissive: 0xdc2626,
            emissiveIntensity: 0.6
        });
        const guardGem = new THREE.Mesh(guardGemGeo, guardGemMat);
        guardGem.position.set(0, 0.12, 0.04);
        guardGem.rotation.y = Math.PI / 4;
        swordGroup.add(guardGem);
        
        // === HANDLE ===
        const handleMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.leather,
            roughness: 0.85
        });
        
        // Handle core
        const handleGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.2, 8);
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.position.y = -0.02;
        handle.castShadow = true;
        swordGroup.add(handle);
        
        // Handle wraps
        const wrapMat = new THREE.MeshStandardMaterial({ 
            color: this.colors.leatherDark, roughness: 0.9 
        });
        for (let i = 0; i < 4; i++) {
            const wrapGeo = new THREE.TorusGeometry(0.032, 0.008, 4, 8);
            const wrap = new THREE.Mesh(wrapGeo, wrapMat);
            wrap.position.y = -0.1 + i * 0.05;
            wrap.rotation.x = Math.PI / 2;
            swordGroup.add(wrap);
        }
        
        // === POMMEL ===
        const pommelGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const pommel = new THREE.Mesh(pommelGeo, guardMat);
        pommel.position.y = -0.15;
        pommel.castShadow = true;
        swordGroup.add(pommel);
        
        // Pommel gem
        const pommelGemGeo = new THREE.SphereGeometry(0.015, 6, 6);
        const pommelGem = new THREE.Mesh(pommelGemGeo, guardGemMat);
        pommelGem.position.set(0, -0.15, 0.035);
        swordGroup.add(pommelGem);
        
        return swordGroup;
    }
    
    createShadow() {
        const shadowGeo = new THREE.CircleGeometry(0.45, 20);
        const shadowMat = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            transparent: true, 
            opacity: 0.35 
        });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.02;
        this.mesh.add(shadow);
        this.shadowDisc = shadow;
    }
    
    update(delta, moveInput, platforms, arenaBounds, obstacles = []) {
        this.isMoving = moveInput.x !== 0 || moveInput.z !== 0;
        
        // Apply movement
        this.mesh.position.x += moveInput.x * this.moveSpeed * delta;
        this.mesh.position.z += moveInput.z * this.moveSpeed * delta;
        
        // Apply knockback
        if (this.knockbackVelocity.x !== 0 || this.knockbackVelocity.z !== 0) {
            this.mesh.position.x += this.knockbackVelocity.x * delta;
            this.mesh.position.z += this.knockbackVelocity.z * delta;
            
            // Apply friction to knockback
            const friction = this.knockbackFriction * delta;
            this.knockbackVelocity.x *= Math.max(0, 1 - friction);
            this.knockbackVelocity.z *= Math.max(0, 1 - friction);
            
            // Stop if very small
            if (Math.abs(this.knockbackVelocity.x) < 0.1) this.knockbackVelocity.x = 0;
            if (Math.abs(this.knockbackVelocity.z) < 0.1) this.knockbackVelocity.z = 0;
        }
        
        // Rotate to face movement direction
        if (this.isMoving) {
            const angle = Math.atan2(moveInput.x, moveInput.z);
            // Smooth rotation
            const targetRotation = angle;
            const currentRotation = this.mesh.rotation.y;
            let diff = targetRotation - currentRotation;
            
            // Normalize angle difference
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            
            this.mesh.rotation.y += diff * 0.15;
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
        
        return this.mesh.position.y < -10;
    }
    
    animate(delta) {
        this.animationTime += delta * 10;
        
        if (this.isMoving && this.isGrounded) {
            // Running animation
            const swing = Math.sin(this.animationTime) * 0.5;
            const fastSwing = Math.sin(this.animationTime * 1.5) * 0.3;
            const bodyBob = Math.abs(Math.sin(this.animationTime * 2)) * 0.04;
            
            // Leg swing - boots are now children of legs, so they move together
            if (this.leftLeg) {
                this.leftLeg.rotation.x = swing;
            }
            if (this.rightLeg) {
                this.rightLeg.rotation.x = -swing;
            }
            
            // Arm swing (opposite to legs for natural walk)
            if (this.leftArm) {
                this.leftArm.rotation.x = -swing * 0.6;
            }
            if (this.rightArm && !this.isAttacking) {
                this.rightArm.rotation.x = swing * 0.4;
            }
            
            // Body bob and slight lean
            if (this.torsoGroup) {
                this.torsoGroup.position.y = 1.45 + bodyBob;
                this.torsoGroup.rotation.z = fastSwing * 0.05;
            }
            
            // Head follows body bob
            if (this.headGroup) {
                this.headGroup.position.y = 2.15 + bodyBob * 0.5;
            }
            
            // Leg group follows body bob for cohesive movement
            if (this.legGroup) {
                this.legGroup.position.y = 0.9 + bodyBob * 0.3;
            }
        } else {
            // Idle animation - smooth return to neutral
            if (this.leftLeg) this.leftLeg.rotation.x *= 0.9;
            if (this.rightLeg) this.rightLeg.rotation.x *= 0.9;
            if (this.leftArm) this.leftArm.rotation.x *= 0.9;
            if (this.rightArm && !this.isAttacking) this.rightArm.rotation.x *= 0.9;
            
            // Idle breathing
            const breathe = Math.sin(this.animationTime * 0.4) * 0.015;
            if (this.torsoGroup) {
                this.torsoGroup.position.y = 1.45 + breathe;
                this.torsoGroup.rotation.z *= 0.95;
            }
            if (this.headGroup) {
                this.headGroup.position.y = 2.15 + breathe * 0.5;
            }
            if (this.legGroup) {
                this.legGroup.position.y = 0.9 + breathe * 0.3;
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
        
        const origArmX = this.rightArm.rotation.x;
        const origArmZ = this.rightArm.rotation.z;
        
        // Wind up
        this.rightArm.rotation.x = -1.0;
        this.rightArm.rotation.z = 0.6;
        
        // Swing
        setTimeout(() => {
            this.rightArm.rotation.x = 0.8;
            this.rightArm.rotation.z = -0.4;
            
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
    
    takeDamage(amount, knockbackDir = null) {
        this.health -= amount;
        this.health = Math.max(0, this.health);
        
        // Apply knockback if direction provided
        if (knockbackDir) {
            const knockbackStrength = 12;
            this.knockbackVelocity.x = knockbackDir.x * knockbackStrength;
            this.knockbackVelocity.z = knockbackDir.z * knockbackStrength;
        }
        
        return this.health <= 0;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    reset() {
        this.mesh.position.set(0, 0, 5);
        this.velocity = { x: 0, y: 0, z: 0 };
        this.knockbackVelocity = { x: 0, z: 0 };
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
