// main.js - Punto de entrada de la aplicación

import './style.css';
import { AudioEngine } from './AudioEngine.js';
import { Sequencer } from './Sequencer.js';
import { UI } from './UI.js';

// Inicializar la aplicación
function initApp() {
  const audioEngine = new AudioEngine();
  const sequencer = new Sequencer(audioEngine);
  const ui = new UI(sequencer, audioEngine);

  // Cleanup cuando se cierre la página
  window.addEventListener('beforeunload', () => {
    audioEngine.close();
  });
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}