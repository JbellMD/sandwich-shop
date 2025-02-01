export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Add background with fade in
        const bg = this.add.image(400, 300, 'background');
        const scaleX = 800 / bg.width;
        const scaleY = 600 / bg.height;
        const scale = Math.min(scaleX, scaleY);
        bg.setScale(scale);
        bg.alpha = 0;
        
        // Create title text with shadow effect
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
        title.setScale(0.5);

        // Create a custom start button
        const buttonWidth = 200;
        const buttonHeight = 60;
        const button = this.add.graphics();
        
        // Button container
        const buttonContainer = this.add.container(400, 350);  
        buttonContainer.setSize(buttonWidth, buttonHeight);
        
        // Button background
        button.fillStyle(0x4CAF50, 1);
        button.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
        button.lineStyle(4, 0x45a049);
        button.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
        
        // Button text
        const buttonText = this.add.text(0, 0, 'PLAY', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#45a049',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        buttonContainer.add([button, buttonText]);
        buttonContainer.setAlpha(0);
        
        // Make button interactive with a much larger hit area
        const hitAreaWidth = buttonWidth * 2;  // Double the width
        const hitAreaHeight = buttonHeight * 2.5;  // 2.5x the height
        const hitArea = new Phaser.Geom.Rectangle(
            -hitAreaWidth/2,  // Center the larger hit area
            -hitAreaHeight/2,
            hitAreaWidth,
            hitAreaHeight
        );
        buttonContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        
        // Debug visualization of hit area (comment out in production)
        // const hitAreaDebug = this.add.rectangle(400, 350, hitAreaWidth, hitAreaHeight);
        // hitAreaDebug.setStrokeStyle(2, 0xff0000);
        // hitAreaDebug.setFillStyle(0xff0000, 0.2);
        
        // Add hover effects
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });
        
        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        
        buttonContainer.on('pointerdown', () => {
            // Click effect
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    // Start transition to game
                    this.cameras.main.fade(1000, 0, 0, 0);
                    this.time.delayedCall(900, () => {
                        this.scene.start('GameScene');
                    });
                }
            });
        });

        // Add instructions with style
        const instructionsStyle = {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        };
        
        const instructions = this.add.text(400, 450,  
            'Make sandwiches according to customer orders\nBefore time runs out!', 
            instructionsStyle
        ).setOrigin(0.5);
        instructions.alpha = 0;

        // Animate elements in
        this.tweens.add({
            targets: [bg],
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: [title],
            alpha: 1,
            scale: 1,
            duration: 1200,
            ease: 'Back.out',
            delay: 500
        });

        this.tweens.add({
            targets: [buttonContainer],
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            delay: 1000
        });

        this.tweens.add({
            targets: [instructions],
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            delay: 1500
        });
    }
}
