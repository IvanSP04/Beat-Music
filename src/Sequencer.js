// sequencer.js - Lógica del secuenciador y grid

export class Sequencer {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.grid = Array(8).fill().map(() => Array(16).fill(false));
    this.currentBeat = 0;
    this.isPlaying = false;
    this.tempo = 120; // BPM
    this.intervalId = null;
    this.selectedKit = 'hiphop';
    this.onBeatChange = null;
  }

  toggleCell(row, col) {
    this.grid[row][col] = !this.grid[row][col];
  }

  getCellState(row, col) {
    return this.grid[row][col];
  }

  clearGrid() {
    this.grid = Array(8).fill().map(() => Array(16).fill(false));
    this.stop();
  }

  loadPattern(patternName) {
    const patterns = {
      basic: [
        [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false]
      ],
      groove: [
        [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
        [false, false, false, false, true, false, false, true, false, false, false, false, true, false, false, true],
        [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
        [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
        [true, true, false, false, true, true, false, false, true, true, false, false, true, true, false, false]
      ]
    };
    
    if (patterns[patternName]) {
      this.grid = patterns[patternName];
    }
  }

  play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    const beatDuration = (60 / this.tempo) * 1000 / 4;
    
    this.intervalId = setInterval(() => {
      this.currentBeat = (this.currentBeat + 1) % 16;
      
      // Reproducir sonidos activos en este beat
      this.grid.forEach((row, rowIndex) => {
        if (row[this.currentBeat]) {
          this.audioEngine.playSound(this.selectedKit, rowIndex);
        }
      });
      
      // Notificar cambio de beat para UI
      if (this.onBeatChange) {
        this.onBeatChange(this.currentBeat);
      }
    }, beatDuration);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentBeat = 0;
    
    if (this.onBeatChange) {
      this.onBeatChange(this.currentBeat);
    }
  }

  setKit(kit) {
    this.selectedKit = kit;
  }

  getKit() {
    return this.selectedKit;
  }
}