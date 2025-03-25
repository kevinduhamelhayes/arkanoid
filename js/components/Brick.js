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
    
    // Colores CSS para cada tipo de ladrillo
    this.colors = [
      '#FF0000', // Rojo
      '#FF7700', // Naranja
      '#FFFF00', // Amarillo
      '#00FF00', // Verde
      '#00FFFF', // Cyan
      '#0000FF', // Azul
      '#FF00FF', // Magenta
      '#AAAAAA'  // Gris
    ];
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
   */
  draw(ctx) {
    if (this.status === 0) return;
    
    // Obtenemos el color según el tipo de ladrillo
    const color = this.colors[this.type];
    
    // Dibujamos el rectángulo principal del ladrillo
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Añadimos efectos de borde para dar profundidad (estilo Arkanoid clásico)
    
    // Borde superior e izquierdo (más claro para efecto de luz)
    ctx.fillStyle = this._lightenColor(color, 30);
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x + this.width - 3, this.y + 3);
    ctx.lineTo(this.x + 3, this.y + 3);
    ctx.lineTo(this.x + 3, this.y + this.height - 3);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.closePath();
    ctx.fill();
    
    // Borde inferior y derecho (más oscuro para efecto de sombra)
    ctx.fillStyle = this._darkenColor(color, 30);
    ctx.beginPath();
    ctx.moveTo(this.x + this.width, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + 3, this.y + this.height - 3);
    ctx.lineTo(this.x + this.width - 3, this.y + this.height - 3);
    ctx.lineTo(this.x + this.width - 3, this.y + 3);
    ctx.closePath();
    ctx.fill();
  }
  
  /**
   * Aclara un color CSS en formato hexadecimal
   * @param {string} color - Color en formato hexadecimal (#RRGGBB)
   * @param {number} percent - Porcentaje de aclarado (0-100)
   * @returns {string} - Color aclarado en formato hexadecimal
   * @private
   */
  _lightenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, ((num >> 16) & 0xff) + amt);
    const G = Math.min(255, ((num >> 8) & 0xff) + amt);
    const B = Math.min(255, (num & 0xff) + amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
  }
  
  /**
   * Oscurece un color CSS en formato hexadecimal
   * @param {string} color - Color en formato hexadecimal (#RRGGBB)
   * @param {number} percent - Porcentaje de oscurecimiento (0-100)
   * @returns {string} - Color oscurecido en formato hexadecimal
   * @private
   */
  _darkenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, ((num >> 16) & 0xff) - amt);
    const G = Math.max(0, ((num >> 8) & 0xff) - amt);
    const B = Math.max(0, (num & 0xff) - amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
  }
} 