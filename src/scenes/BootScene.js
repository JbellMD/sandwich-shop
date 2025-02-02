export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load only the background image in BootScene
        this.load.image('background', 'assets/images/ui/background.jpg');
    }

    create() {
        // Add background with fade in
        const bg = this.add.image(400, 300, 'background');
        const scaleX = 800 / bg.width;
        const scaleY = 600 / bg.height;
        const scale = Math.min(scaleX, scaleY);
        bg.setScale(scale);
        bg.alpha = 0;

        // Add title
        const titleStyle = {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 5,
                fill: true
            }
        };
        
        const title = this.add.text(400, 150, "Adriel's\nSandwich Shop", titleStyle).setOrigin(0.5);
        title.alpha = 0;

        // Create loading text container
        const loadingContainer = this.add.container(400, 300);
        
        // Create loading text first
        const loadingText = this.add.text(-60, 0, 'Loading', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        loadingContainer.add(loadingText);

        // Create dots for animation
        const dotStyle = {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        };

        const dots = [];
        for (let i = 0; i < 3; i++) {
            const dot = this.add.text(20 + (i * 20), 0, '.', dotStyle).setOrigin(0.5);
            dots.push(dot);
            loadingContainer.add(dot);
        }

        // Fade in background and title
        this.tweens.add({
            targets: [bg, title],
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        // Animate dots
        dots.forEach((dot, index) => {
            this.tweens.add({
                targets: dot,
                y: -20,
                duration: 500,
                ease: 'Power2',
                yoyo: true,
                repeat: -1,
                delay: index * 100
            });
        });

        // Create a progress bar
        const barWidth = 200;
        const barHeight = 10;
        const barBg = this.add.rectangle(400, 380, barWidth + 4, barHeight + 4, 0x000000);
        const progressBar = this.add.rectangle(400 - barWidth/2, 380, 0, barHeight, 0x4CAF50);
        progressBar.setOrigin(0, 0.5);

        // Animate progress bar
        this.tweens.add({
            targets: progressBar,
            width: barWidth,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Fade out everything
                this.cameras.main.fade(500, 0, 0, 0);
                this.time.delayedCall(450, () => {
                    this.scene.start('MenuScene');
                });
            }
        });
    }
}
