import { GAME_CONFIG } from '../config.js';

/**
 * Clase para manejar los power-ups del juego
 */
export class PowerUp {
  /**
   * Constructor de un power-up
   * @param {number} x - Posición X inicial
   * @param {number} y - Posición Y inicial
   * @param {string} type - Tipo de power-up
   */
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 24;
    this.height = 12;
    this.speed = GAME_CONFIG.powerUps.fallSpeed;
    this.active = true;
  }

  /**
   * Actualiza la posición del power-up (caída)
   * @param {number} canvasHeight - Alto del canvas
   * @returns {boolean} - true si el power-up sigue activo, false si ha salido de la pantalla
   */
  update(canvasHeight) {
    if (!this.active) return false;
    
    this.y += this.speed;
    
    // Si el power-up sale de la pantalla, lo desactivamos
    if (this.y > canvasHeight) {
      this.active = false;
      return false;
    }
    
    return true;
  }

  /**
   * Comprueba si el power-up ha sido recogido por la paleta
   * @param {Object} paddle - Objeto de la paleta
   * @returns {boolean} - true si ha sido recogido, false en caso contrario
   */
  checkCollision(paddle) {
    if (!this.active) return false;
    
    // Comprobamos si el power-up colisiona con la paleta
    if (
      this.x < paddle.x + paddle.width &&
      this.x + this.width > paddle.x &&
      this.y < paddle.y + paddle.height &&
      this.y + this.height > paddle.y
    ) {
      this.active = false;
      return true;
    }
    
    return false;
  }

  /**
   * Dibuja el power-up en el canvas si está activo
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   * @param {HTMLImageElement} spriteImg - Imagen de sprites
   */
  draw(ctx, spriteImg) {
    if (!this.active) return;
    
    const spritePos = GAME_CONFIG.spritePositions.powerUps[this.type];
    
    // Si el sprite no existe para este tipo, usamos uno genérico
    if (!spritePos) {
      // Dibujar un power-up genérico
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      return;
    }
    
    // Dibujar el power-up desde el spritesheet
    ctx.drawImage(
      spriteImg,
      spritePos.x, spritePos.y,
      spritePos.width, spritePos.height,
      this.x, this.y,
      this.width, this.height
    );
    
    // Opcional: Añadir un efecto de brillo o parpadeo
    if (Math.random() > 0.7) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Genera un power-up aleatorio en la posición indicada
   * @param {number} x - Posición X
   * @param {number} y - Posición Y
   * @returns {PowerUp|null} - Objeto PowerUp o null si no se genera
   */
  static generateRandom(x, y) {
    // Comprobamos si se genera un power-up basado en la probabilidad
    if (Math.random() > GAME_CONFIG.powerUps.chance) {
      return null;
    }
    
    // Elegimos un tipo aleatorio entre los disponibles
    const types = GAME_CONFIG.powerUps.types;
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return new PowerUp(x, y, randomType);
  }
} 