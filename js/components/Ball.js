import { GAME_CONFIG } from '../config.js';

/**
 * Clase para manejar la bola del juego
 */
export class Ball {
  /**
   * Constructor de la bola
   * @param {number} x - Posición X inicial
   * @param {number} y - Posición Y inicial
   * @param {number} [id=0] - Identificador de la bola (útil para multibola)
   */
  constructor(x, y, id = 0) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.radius = GAME_CONFIG.ball.radius;
    this.speed = GAME_CONFIG.ball.initialSpeed;
    this.dx = this.speed;
    this.dy = -this.speed;
    this.inPlay = false;
    this.powerUpTimer = null;
  }

  /**
   * Actualiza la posición de la bola cuando no está en juego
   * @param {number} paddleX - Posición X de la paleta
   * @param {number} paddleWidth - Ancho de la paleta
   * @param {number} paddleY - Posición Y de la paleta
   */
  updateWithPaddle(paddleX, paddleWidth, paddleY) {
    this.x = paddleX + paddleWidth / 2;
    this.y = paddleY - this.radius;
  }

  /**
   * Pone la bola en juego
   */
  launch() {
    this.inPlay = true;
  }

  /**
   * Aplica un power-up a la bola
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
      case 'slow-ball':
        this.speed = GAME_CONFIG.ball.initialSpeed * 0.7; // 30% más lenta
        break;
      case 'fast-ball':
        this.speed = GAME_CONFIG.ball.initialSpeed * 1.5; // 50% más rápida
        break;
      default:
        return; // Si no es un power-up para la bola, salimos
    }

    // Mantenemos la dirección pero ajustamos la velocidad
    const angle = Math.atan2(this.dy, this.dx);
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;

    // Configuramos el timer para revertir el efecto
    this.powerUpTimer = setTimeout(() => {
      this.resetSpeed();
    }, GAME_CONFIG.powerUps.duration);
  }

  /**
   * Revierte la velocidad de la bola a su valor normal
   */
  resetSpeed() {
    this.speed = GAME_CONFIG.ball.initialSpeed;
    
    // Mantenemos la dirección pero ajustamos la velocidad
    const angle = Math.atan2(this.dy, this.dx);
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  /**
   * Actualiza la posición de la bola y gestiona los rebotes
   * @param {number} canvasWidth - Ancho del canvas
   * @param {number} canvasHeight - Alto del canvas
   * @param {Object} paddle - Objeto de la paleta
   * @returns {boolean} - true si la bola cayó al fondo, false en caso contrario
   */
  update(canvasWidth, canvasHeight, paddle) {
    if (!this.inPlay) return false;

    // Mover la bola
    this.x += this.dx;
    this.y += this.dy;
    
    let fell = false;

    // Rebotar en las paredes laterales
    if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    
    // Rebotar en la pared superior
    if (this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    
    // Comprobar si la bola toca el fondo
    if (this.y + this.radius > canvasHeight) {
      this.inPlay = false;
      fell = true;
    }
    
    // Comprobar colisión con la paleta
    if (
      this.y + this.radius > paddle.y &&
      this.y - this.radius < paddle.y + paddle.height &&
      this.x > paddle.x &&
      this.x < paddle.x + paddle.width
    ) {
      // Calculamos el punto de impacto relativo en la paleta (de -1 a 1)
      const impactPoint = (this.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      
      // Calculamos el ángulo de rebote (de -60 a 60 grados)
      const angle = impactPoint * Math.PI / 3; // 60 grados en radianes
      
      // Calculamos la nueva dirección basada en el ángulo
      this.dx = this.speed * Math.sin(angle);
      this.dy = -this.speed * Math.cos(angle);
      
      // Nos aseguramos de que la bola siempre suba
      if (this.dy > 0) {
        this.dy = -this.dy;
      }
    }

    return fell;
  }

  /**
   * Dibuja la bola en el canvas
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   */
  draw(ctx) {
    // Dibujamos un círculo para la bola
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF'; // Bola blanca como en el juego original
    ctx.fill();
    ctx.closePath();
    
    // Añadimos un pequeño brillo para darle efecto 3D
    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.closePath();
  }
} 