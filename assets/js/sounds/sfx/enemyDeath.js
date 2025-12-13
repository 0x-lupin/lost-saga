// Enemy death - descending tone + noise burst

export default function enemyDeath(ctx, output, pitch = 1) {
    const now = ctx.currentTime;
    
    // Descending tone
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    osc.start(now);
    osc.stop(now + 0.3);
    
    // Noise burst
    const duration = 0.2;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        const t = i / data.length;
        data[i] = (Math.random() * 2 - 1) * (1 - t) * 0.3;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.2;
    
    noise.connect(noiseGain);
    noiseGain.connect(output);
    noise.start(now);
}
