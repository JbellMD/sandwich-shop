export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        // Game Over text
        this.add.text(400, 200, 'Game Over', {
            fontSize: '64px',
            fill: '#000'
        }).setOrigin(0.5);

        // Display final score
        this.add.text(400, 280, `Final Score: ${this.finalScore}`, {
            fontSize: '32px',
            fill: '#000'
        }).setOrigin(0.5);

        // Add restart button
        const restartButton = this.add.rectangle(400, 350, 200, 50, 0x00ff00);
        const restartText = this.add.text(400, 350, 'Play Again', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
