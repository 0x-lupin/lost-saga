// Controls Module - Lost Saga

export class Controls {
    constructor() {
        this.keys = {};
        this.joystickInput = { x: 0, y: 0 };
        this.onJump = null;
        this.onAttack = null;
        this.onDash = null;

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
            if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && this.onDash) {
                this.onDash();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.addEventListener('click', () => {
                if (this.onAttack) this.onAttack();
            });
        }
    }

    setupJoystick() {
        const joystickBase = document.getElementById('joystick-base');
        const joystickStick = document.getElementById('joystick-stick');
        let isDragging = false;
        let joystickTouchId = null;
        const baseRect = { x: 0, y: 0 };
        const maxDistance = 35;

        const handleStart = (e) => {
            e.preventDefault();
            // If already dragging, ignore new touches on the joystick (optional, or allow swapping)
            if (isDragging) return;

            isDragging = true;
            const rect = joystickBase.getBoundingClientRect();
            baseRect.x = rect.left + rect.width / 2;
            baseRect.y = rect.top + rect.height / 2;

            if (e.changedTouches) {
                // Track the specific touch that started on the joystick
                const touch = e.changedTouches[0];
                joystickTouchId = touch.identifier;
            }
        };

        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            let clientX, clientY;

            if (e.touches) {
                // Find the tracked touch
                let found = false;
                for (let i = 0; i < e.touches.length; i++) {
                    if (e.touches[i].identifier === joystickTouchId) {
                        clientX = e.touches[i].clientX;
                        clientY = e.touches[i].clientY;
                        found = true;
                        break;
                    }
                }
                if (!found) return; // The joystick finger isn't the one moving
            } else {
                // Mouse fallback
                clientX = e.clientX;
                clientY = e.clientY;
            }

            let dx = clientX - baseRect.x;
            let dy = clientY - baseRect.y;

            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > maxDistance) {
                dx = (dx / distance) * maxDistance;
                dy = (dy / distance) * maxDistance;
            }

            joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;
            this.joystickInput.x = dx / maxDistance;
            this.joystickInput.y = -dy / maxDistance;
        };

        const handleEnd = (e) => {
            if (!isDragging) return;

            let shouldReset = false;
            if (e.changedTouches) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier === joystickTouchId) {
                        shouldReset = true;
                        break;
                    }
                }
            } else {
                shouldReset = true;
            }

            if (shouldReset) {
                isDragging = false;
                joystickTouchId = null;
                joystickStick.style.transform = 'translate(0, 0)';
                this.joystickInput.x = 0;
                this.joystickInput.y = 0;
            }
        };

        joystickBase.addEventListener('touchstart', handleStart, { passive: false });
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

        const btnDash = document.getElementById('btn-dash');
        if (btnDash) {
            btnDash.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.onDash) this.onDash();
            });
        }
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
