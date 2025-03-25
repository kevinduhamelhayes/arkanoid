// Configuración del juego
export const GAME_CONFIG = {
  canvas: {
    width: 640,
    height: 480
  },
  paddle: {
    width: 64,     // Corregido para que coincida con el sprite
    height: 16,    // Corregido para que coincida con el sprite
    y: 450,        // Posición Y fija para la paleta
    speed: 8
  },
  ball: {
    radius: 4,     // Reducido ya que la bola es más pequeña en el sprite
    initialSpeed: 4
  },
  bricks: {
    rowCount: 8,
    columnCount: 14,
    width: 40,
    height: 16,   // Ajustado para hacerlo más proporcionado con los sprites
    padding: 4,   // Añadido padding para que se vean mejor separados
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
    // Posiciones corregidas según el sprite.png
    paddle: {
      // La paleta usa una parte específica del sprite
      normal: { x: 8, y: 252, width: 64, height: 16 },
      expanded: { x: 80, y: 252, width: 96, height: 16 },
      shrunk: { x: 8, y: 276, width: 48, height: 16 }
    },
    // La bola es un círculo blanco pequeño
    ball: { x: 188, y: 252, width: 8, height: 8 },
    // Corregimos el arreglo de ladrillos según los colores en el sprite
    bricks: [
      // Filas de ladrillos basados en la imagen bricks.png
      { x: 0, y: 0, width: 40, height: 16 },     // Rojo
      { x: 40, y: 0, width: 40, height: 16 },    // Naranja
      { x: 80, y: 0, width: 40, height: 16 },    // Amarillo
      { x: 120, y: 0, width: 40, height: 16 },   // Verde
      { x: 160, y: 0, width: 40, height: 16 },   // Cyan
      { x: 200, y: 0, width: 40, height: 16 },   // Azul
      { x: 240, y: 0, width: 40, height: 16 },   // Morado
      { x: 280, y: 0, width: 40, height: 16 }    // Gris
    ],
    powerUps: {
      'expand-paddle': { x: 208, y: 252, width: 24, height: 12 },
      'shrink-paddle': { x: 208, y: 268, width: 24, height: 12 },
      'slow-ball': { x: 240, y: 252, width: 24, height: 12 },
      'fast-ball': { x: 240, y: 268, width: 24, height: 12 },
      'multi-ball': { x: 272, y: 252, width: 24, height: 12 },
      'extra-life': { x: 272, y: 268, width: 24, height: 12 }
    }
  }
}; 