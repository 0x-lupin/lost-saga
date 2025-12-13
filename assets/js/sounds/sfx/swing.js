// Sword swing - whoosh sound

export default function swing(ctx, output, pitch = 1) {
    const now = ctx.currentTime;
    
    const duration = 0.15;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const env = Math.sin(t * Math.PI) * (1 - t * 0.5);
        data[i] = (Math.random() * 2 - 1) * env;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitch * 1.5;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800 * pitch;
    filter.Q.value = 1;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start(now);
}
