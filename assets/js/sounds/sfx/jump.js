// Jump - rising tone

export default function jump(ctx, output, pitch = 1) {
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(500 * pitch, now + 0.1);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    gain.connect(output);
    osc.start(now);
    osc.stop(now + 0.15);
}
