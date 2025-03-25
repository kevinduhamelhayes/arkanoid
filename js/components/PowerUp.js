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
    
    // Definir colores para los diferentes tipos de power-up
    this.colors = {
      'expand-paddle': '#FF88FF', // Rosa
      'shrink-paddle': '#FF4444', // Rojo
      'slow-ball': '#44FF44',     // Verde
      'fast-ball': '#FFFF44',     // Amarillo
      'multi-ball': '#44FFFF',    // Cyan
      'extra-life': '#FF88FF'     // Rosa (vida extra)
    };
    
    // Caracteres para identificar cada power-up
    this.labels = {
      'expand-paddle': 'E',
      'shrink-paddle': 'S',
      'slow-ball': '-',
      'fast-ball': '+',
      'multi-ball': 'M',
      'extra-life': '♥'
    };
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
   */
  draw(ctx) {
    if (!this.active) return;
    
    const color = this.colors[this.type] || '#FFFFFF';
    const label = this.labels[this.type] || '?';
    
    // Efecto de parpadeo
    const alpha = 0.7 + Math.sin(Date.now() / 200) * 0.3;
    
    // Dibujamos la cápsula del power-up
    ctx.fillStyle = color;
    this._drawCapsule(ctx);
    
    // Dibujar borde
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Dibujar texto identificativo
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, this.x + this.width / 2, this.y + this.height / 2);
    
    // Restaurar configuración
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }
  
  /**
   * Dibuja la cápsula del power-up con efecto de brillo
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   * @private
   */
  _drawCapsule(ctx) {
    // Dibujar fondo de la cápsula
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Crear gradiente para efecto de brillo
    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x, this.y + this.height
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    
    // Aplicar gradiente
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
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