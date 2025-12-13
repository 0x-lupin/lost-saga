// Background music - 8-bit style looping

function play(ctx, output) {
    const bpm = 120;
    const beatDuration = 60 / bpm;
    const barDuration = beatDuration * 4;
    
    const bassPattern = [130.81, 130.81, 164.81, 146.83]; // C3, C3, E3, D3
    const melodyPattern = [
        [523, 0, 659, 0, 784, 0, 659, 0],  // C5, E5, G5, E5
        [587, 0, 698, 0, 880, 0, 698, 0],  // D5, F5, A5, F5
    ];
    
    let barIndex = 0;
    const state = { timeout: null, stopped: false };
    
    const playBar = () => {
        if (state.stopped) return;
        
        const now = ctx.currentTime;
        const bassNote = bassPattern[barIndex % bassPattern.length];
        
        // Bass
        for (let beat = 0; beat < 4; beat++) {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.value = bassNote;
            
            const gain = ctx.createGain();
            const startTime = now + beat * beatDuration;
            gain.gain.setValueAtTime(0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.8);
            
            osc.connect(gain);
            gain.connect(output);
            osc.start(startTime);
            osc.stop(startTime + beatDuration * 0.9);
        }
        
        // Melody
        const melody = melodyPattern[barIndex % melodyPattern.length];
        for (let i = 0; i < 8; i++) {
            if (melody[i] === 0) continue;
            
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.value = melody[i];
            
            const gain = ctx.createGain();
            const startTime = now + i * (beatDuration / 2);
            gain.gain.setValueAtTime(0.08, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.4);
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 2000;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(output);
            osc.start(startTime);
            osc.stop(startTime + beatDuration * 0.45);
        }
        
        barIndex++;
        state.timeout = setTimeout(playBar, barDuration * 1000);
    };
    
    playBar();
    return state;
}

function stop(state) {
    if (state) {
        state.stopped = true;
        if (state.timeout) {
            clearTimeout(state.timeout);
        }
    }
}

export default { play, stop };
