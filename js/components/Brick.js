import { GAME_CONFIG } from '../config.js';

/**
 * Clase para manejar los ladrillos del juego
 */
export class Brick {
  /**
   * Constructor de un ladrillo
   * @param {number} x - Posición X
   * @param {number} y - Posición Y
   * @param {number} type - Tipo de ladrillo (0-7 para diferentes colores)
   */
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = GAME_CONFIG.bricks.width;
    this.height = GAME_CONFIG.bricks.height;
    this.type = Math.min(type, 7); // Aseguramos que el tipo esté entre 0 y 7
    this.status = 1; // 1 = activo, 0 = destruido
    this.points = (this.type + 1) * 10; // Puntos según el tipo de ladrillo
  }

  /**
   * Comprueba si una bola colisiona con este ladrillo
   * @param {Ball} ball - Objeto de bola
   * @returns {boolean} - true si hay colisión, false en caso contrario
   */
  checkCollision(ball) {
    if (this.status === 0) return false;

    // Calculamos los bordes del ladrillo
    const brickLeft = this.x;
    const brickRight = this.x + this.width;
    const brickTop = this.y;
    const brickBottom = this.y + this.height;
    
    // Calculamos el punto más cercano al centro de la bola
    const closestX = Math.max(brickLeft, Math.min(ball.x, brickRight));
    const closestY = Math.max(brickTop, Math.min(ball.y, brickBottom));
    
    // Calculamos la distancia entre el punto más cercano y el centro de la bola
    const distanceX = ball.x - closestX;
    const distanceY = ball.y - closestY;
    
    // Si la distancia es menor que el radio de la bola, hay colisión
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    if (distance <= ball.radius) {
      // Calculamos el ángulo de impacto para determinar cómo debe rebotar
      const angle = Math.atan2(distanceY, distanceX);
      const absoluteAngle = Math.abs(angle);
      
      // Si el ángulo está más cerca de 0 o pi, la colisión es horizontal
      if (absoluteAngle < Math.PI / 4 || absoluteAngle > 3 * Math.PI / 4) {
        ball.dx = -ball.dx;
      } else {
        // De lo contrario, la colisión es vertical
        ball.dy = -ball.dy;
      }
      
      // Marcamos el ladrillo como destruido
      this.status = 0;
      
      return true;
    }
    
    return false;
  }

  /**
   * Dibuja el ladrillo en el canvas si está activo
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   * @param {HTMLImageElement} bricksImg - Imagen de ladrillos
   */
  draw(ctx, bricksImg) {
    if (this.status === 0) return;
    
    // Obtenemos la posición del ladrillo en la imagen según su tipo
    const brickPos = GAME_CONFIG.spritePositions.bricks[this.type];
    
    try {
      // Dibujamos el ladrillo desde la imagen
      ctx.drawImage(
        bricksImg,
        brickPos.x, brickPos.y,       // posición en la imagen
        brickPos.width, brickPos.height, // tamaño en la imagen
        this.x, this.y,                // posición en el canvas
        this.width, this.height        // tamaño en el canvas
      );
      
      // Añadir un sutil efecto de brillo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(this.x, this.y, this.width, this.height / 4);
    } catch (error) {
      console.error('Error al dibujar un ladrillo:', error);
      
      // Plan de respaldo: dibujar un rectángulo coloreado
      const colors = [
        '#FF0000', // Rojo
        '#FF7700', // Naranja
        '#FFFF00', // Amarillo
        '#00FF00', // Verde
        '#00FFFF', // Cyan
        '#0000FF', // Azul
        '#FF00FF', // Magenta
        '#AAAAAA'  // Gris
      ];
      
      // Dibujamos un rectángulo con el color correspondiente
      ctx.fillStyle = colors[this.type];
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      // Añadir efecto de brillo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(this.x, this.y, this.width, this.height / 4);
      
      // Añadir borde
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
} 