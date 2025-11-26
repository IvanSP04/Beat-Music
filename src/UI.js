// ui.js - Maneja toda la interfaz de usuario

export class UI {
  constructor(sequencer, audioEngine) {
    this.sequencer = sequencer;
    this.audioEngine = audioEngine;
    this.elements = {};
    
    this.init();
  }

  init() {
    this.createLayout();
    this.setupEventListeners();
    this.renderGrid();
    
    // Configurar callback de cambio de beat
    this.sequencer.onBeatChange = (beat) => this.updateBeatIndicator(beat);
  }

  createLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <header>
          <h1>🎵 Beatmaker Pro</h1>
          <p>Crea ritmos épicos con tu beat pad</p>
        </header>

        <div class="controls">
          <div class="controls-row">
            <button id="playBtn" class="btn btn-play">▶ PLAY</button>
            
            <div class="kit-selector">
              <button id="kitHipHop" class="btn btn-kit active">Hip Hop</button>
              <button id="kitElectronic" class="btn btn-kit">Electronic</button>
            </div>

            <div class="volume-control">
              <span>🔊</span>
              <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="0.7">
            </div>

            <button id="clearBtn" class="btn btn-clear">🗑️ Clear</button>
          </div>

          <div class="patterns">
            <span>Patterns:</span>
            <button id="patternBasic" class="btn btn-pattern">Basic Beat</button>
            <button id="patternGroove" class="btn btn-pattern">Groove</button>
          </div>
        </div>

        <div class="sequencer">
          <div class="beat-numbers" id="beatNumbers"></div>
          <div class="grid" id="grid"></div>
        </div>

        <footer>
          <p>💡 Haz clic en las celdas para activar sonidos • Presiona los nombres para preview</p>
          <p>Tempo: ${this.sequencer.tempo} BPM</p>
        </footer>
      </div>
    `;

    // Guardar referencias
    this.elements = {
      playBtn: document.getElementById('playBtn'),
      clearBtn: document.getElementById('clearBtn'),
      kitHipHop: document.getElementById('kitHipHop'),
      kitElectronic: document.getElementById('kitElectronic'),
      volumeSlider: document.getElementById('volumeSlider'),
      patternBasic: document.getElementById('patternBasic'),
      patternGroove: document.getElementById('patternGroove'),
      grid: document.getElementById('grid'),
      beatNumbers: document.getElementById('beatNumbers')
    };
  }

  renderGrid() {
    const { grid, beatNumbers } = this.elements;
    
    // Renderizar números de beat
    beatNumbers.innerHTML = '<div class="track-label"></div>';
    for (let i = 0; i < 16; i++) {
      const num = document.createElement('div');
      num.className = 'beat-number';
      num.textContent = i + 1;
      num.dataset.beat = i;
      beatNumbers.appendChild(num);
    }

    // Renderizar grid
    grid.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'grid-row';
      
      // Label de la pista
      const label = document.createElement('button');
      label.className = 'track-label';
      label.textContent = this.audioEngine.getSoundName(this.sequencer.getKit(), row);
      label.dataset.row = row;
      label.onclick = () => this.audioEngine.playSound(this.sequencer.getKit(), row);
      rowDiv.appendChild(label);
      
      // Celdas
      for (let col = 0; col < 16; col++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        if (this.sequencer.getCellState(row, col)) {
          cell.classList.add('active');
        }
        
        if (col % 4 === 0) {
          cell.classList.add('beat-marker');
        }
        
        cell.onclick = () => this.handleCellClick(row, col);
        rowDiv.appendChild(cell);
      }
      
      grid.appendChild(rowDiv);
    }
  }

  setupEventListeners() {
    // Play/Stop
    this.elements.playBtn.onclick = () => this.togglePlay();

    // Clear
    this.elements.clearBtn.onclick = () => {
      this.sequencer.clearGrid();
      this.renderGrid();
    };

    // Kit selector
    this.elements.kitHipHop.onclick = () => this.selectKit('hiphop');
    this.elements.kitElectronic.onclick = () => this.selectKit('electronic');

    // Volumen
    this.elements.volumeSlider.oninput = (e) => {
      this.audioEngine.setVolume(parseFloat(e.target.value));
    };

    // Patterns
    this.elements.patternBasic.onclick = () => this.loadPattern('basic');
    this.elements.patternGroove.onclick = () => this.loadPattern('groove');
  }

  handleCellClick(row, col) {
    this.sequencer.toggleCell(row, col);
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.toggle('active');
  }

  togglePlay() {
    if (this.sequencer.isPlaying) {
      this.sequencer.stop();
      this.elements.playBtn.textContent = '▶ PLAY';
      this.elements.playBtn.classList.remove('playing');
    } else {
      this.sequencer.play();
      this.elements.playBtn.textContent = '⏹ STOP';
      this.elements.playBtn.classList.add('playing');
    }
  }

  selectKit(kit) {
    this.sequencer.setKit(kit);
    
    // UI
    if (kit === 'hiphop') {
      this.elements.kitHipHop.classList.add('active');
      this.elements.kitElectronic.classList.remove('active');
    } else {
      this.elements.kitElectronic.classList.add('active');
      this.elements.kitHipHop.classList.remove('active');
    }
    
    const labels = document.querySelectorAll('.track-label');
    labels.forEach((label, index) => {
      if (index > 0) { 
        label.textContent = this.audioEngine.getSoundName(kit, index - 1);
      }
    });
  }

  loadPattern(pattern) {
    this.sequencer.loadPattern(pattern);
    this.renderGrid();
  }

  updateBeatIndicator(beat) {
    // Actualizar números de beat
    const numbers = document.querySelectorAll('.beat-number');
    numbers.forEach((num, i) => {
      if (i === beat) {
        num.classList.add('current');
      } else {
        num.classList.remove('current');
      }
    });

    // Actualizar celdas
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      const col = parseInt(cell.dataset.col);
      if (col === beat) {
        cell.classList.add('current-beat');
      } else {
        cell.classList.remove('current-beat');
      }
    });
  }
}