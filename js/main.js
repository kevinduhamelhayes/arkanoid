import { Game } from './Game.js';

/**
 * Inicializa el juego cuando el DOM está cargado
 */
document.addEventListener('DOMContentLoaded', () => {
  // Obtenemos el canvas
  const canvas = document.getElementById('gameCanvas');
  
  // Si no existe, creamos el canvas
  if (!canvas) {
    console.error('No se ha encontrado el elemento canvas con id "gameCanvas"');
    return;
  }
  
  // Inicializamos el juego
  const game = new Game(canvas);
  
  // Mensaje de bienvenida
  console.log('¡Bienvenido al juego Arkanoid!');
  console.log('Controles:');
  console.log('- Usa las flechas izquierda/derecha o el ratón para mover la paleta');
  console.log('- Presiona Espacio para lanzar la bola');
  console.log('- Presiona P para pausar/reanudar el juego');
}); 