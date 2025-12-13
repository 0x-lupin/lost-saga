// Controls Module - Lost Saga

export class Controls {
    constructor() {
        this.keys = {};
        this.joystickInput = { x: 0, y: 0 };
        this.onJump = null;
        this.onAttack = null;
        
        this.setupKeyboard();
        this.setupJoystick();
        this.setupMobileButtons();
    }
    
    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space' && this.onJump) {
                this.onJump();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        document.getElementById('game-canvas').addEventListener('click', () => {
            if (this.onAttack) this.onAttack();
        });
    }
    
    setupJoystick() {
        const joystickBase = document.getElementById('joystick-base');
        const joystickStick = document.getElementById('joystick-stick');
        let isDragging = false;
        const baseRect = { x: 0, y: 0 };
        const maxDistance = 35;
        
        const handleStart = (e) => {
            e.preventDefault();
            isDragging = true;
            const rect = joystickBase.getBoundingClientRect();
            baseRect.x = rect.left + rect.width / 2;
            baseRect.y = rect.top + rect.height / 2;
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.touches ? e.touches[0] : e;
            let dx = touch.clientX - baseRect.x;
            let dy = touch.clientY - baseRect.y;
            
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > maxDistance) {
                dx = (dx / distance) * maxDistance;
                dy = (dy / distance) * maxDistance;
            }
            
            joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;
            this.joystickInput.x = dx / maxDistance;
            this.joystickInput.y = -dy / maxDistance;
        };
        
        const handleEnd = () => {
            isDragging = false;
            joystickStick.style.transform = 'translate(0, 0)';
            this.joystickInput.x = 0;
            this.joystickInput.y = 0;
        };
        
        joystickBase.addEventListener('touchstart', handleStart);
        joystickBase.addEventListener('mousedown', handleStart);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchend', handleEnd);
        window.addEventListener('mouseup', handleEnd);
    }
    
    setupMobileButtons() {
        document.getElementById('btn-jump').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.onJump) this.onJump();
        });
        
        document.getElementById('btn-attack').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.onAttack) this.onAttack();
        });
    }
    
    getMoveInput() {
        let moveX = 0;
        let moveZ = 0;
        
        // Keyboard
        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
        
        // Joystick
        moveX += this.joystickInput.x;
        moveZ -= this.joystickInput.y;
        
        // Normalize
        const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
        if (length > 1) {
            moveX /= length;
            moveZ /= length;
        }
        
        return { x: moveX, z: moveZ };
    }
}
