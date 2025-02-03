import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import IntroScene from './scenes/IntroScene.js';

// Verify scenes were imported
console.log('Imported scenes:', {
    BootScene: !!BootScene,
    MenuScene: !!MenuScene,
    IntroScene: !!IntroScene,
    GameScene: !!GameScene,
    GameOverScene: !!GameOverScene
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, IntroScene, GameScene, GameOverScene]
};

window.addEventListener('load', () => {
    console.log('Creating game with scenes:', config.scene.map(s => s.name));
    new Phaser.Game(config);
});
