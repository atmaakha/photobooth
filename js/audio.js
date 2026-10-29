// Sound Effects Synthesizer using Web Audio API (Zero external audio files needed!)
class SoundEffects {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playCountdownBeep(isFinal = false) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isFinal ? 880 : 587.33, this.ctx.currentTime); // D5 or A5

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isFinal ? 0.35 : 0.15));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + (isFinal ? 0.35 : 0.15));
    }

    playShutter() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Mechanical click (noise burst)
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 3;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);

        // 2. Low mechanical mirror flap thud
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now + 0.03);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

        oscGain.gain.setValueAtTime(0.4, now + 0.03);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);

        osc.start(now + 0.03);
        osc.stop(now + 0.15);
    }

    playSuccessChime() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = this.ctx.currentTime + index * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.4);
        });
    }
}

window.soundEffects = new SoundEffects();
