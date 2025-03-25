# Arkanoid Game

Una implementación moderna de Arkanoid en JavaScript puro, utilizando Canvas y ES6+.

## Características

- 🎮 Juego Arkanoid clásico con gráficos mejorados
- 🧱 Múltiples tipos de ladrillos con diferentes puntuaciones
- 🏓 Física de rebote realista
- 💪 Sistema de power-ups:
  - Expansión de la paleta
  - Reducción de la paleta
  - Pelota lenta
  - Pelota rápida
  - Multi-bola
  - Vida extra
- 📱 Compatibilidad con dispositivos táctiles
- 🎯 Detección de colisiones precisa
- 🏆 Sistema de puntuación y vidas

## Estructura del Proyecto

El proyecto está organizado siguiendo una arquitectura modular:

```
.
├── css/
│   └── styles.css             # Estilos del juego
├── js/
│   ├── components/           # Componentes del juego
│   │   ├── Ball.js           # Lógica de las bolas
│   │   ├── Brick.js          # Lógica de los ladrillos
│   │   ├── Paddle.js         # Lógica de la paleta
│   │   └── PowerUp.js        # Lógica de los power-ups
│   ├── utils/                # Utilidades
│   │   └── AssetLoader.js    # Cargador de recursos (imágenes)
│   ├── config.js             # Configuración del juego
│   ├── Game.js               # Clase principal del juego
│   └── main.js               # Punto de entrada
├── bkg.png                   # Imagen de fondo
├── bricks.png                # Sprites de ladrillos
├── sprite.png                # Sprites del juego
├── index.html                # Archivo HTML principal
└── README.md                 # Este archivo
```

## Cómo Jugar

1. Abre `index.html` en tu navegador
2. Usa las flechas izquierda/derecha o el ratón para mover la paleta
3. Presiona la barra espaciadora para lanzar la bola
4. Presiona P para pausar/reanudar el juego

## Desarrollo

El juego está desarrollado con JavaScript modular utilizando clases ES6+ y el sistema de módulos nativo.

Para realizar modificaciones:

1. Modifica los archivos en la carpeta correspondiente
2. Recarga la página para ver los cambios

## Créditos

Desarrollado como parte del reto de 100 proyectos JavaScript. 