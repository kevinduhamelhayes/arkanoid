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
      normal: { x: 8, y: 136, width: 80, height: 15 },
      expanded: { x: 8, y: 152, width: 104, height: 15 },
      shrunk: { x: 8, y: 168, width: 56, height: 15 }
    },
    ball: { x: 96, y: 136, width: 16, height: 16 },
    bricks: [
      { x: 8,  y: 40, width: 40, height: 20 },  // Blanco (fila 0)
      { x: 8,  y: 68, width: 40, height: 20 },  // Naranja (fila 1)
      { x: 56, y: 40, width: 40, height: 20 },  // Azul claro (fila 2)
      { x: 56, y: 68, width: 40, height: 20 },  // Verde (fila 3)
      { x: 104, y: 40, width: 40, height: 20 }, // Rojo (fila 4)
      { x: 104, y: 68, width: 40, height: 20 }, // Azul (fila 5)
      { x: 152, y: 40, width: 40, height: 20 }, // Magenta (fila 6)
      { x: 152, y: 68, width: 40, height: 20 }  // Amarillo (fila 7)
    ],
    powerUps: {
      'expand-paddle': { x: 128, y: 128, width: 24, height: 12 },
      'shrink-paddle': { x: 152, y: 128, width: 24, height: 12 },
      'slow-ball': { x: 176, y: 128, width: 24, height: 12 },
      'fast-ball': { x: 200, y: 128, width: 24, height: 12 },
      'multi-ball': { x: 224, y: 128, width: 24, height: 12 },
      'extra-life': { x: 248, y: 128, width: 24, height: 12 }
    }
  }
}; 