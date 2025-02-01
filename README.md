# Sandwich Shop Game

A browser-based sandwich assembly game built with Phaser.js where players must create sandwiches according to customer orders before time runs out.

## Features

- Click-based sandwich assembly
- Time-based order system
- Score tracking
- Visual feedback and animations
- 12 different ingredients to choose from

## Getting Started

### Prerequisites

- A modern web browser
- A local web server (Python's `http.server` or any other)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JbellMD/sandwich-shop.git
```

2. Navigate to the project directory:
```bash
cd sandwich-shop
```

3. Start a local server. For example, using Python:
```bash
python -m http.server 8000
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

## How to Play

1. Click the "Start Game" button on the menu screen
2. Watch for customer orders at the top of the screen
3. Click ingredients from either side to add them to your sandwich
4. Complete the order before the timer runs out
5. Score points for correct orders, lose points for mistakes

## Development

### Project Structure

```
sandwich-shop/
│── assets/
│   ├── images/
│   │   ├── ingredients/
│   │   ├── customers/
│   │   ├── ui/
│── src/
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── PreloadScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── GameOverScene.js
│   ├── main.js
│── index.html
```

### Built With

- [Phaser 3](https://phaser.io/) - HTML5 game framework
- HTML5 Canvas
- JavaScript (ES6+)

## License

This project is licensed under the MIT License
