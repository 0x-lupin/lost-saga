// Game over - sad descending tones

export default function gameOver(ctx, output) {
    const now = ctx.currentTime;
    
    const notes = [392, 349, 330, 262]; // G4, F4, E4, C4
    const durations = [0.25, 0.25, 0.25, 0.5];
    let time = now;
    
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + durations[i]);
        
        osc.connect(gain);
        gain.connect(output);
        osc.start(time);
        osc.stop(time + durations[i]);
        
        time += durations[i];
    });
}
