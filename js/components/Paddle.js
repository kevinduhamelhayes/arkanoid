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
        this.width = GAME_CONFIG.spritePositions.paddle.expanded.width;
        break;
      case 'shrink-paddle':
        this.state = 'shrunk';
        this.width = GAME_CONFIG.spritePositions.paddle.shrunk.width;
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
    this.width = GAME_CONFIG.paddle.width;
  }

  /**
   * Dibuja la paleta en el canvas
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   * @param {HTMLImageElement} spriteImg - Imagen de sprites
   */
  draw(ctx, spriteImg) {
    let spritePos;
    
    // Seleccionamos la parte correcta del sprite según el estado
    switch (this.state) {
      case 'expanded':
        spritePos = GAME_CONFIG.spritePositions.paddle.expanded;
        break;
      case 'shrunk':
        spritePos = GAME_CONFIG.spritePositions.paddle.shrunk;
        break;
      default:
        spritePos = GAME_CONFIG.spritePositions.paddle.normal;
    }
    
    // Dibujamos la paleta
    ctx.drawImage(
      spriteImg,
      spritePos.x, spritePos.y,
      spritePos.width, spritePos.height,
      this.x, this.y,
      this.width, this.height
    );
  }
} 