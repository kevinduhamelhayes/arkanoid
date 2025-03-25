import { GAME_CONFIG } from '../config.js';

/**
 * Clase para manejar la paleta del jugador
 */
export class Paddle {
  /**
   * Constructor de la paleta
   * @param {number} canvasWidth - Ancho del canvas
   */
  constructor(canvasWidth) {
    this.width = GAME_CONFIG.paddle.width;
    this.height = GAME_CONFIG.paddle.height;
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = GAME_CONFIG.paddle.y;
    this.speed = GAME_CONFIG.paddle.speed;
    this.state = 'normal'; // normal, expanded, shrunk
    this.powerUpTimer = null;
    
    // Definimos los colores para los diferentes estados
    this.colors = {
      normal: '#0088FF',    // Azul
      expanded: '#44AAFF',  // Azul claro
      shrunk: '#0066CC'     // Azul oscuro
    };
    
    // Dimensiones según el estado
    this.dimensions = {
      normal: { width: GAME_CONFIG.paddle.width, height: GAME_CONFIG.paddle.height },
      expanded: { width: GAME_CONFIG.paddle.width * 1.5, height: GAME_CONFIG.paddle.height },
      shrunk: { width: GAME_CONFIG.paddle.width * 0.75, height: GAME_CONFIG.paddle.height }
    };
  }

  /**
   * Mueve la paleta hacia la izquierda
   */
  moveLeft() {
    this.x -= this.speed;
    if (this.x < 0) {
      this.x = 0;
    }
  }

  /**
   * Mueve la paleta hacia la derecha
   * @param {number} canvasWidth - Ancho del canvas
   */
  moveRight(canvasWidth) {
    this.x += this.speed;
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }
  }

  /**
   * Mueve la paleta a una posición específica
   * @param {number} x - Posición X objetivo
   * @param {number} canvasWidth - Ancho del canvas
   */
  moveTo(x, canvasWidth) {
    this.x = x - this.width / 2;
    
    // Mantener la paleta dentro del canvas
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width;
    }
  }

  /**
   * Aplica un power-up a la paleta
   * @param {string} powerUpType - Tipo de power-up
   */
  applyPowerUp(powerUpType) {
    // Limpiamos cualquier timer anterior
    if (this.powerUpTimer) {
      clearTimeout(this.powerUpTimer);
      this.powerUpTimer = null;
    }

    // Aplicamos el power-up
    switch (powerUpType) {
      case 'expand-paddle':
        this.state = 'expanded';
        this.width = this.dimensions.expanded.width;
        break;
      case 'shrink-paddle':
        this.state = 'shrunk';
        this.width = this.dimensions.shrunk.width;
        break;
      default:
        return; // Si no es un power-up para la paleta, salimos
    }

    // Configuramos el timer para revertir el efecto
    this.powerUpTimer = setTimeout(() => {
      this.resetState();
    }, GAME_CONFIG.powerUps.duration);
  }

  /**
   * Revierte la paleta a su estado normal
   */
  resetState() {
    this.state = 'normal';
    this.width = this.dimensions.normal.width;
  }

  /**
   * Dibuja la paleta en el canvas
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   */
  draw(ctx) {
    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x, this.y + this.height
    );
    gradient.addColorStop(0, this.colors[this.state]);
    gradient.addColorStop(0.5, '#FFFFFF');
    gradient.addColorStop(1, this.colors[this.state]);
    
    // Dibujamos el cuerpo principal de la paleta
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Añadimos bordes para dar sensación de profundidad
    
    // Parte superior e izquierda (más clara)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x + this.width - 2, this.y + 2);
    ctx.lineTo(this.x + 2, this.y + 2);
    ctx.lineTo(this.x + 2, this.y + this.height - 2);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.closePath();
    ctx.fill();
    
    // Parte inferior y derecha (más oscura)
    ctx.fillStyle = '#0044AA';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + 2, this.y + this.height - 2);
    ctx.lineTo(this.x + this.width - 2, this.y + this.height - 2);
    ctx.lineTo(this.x + this.width - 2, this.y + 2);
    ctx.closePath();
    ctx.fill();
    
    // Añadimos detalles a la paleta (línea decorativa)
    ctx.strokeStyle = '#0044AA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x + 10, this.y + this.height / 2);
    ctx.lineTo(this.x + this.width - 10, this.y + this.height / 2);
    ctx.stroke();
  }
} 