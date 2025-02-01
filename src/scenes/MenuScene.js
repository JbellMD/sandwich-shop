export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');

        // Add title with style
        const title = this.add.text(400, 200, 'Sandwich Shop', {
            fontSize: '64px',
            fill: '#000',
            stroke: '#fff',
            strokeThickness: 6,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add start button
        const startButton = this.add.image(400, 300, 'button_start');
        const startText = this.add.text(400, 300, 'Start Game', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Make button interactive
        startButton.setInteractive();
        startButton.on('pointerover', () => {
            startButton.setTint(0xdddddd);
            startText.setTint(0xdddddd);
        });
        startButton.on('pointerout', () => {
            startButton.clearTint();
            startText.clearTint();
        });
        startButton.on('pointerdown', () => {
            // Add transition effect
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });

        // Add some instructions
        this.add.text(400, 400, 'Make sandwiches according to customer orders\nBefore time runs out!', {
            fontSize: '24px',
            fill: '#000',
            align: 'center'
        }).setOrigin(0.5);

        // Add fade-in effect
        this.cameras.main.fadeIn(1000);
    }
}
