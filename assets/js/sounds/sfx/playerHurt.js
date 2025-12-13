// Player hurt - low impact + distortion

export default function playerHurt(ctx, output, pitch = 1) {
    const now = ctx.currentTime;
    
    // Impact
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    // Distortion
    const distortion = ctx.createWaveShaper();
    distortion.curve = makeDistortionCurve(50);
    
    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(output);
    osc.start(now);
    osc.stop(now + 0.15);
    
    // Secondary crunch
    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.value = 100 * pitch;
    
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.15, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc2.connect(gain2);
    gain2.connect(output);
    osc2.start(now);
    osc2.stop(now + 0.1);
}

function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}
