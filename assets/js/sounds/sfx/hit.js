// Hit impact - thud + high click

export default function hit(ctx, output, pitch = 1) {
    const now = ctx.currentTime;
    
    // Low thud
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(150 * pitch, now);
    osc1.frequency.exponentialRampToValueAtTime(50, now + 0.1);
    
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc1.connect(gain1);
    gain1.connect(output);
    osc1.start(now);
    osc1.stop(now + 0.1);
    
    // High click
    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.value = 800 * pitch;
    
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.15, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc2.connect(gain2);
    gain2.connect(output);
    osc2.start(now);
    osc2.stop(now + 0.05);
}
