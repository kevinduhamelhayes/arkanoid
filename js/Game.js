import { GAME_CONFIG } from './config.js';
import { AssetLoader } from './utils/AssetLoader.js';
import { Paddle } from './components/Paddle.js';
import { Ball } from './components/Ball.js';
import { Brick } from './components/Brick.js';
import { PowerUp } from './components/PowerUp.js';

/**
 * Clase principal del juego Arkanoid
 */
export class Game {
  /**
   * Constructor del juego
   * @param {HTMLCanvasElement} canvas - Elemento canvas del juego
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Dimensiones del canvas
    this.canvas.width = GAME_CONFIG.canvas.width;
    this.canvas.height = GAME_CONFIG.canvas.height;
    
    // Estado del juego
    this.gameState = {
      score: 0,
      lives: 3,
      gameOver: false,
      gamePaused: false,
      levelCompleted: false
    };
    
    // Control de teclado y ratón
    this.keyStates = {
      rightPressed: false,
      leftPressed: false
    };
    
    // Inicializamos el cargador de recursos
    this.assetLoader = new AssetLoader();
    
    // Creamos los componentes del juego
    this.paddle = new Paddle(this.canvas.width);
    this.balls = [new Ball(this.paddle.x + this.paddle.width / 2, this.paddle.y - 10)];
    this.bricks = [];
    this.powerUps = [];
    
    // Inicializamos los eventos y recursos
    this._setupEventListeners();
    this._loadAssets();
  }

  /**
   * Configura los eventos de teclado y ratón
   * @private
   */
  _setupEventListeners() {
    // Eventos de teclado
    document.addEventListener('keydown', this._handleKeyDown.bind(this));
    document.addEventListener('keyup', this._handleKeyUp.bind(this));
    
    // Eventos de ratón
    this.canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
    
    // Eventos táctiles para dispositivos móviles
    this.canvas.addEventListener('touchmove', this._handleTouchMove.bind(this));
  }

  /**
   * Maneja el evento keydown
   * @param {KeyboardEvent} e - Evento de teclado
   * @private
   */
  _handleKeyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.keyStates.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.keyStates.leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      // Lanzar bola o reiniciar juego
      if (this.gameState.gameOver || this.gameState.levelCompleted) {
        this._resetGame();
      } else {
        this._launchBalls();
      }
    } else if (e.key === 'p' || e.key === 'P') {
      // Pausar/reanudar juego
      this.gameState.gamePaused = !this.gameState.gamePaused;
    }
  }

  /**
   * Maneja el evento keyup
   * @param {KeyboardEvent} e - Evento de teclado
   * @private
   */
  _handleKeyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.keyStates.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.keyStates.leftPressed = false;
    }
  }

  /**
   * Maneja el evento mousemove
   * @param {MouseEvent} e - Evento de ratón
   * @private
   */
  _handleMouseMove(e) {
    const relativeX = e.clientX - this.canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.moveTo(relativeX, this.canvas.width);
    }
  }

  /**
   * Maneja el evento touchmove
   * @param {TouchEvent} e - Evento táctil
   * @private
   */
  _handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const relativeX = touch.clientX - this.canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.moveTo(relativeX, this.canvas.width);
    }
  }

  /**
   * Carga los recursos del juego
   * @private
   */
  _loadAssets() {
    this.assetLoader.addImage('bricks', 'bricks.png');
    this.assetLoader.addImage('sprite', 'sprite.png');
    
    this.assetLoader.onLoadComplete(() => {
      this._createBricks();
      this._startGameLoop();
    });
  }

  /**
   * Crea los ladrillos del nivel
   * @private
   */
  _createBricks() {
    this.bricks = [];
    
    const {
      rowCount, columnCount, width, height, padding, offsetTop, offsetLeft
    } = GAME_CONFIG.bricks;
    
    for (let c = 0; c < columnCount; c++) {
      for (let r = 0; r < rowCount; r++) {
        const brickX = c * (width + padding) + offsetLeft;
        const brickY = r * (height + padding) + offsetTop;
        
        // Tipo de ladrillo según la fila (máximo 8 tipos)
        const brickType = Math.min(r, 7);
        
        this.bricks.push(new Brick(brickX, brickY, brickType));
      }
    }
  }

  /**
   * Inicia el bucle principal del juego
   * @private
   */
  _startGameLoop() {
    // Función de bucle del juego
    const gameLoop = () => {
      this._update();
      this._render();
      requestAnimationFrame(gameLoop);
    };
    
    // Iniciamos el bucle
    gameLoop();
    
    // Registramos las instrucciones en la consola
    console.log('Controles:');
    console.log('- Usa las flechas izquierda/derecha o el ratón para mover la paleta');
    console.log('- Presiona Espacio para lanzar la bola');
    console.log('- Presiona P para pausar/reanudar el juego');
  }

  /**
   * Actualiza el estado del juego
   * @private
   */
  _update() {
    if (this.gameState.gamePaused || this.gameState.gameOver || this.gameState.levelCompleted) {
      return;
    }
    
    // Actualizar posición de la paleta
    if (this.keyStates.rightPressed) {
      this.paddle.moveRight(this.canvas.width);
    } else if (this.keyStates.leftPressed) {
      this.paddle.moveLeft();
    }
    
    // Actualizar posición de las bolas que no están en juego
    this.balls.forEach(ball => {
      if (!ball.inPlay) {
        ball.updateWithPaddle(this.paddle.x, this.paddle.width, this.paddle.y);
      }
    });
    
    // Actualizar posición de las bolas en juego
    const activeBalls = [];
    
    this.balls.forEach(ball => {
      if (ball.inPlay) {
        const fell = ball.update(this.canvas.width, this.canvas.height, this.paddle);
        
        if (!fell) {
          activeBalls.push(ball);
          
          // Comprobar colisiones con los ladrillos
          this._checkBrickCollisions(ball);
        }
      } else {
        activeBalls.push(ball);
      }
    });
    
    // Si todas las bolas cayeron, perdemos una vida
    if (activeBalls.length === 0 || (activeBalls.length === this.balls.length && !this.balls.some(ball => ball.inPlay))) {
      this.gameState.lives--;
      
      if (this.gameState.lives <= 0) {
        this.gameState.gameOver = true;
      } else {
        // Reiniciamos la bola principal
        if (this.balls.length > 1) {
          // Eliminamos las bolas extras
          this.balls = [this.balls[0]];
        }
        
        // Posicionamos la bola sobre la paleta
        this.balls[0].inPlay = false;
        this.balls[0].updateWithPaddle(this.paddle.x, this.paddle.width, this.paddle.y);
      }
    } else {
      // Actualizamos la lista de bolas
      this.balls = activeBalls;
    }
    
    // Actualizar power-ups
    this._updatePowerUps();
    
    // Comprobar si se han eliminado todos los ladrillos
    if (this.bricks.every(brick => brick.status === 0)) {
      this.gameState.levelCompleted = true;
    }
  }

  /**
   * Comprueba colisiones de una bola con los ladrillos
   * @param {Ball} ball - Bola a comprobar
   * @private
   */
  _checkBrickCollisions(ball) {
    for (const brick of this.bricks) {
      if (brick.status === 1 && brick.checkCollision(ball)) {
        // Si hay colisión, incrementamos la puntuación
        this.gameState.score += brick.points;
        
        // Posibilidad de generar un power-up
        const powerUp = PowerUp.generateRandom(
          brick.x + brick.width / 2 - 12,  // Centrado en X
          brick.y + brick.height           // Justo debajo del ladrillo
        );
        
        if (powerUp) {
          this.powerUps.push(powerUp);
        }
        
        // Solo comprobamos un ladrillo por iteración
        break;
      }
    }
  }

  /**
   * Actualiza los power-ups
   * @private
   */
  _updatePowerUps() {
    const activePowerUps = [];
    
    for (const powerUp of this.powerUps) {
      // Actualizar posición
      if (powerUp.update(this.canvas.height)) {
        // Comprobar colisión con la paleta
        if (powerUp.checkCollision(this.paddle)) {
          this._applyPowerUp(powerUp.type);
        } else {
          activePowerUps.push(powerUp);
        }
      }
    }
    
    // Actualizar la lista de power-ups activos
    this.powerUps = activePowerUps;
  }

  /**
   * Aplica un power-up
   * @param {string} type - Tipo de power-up
   * @private
   */
  _applyPowerUp(type) {
    switch (type) {
      case 'expand-paddle':
      case 'shrink-paddle':
        // Power-ups que afectan a la paleta
        this.paddle.applyPowerUp(type);
        break;
        
      case 'slow-ball':
      case 'fast-ball':
        // Power-ups que afectan a todas las bolas
        this.balls.forEach(ball => {
          if (ball.inPlay) {
            ball.applyPowerUp(type);
          }
        });
        break;
        
      case 'multi-ball':
        // Añadir bolas extras
        this._addMultiBalls();
        break;
        
      case 'extra-life':
        // Vida extra
        this.gameState.lives++;
        break;
    }
  }

  /**
   * Añade bolas adicionales (power-up multi-ball)
   * @private
   */
  _addMultiBalls() {
    // Solo añadimos bolas si hay alguna en juego
    const activeBalls = this.balls.filter(ball => ball.inPlay);
    if (activeBalls.length === 0) return;
    
    // Cogemos una bola activa como referencia
    const refBall = activeBalls[0];
    
    // Añadimos dos bolas nuevas con direcciones ligeramente diferentes
    const angles = [Math.PI / 6, -Math.PI / 6]; // 30 grados a cada lado
    
    angles.forEach((angle, index) => {
      // Crear una nueva bola en la misma posición
      const newBall = new Ball(refBall.x, refBall.y, this.balls.length + index);
      
      // Calcular nueva dirección rotando la dirección actual
      const currentAngle = Math.atan2(refBall.dy, refBall.dx);
      const newAngle = currentAngle + angle;
      
      // Aplicar la nueva dirección manteniendo la velocidad
      newBall.dx = Math.cos(newAngle) * refBall.speed;
      newBall.dy = Math.sin(newAngle) * refBall.speed;
      
      // Activar la bola
      newBall.inPlay = true;
      
      // Añadir a la lista
      this.balls.push(newBall);
    });
  }

  /**
   * Lanza todas las bolas que no están en juego
   * @private
   */
  _launchBalls() {
    this.balls.forEach(ball => {
      if (!ball.inPlay) {
        ball.launch();
      }
    });
  }

  /**
   * Renderiza todos los elementos del juego
   * @private
   */
  _render() {
    // Limpiar el canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Obtenemos las imágenes
    const bricksImg = this.assetLoader.getImage('bricks');
    const spriteImg = this.assetLoader.getImage('sprite');
    
    // Dibujar los ladrillos
    this.bricks.forEach(brick => brick.draw(this.ctx, bricksImg));
    
    // Dibujar los power-ups
    this.powerUps.forEach(powerUp => powerUp.draw(this.ctx, spriteImg));
    
    // Dibujar la paleta
    this.paddle.draw(this.ctx, spriteImg);
    
    // Dibujar las bolas
    this.balls.forEach(ball => ball.draw(this.ctx, spriteImg));
    
    // Dibujar la interfaz
    this._drawUI();
  }

  /**
   * Dibuja la interfaz del juego (puntuación, vidas, mensajes)
   * @private
   */
  _drawUI() {
    // Dibujar puntuación
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText(`Puntuación: ${this.gameState.score}`, 20, 30);
    
    // Dibujar vidas
    this.ctx.fillText(`Vidas: ${this.gameState.lives}`, this.canvas.width - 100, 30);
    
    // Dibujar mensajes según el estado del juego
    if (this.gameState.gameOver) {
      this.ctx.font = 'bold 36px Arial';
      this.ctx.fillStyle = '#FF0000';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('¡GAME OVER!', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '24px Arial';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText('Presiona ESPACIO para reiniciar', this.canvas.width / 2, this.canvas.height / 2 + 40);
      this.ctx.textAlign = 'start';
    } else if (this.gameState.levelCompleted) {
      this.ctx.font = 'bold 36px Arial';
      this.ctx.fillStyle = '#00FF00';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('¡NIVEL COMPLETADO!', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '24px Arial';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText('Presiona ESPACIO para continuar', this.canvas.width / 2, this.canvas.height / 2 + 40);
      this.ctx.textAlign = 'start';
    } else if (this.gameState.gamePaused) {
      this.ctx.font = 'bold 36px Arial';
      this.ctx.fillStyle = '#FFFF00';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSA', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '24px Arial';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText('Presiona P para continuar', this.canvas.width / 2, this.canvas.height / 2 + 40);
      this.ctx.textAlign = 'start';
    }
  }

  /**
   * Reinicia el juego
   * @private
   */
  _resetGame() {
    // Reiniciar estado del juego
    this.gameState.score = 0;
    this.gameState.lives = 3;
    this.gameState.gameOver = false;
    this.gameState.levelCompleted = false;
    
    // Reiniciar la paleta
    this.paddle = new Paddle(this.canvas.width);
    
    // Reiniciar la bola
    this.balls = [new Ball(this.paddle.x + this.paddle.width / 2, this.paddle.y - 10)];
    
    // Reiniciar los power-ups
    this.powerUps = [];
    
    // Recrear los ladrillos
    this._createBricks();
  }
} 