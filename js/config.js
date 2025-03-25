// Configuración del juego
export const GAME_CONFIG = {
  canvas: {
    width: 640,
    height: 480
  },
  paddle: {
    width: 80,
    height: 15,
    y: 450, // Posición Y fija para la paleta
    speed: 8
  },
  ball: {
    radius: 8,
    initialSpeed: 4
  },
  bricks: {
    rowCount: 8,
    columnCount: 14,
    width: 40,
    height: 20,
    padding: 2,
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
  },
  spritePositions: {
    paddle: {
      normal: { x: 0, y: 160, width: 80, height: 15 },
      expanded: { x: 0, y: 176, width: 100, height: 15 },
      shrunk: { x: 0, y: 192, width: 60, height: 15 }
    },
    ball: { x: 160, y: 160, width: 16, height: 16 },
    powerUps: {
      'expand-paddle': { x: 32, y: 192, width: 24, height: 12 },
      'shrink-paddle': { x: 56, y: 192, width: 24, height: 12 },
      'slow-ball': { x: 80, y: 192, width: 24, height: 12 },
      'fast-ball': { x: 104, y: 192, width: 24, height: 12 },
      'multi-ball': { x: 128, y: 192, width: 24, height: 12 },
      'extra-life': { x: 152, y: 192, width: 24, height: 12 }
    }
  }
}; 