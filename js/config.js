// Configuración del juego
export const GAME_CONFIG = {
  canvas: {
    width: 640,
    height: 480
  },
  paddle: {
    width: 64,
    height: 16,
    y: 450,        // Posición Y fija para la paleta
    speed: 8
  },
  ball: {
    radius: 6,     // Radio de la bola (ligeramente mayor para mejor visibilidad)
    initialSpeed: 4
  },
  bricks: {
    rowCount: 8,
    columnCount: 14,
    width: 40,
    height: 16,
    padding: 4,   // Padding para que se vean mejor separados
    offsetTop: 60,
    offsetLeft: 30
  },
  powerUps: {
    chance: 0.2, // 20% de probabilidad de que aparezca un power-up
    types: [
      'expand-paddle', // Aumenta el tamaño de la paleta
      'shrink-paddle', // Reduce el tamaño de la paleta
      'slow-ball',     // Ralentiza la bola
      'fast-ball',     // Acelera la bola
      'multi-ball',    // Añade bolas adicionales
      'extra-life'     // Vida extra
    ],
    fallSpeed: 2,      // Velocidad a la que caen los power-ups
    duration: 10000    // Duración de los efectos de power-up (10 segundos)
  }
}; 