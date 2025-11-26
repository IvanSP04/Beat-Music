// audioEngine.js - Maneja toda la síntesis de audio

export class AudioEngine {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.volume = 0.7;
    
    this.soundKits = {
      hiphop: [
        { name: 'Kick', freq: 60, type: 'sine', duration: 0.3 },
        { name: 'Snare', freq: 200, type: 'triangle', duration: 0.2 },
        { name: 'HiHat', freq: 8000, type: 'square', duration: 0.1 },
        { name: 'Clap', freq: 1000, type: 'sawtooth', duration: 0.15 },
        { name: 'Tom1', freq: 150, type: 'sine', duration: 0.25 },
        { name: 'Tom2', freq: 100, type: 'sine', duration: 0.3 },
        { name: 'Crash', freq: 5000, type: 'square', duration: 0.5 },
        { name: 'Perc', freq: 400, type: 'triangle', duration: 0.15 }
      ],
      electronic: [
        { name: 'Bass', freq: 80, type: 'sawtooth', duration: 0.4 },
        { name: 'Lead', freq: 440, type: 'square', duration: 0.2 },
        { name: 'Pad', freq: 220, type: 'sine', duration: 0.6 },
        { name: 'Pluck', freq: 880, type: 'triangle', duration: 0.1 },
        { name: 'Noise', freq: 12000, type: 'square', duration: 0.05 },
        { name: 'Sub', freq: 40, type: 'sine', duration: 0.5 },
        { name: 'FX1', freq: 2000, type: 'sawtooth', duration: 0.3 },
        { name: 'FX2', freq: 3000, type: 'square', duration: 0.25 }
      ]
    };
  }

  playSound(kit, rowIndex) {
    const sound = this.soundKits[kit][rowIndex];
    const ctx = this.audioContext;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.freq, ctx.currentTime);
    
    // Configurar filtro
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(sound.freq * 2, ctx.currentTime);
    
    // Envelope ADSR
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + sound.duration);
  }

  setVolume(value) {
    this.volume = value;
  }

  getSoundName(kit, index) {
    return this.soundKits[kit][index].name;
  }

  close() {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}