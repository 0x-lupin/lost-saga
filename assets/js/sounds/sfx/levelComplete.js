// Level complete - victory fanfare

export default function levelComplete(ctx, output) {
    const now = ctx.currentTime;
    
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const durations = [0.15, 0.15, 0.15, 0.4];
    let time = now;
    
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.setValueAtTime(0.2, time + durations[i] * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i]);
        
        osc.connect(gain);
        gain.connect(output);
        osc.start(time);
        osc.stop(time + durations[i]);
        
        time += durations[i];
    });
}
