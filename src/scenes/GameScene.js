export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.currentOrder = null;
        this.stack = [];
        this.stackSprites = []; // Track the sprite objects in the stack
    }

    init() {
        this.score = 0;
        this.stack = [];
        this.stackSprites = []; // Track the sprite objects in the stack
    }

    create() {
        // Add background with fade in
        const bg = this.add.image(400, 300, 'background');
        const scaleX = 800 / bg.width;
        const scaleY = 600 / bg.height;
        const scale = Math.min(scaleX, scaleY);
        bg.setScale(scale);
        bg.alpha = 0;

        // Setup UI and ingredients
        this.setupUI();
        this.setupIngredients();
        
        // Fade in all elements
        this.tweens.add({
            targets: [bg],
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        // Add fade-in effect for UI elements
        const uiElements = [...this.children.list].filter(child => child !== bg);
        uiElements.forEach((element, index) => {
            element.alpha = 0;
            this.tweens.add({
                targets: element,
                alpha: 1,
                duration: 400,
                ease: 'Power2',
                delay: 100 + (index * 50)
            });
        });

        // Add camera fade in
        this.cameras.main.fadeIn(500);

        this.createNewOrder();
    }

    setupUI() {
        // Create score text with better styling
        const scoreStyle = {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        };
        
        this.scoreText = this.add.text(20, 20, 'Score: 0', scoreStyle);
        this.score = 0;

        // Create dialogue box for orders
        const dialogueBoxWidth = 400;
        const dialogueBoxHeight = 80;
        const dialogueBox = this.add.graphics();
        
        // Add semi-transparent background
        dialogueBox.fillStyle(0x000000, 0.7);
        dialogueBox.fillRoundedRect(400, 20, dialogueBoxWidth, dialogueBoxHeight, 15);
        
        // Add border
        dialogueBox.lineStyle(3, 0xffffff, 1);
        dialogueBox.strokeRoundedRect(400, 20, dialogueBoxWidth, dialogueBoxHeight, 15);
        
        // Add decorative elements
        dialogueBox.lineStyle(2, 0xffffff, 0.5);
        dialogueBox.strokeRoundedRect(405, 25, dialogueBoxWidth - 10, dialogueBoxHeight - 10, 12);

        // Create order text with typing effect style
        const orderTextStyle = {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            wordWrap: { width: dialogueBoxWidth - 40 }
        };

        this.orderText = this.add.text(420, 40, '', orderTextStyle);

        // Timer bar with enhanced styling
        const timerBarWidth = 300;
        const timerBarHeight = 20;
        
        // Timer bar background with gradient
        const timerBarBg = this.add.graphics();
        timerBarBg.fillStyle(0x333333, 1);
        timerBarBg.fillRoundedRect(250, 550, timerBarWidth, timerBarHeight, 10);
        timerBarBg.lineStyle(2, 0x000000);
        timerBarBg.strokeRoundedRect(250, 550, timerBarWidth, timerBarHeight, 10);

        // Timer bar fill
        this.timerBar = this.add.graphics();
        this.timerBar.setDepth(1);
        
        // Store timer bar properties
        this.timerBarConfig = {
            x: 250,
            y: 550,
            width: timerBarWidth,
            height: timerBarHeight
        };

        // Add quit button
        const quitButton = this.add.graphics();
        const quitButtonWidth = 100;
        const quitButtonHeight = 40;
        
        // Create quit button container - moved to bottom right
        const quitButtonContainer = this.add.container(750, 550);
        quitButtonContainer.setSize(quitButtonWidth, quitButtonHeight);
        
        // Button background
        quitButton.fillStyle(0xff0000, 1);
        quitButton.fillRoundedRect(-quitButtonWidth/2, -quitButtonHeight/2, quitButtonWidth, quitButtonHeight, 10);
        quitButton.lineStyle(2, 0xcc0000);
        quitButton.strokeRoundedRect(-quitButtonWidth/2, -quitButtonHeight/2, quitButtonWidth, quitButtonHeight, 10);

        // Button text
        const quitText = this.add.text(0, 0, 'Quit', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        quitButtonContainer.add([quitButton, quitText]);
        
        // Make button interactive
        quitButtonContainer.setInteractive(new Phaser.Geom.Rectangle(
            -quitButtonWidth/2,
            -quitButtonHeight/2,
            quitButtonWidth,
            quitButtonHeight
        ), Phaser.Geom.Rectangle.Contains);
        
        // Add hover effects
        quitButtonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: quitButtonContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });
        
        quitButtonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: quitButtonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        
        // Add click handler
        quitButtonContainer.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(450, () => {
                this.scene.start('MenuScene');
            });
        });
    }

    setupIngredients() {
        // Define ingredients for both sides
        const leftIngredients = ['bread_top', 'bread_bottom', 'lettuce', 'cheese', 'tomato', 'meat'];
        const rightIngredients = ['bacon', 'egg', 'mayo', 'mustard', 'ketchup', 'onion'];
        
        // Color mapping for ingredients
        const ingredientColors = {
            bread_top: 0xF4A460,     // Sandy brown
            bread_bottom: 0xF4A460,   // Sandy brown
            lettuce: 0x90EE90,       // Light green
            cheese: 0xFFD700,        // Gold
            tomato: 0xFF6347,        // Tomato red
            meat: 0x8B4513,          // Saddle brown
            bacon: 0xCD5C5C,         // Indian red
            egg: 0xFFFACD,           // Lemon chiffon
            mayo: 0xFFFAFA,          // Snow white
            mustard: 0xFFD700,       // Gold
            ketchup: 0xFF0000,       // Red
            onion: 0xDCDCDC          // Gainsboro
        };

        // Left side ingredients
        leftIngredients.forEach((ingredient, index) => {
            const x = 180;  // Moved right from 150
            const y = 200 + (index * 50);
            
            // Create colored square for ingredient
            const square = this.add.rectangle(x, y, 30, 30, ingredientColors[ingredient]);
            square.setInteractive();
            
            // Hover effects
            square.on('pointerover', () => {
                square.setScale(1.1);
            });
            square.on('pointerout', () => {
                square.setScale(1);
            });

            square.on('pointerdown', () => {
                this.addIngredient(ingredient);
            });

            // Add ingredient label - moved to the left of the square
            this.add.text(x - 20, y, ingredient.replace('_', ' '), {
                fontSize: '20px',
                fill: '#fff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(1, 0.5);  // Right-align the text
        });

        // Right side ingredients
        rightIngredients.forEach((ingredient, index) => {
            const x = 620;  // Moved left from 650
            const y = 200 + (index * 50);
            
            // Create colored square for ingredient
            const square = this.add.rectangle(x, y, 30, 30, ingredientColors[ingredient]);
            square.setInteractive();
            
            // Hover effects
            square.on('pointerover', () => {
                square.setScale(1.1);
            });
            square.on('pointerout', () => {
                square.setScale(1);
            });

            square.on('pointerdown', () => {
                this.addIngredient(ingredient);
            });

            // Add ingredient label - moved to the right of the square
            this.add.text(x + 20, y, ingredient.replace('_', ' '), {
                fontSize: '20px',
                fill: '#fff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0, 0.5);  // Left-align the text
        });
    }

    setupIngredientInteraction(object) {
        object.on('pointerdown', () => this.addIngredient(object.ingredient));
        
        // Add hover effect
        object.on('pointerover', () => {
            if (object.texture.key === 'ingredient_button') {
                object.setTint(0xdddddd);
            } else {
                object.setScale(0.9); // Slightly larger on hover for ingredients
            }
        });
        
        object.on('pointerout', () => {
            if (object.texture.key === 'ingredient_button') {
                object.clearTint();
            } else {
                object.setScale(0.8); // Return to normal scale
            }
        });
    }

    setupStackArea() {
        // Remove the stack area background and text, just handle the stacking logic
        this.stackArea = {
            x: 400,
            y: 300,
            width: 200,
            height: 300
        };
    }

    createNewOrder() {
        // Clear any existing order
        if (this.currentOrder) {
            if (this.typingTween && this.typingTween.destroy) {
                this.typingTween.destroy();
            }
            if (this.orderTimer) {
                this.orderTimer.remove();
            }
        }

        // Generate random order
        const ingredients = ['bread_bottom', 'lettuce', 'cheese', 'tomato', 'meat', 'bread_top'];
        this.currentOrder = {
            ingredients: ingredients,
            timeLimit: 20000
        };

        // Display the new order
        this.displayOrder(this.currentOrder);

        // Start the timer
        this.orderTimer = this.time.delayedCall(this.currentOrder.timeLimit, () => {
            this.orderFailed();
        });
    }

    displayOrder(order) {
        // If there's an existing typing tween, destroy it properly
        if (this.typingTween && this.typingTween.destroy) {
            this.typingTween.destroy();
        }
        
        // Reset the order text
        this.orderText.setText('');
        const fullText = `Order: ${order.ingredients.join(' + ')}`;
        let currentCharacter = 0;
        
        // Create new typing tween
        this.typingTween = this.time.addEvent({
            delay: 50,
            callback: () => {
                currentCharacter++;
                this.orderText.setText(fullText.substring(0, currentCharacter));
                
                if (currentCharacter === fullText.length) {
                    if (this.typingTween) {
                        this.typingTween.destroy();
                        this.typingTween = null;
                    }
                }
            },
            repeat: fullText.length - 1
        });
    }

    addIngredient(ingredient) {
        // Add to stack array
        this.stack.push(ingredient);
        
        // Create visual representation of stacked ingredient
        const yPos = 450 - (this.stack.length * 30); // Stack from bottom up
        const ingredientSprite = this.add.image(400, yPos, ingredient);
        ingredientSprite.setScale(0.8);
        
        // Make the ingredient interactive
        ingredientSprite.setInteractive();
        
        // Store the index in the stack
        ingredientSprite.stackIndex = this.stack.length - 1;
        
        // Add hover effects
        ingredientSprite.on('pointerover', () => {
            ingredientSprite.setScale(0.9);
            this.game.canvas.style.cursor = 'pointer';
        });
        
        ingredientSprite.on('pointerout', () => {
            ingredientSprite.setScale(0.8);
            this.game.canvas.style.cursor = 'default';
        });
        
        // Add click handler for removal
        ingredientSprite.on('pointerdown', () => {
            this.removeIngredient(ingredientSprite.stackIndex);
        });
        
        // Add a nice scale-in effect
        ingredientSprite.setScale(0);
        this.tweens.add({
            targets: ingredientSprite,
            scale: 0.8,
            duration: 200,
            ease: 'Back.out'
        });
        
        // Store the sprite reference
        this.stackSprites.push(ingredientSprite);
        
        this.checkOrder();
    }

    removeIngredient(index) {
        // Remove the ingredient from the stack array
        this.stack.splice(index, 1);
        
        // Remove and destroy the clicked sprite
        const removedSprite = this.stackSprites[index];
        
        // Animate the removal
        this.tweens.add({
            targets: removedSprite,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            ease: 'Back.in',
            onComplete: () => {
                removedSprite.destroy();
            }
        });
        
        // Remove from sprites array
        this.stackSprites.splice(index, 1);
        
        // Update the positions and indices of remaining ingredients
        this.stackSprites.forEach((sprite, newIndex) => {
            sprite.stackIndex = newIndex;
            
            // Animate to new position
            this.tweens.add({
                targets: sprite,
                y: 450 - ((newIndex + 1) * 30),
                duration: 200,
                ease: 'Power2'
            });
        });
        
        this.checkOrder();
    }

    checkOrder() {
        if (this.stack.length === this.currentOrder.ingredients.length) {
            let correct = true;
            for (let i = 0; i < this.stack.length; i++) {
                if (this.stack[i] !== this.currentOrder.ingredients[i]) {
                    correct = false;
                    break;
                }
            }

            if (correct) {
                this.orderComplete();
            } else {
                this.orderFailed();
            }
        }
    }

    orderComplete() {
        this.score += 100;
        this.scoreText.setText('Score: ' + this.score);
        
        // Add success effect
        const successText = this.add.text(400, 300, 'Perfect!', {
            fontSize: '48px',
            fill: '#00ff00',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: successText,
            scale: 1.5,
            alpha: 0,
            duration: 1000,
            onComplete: () => successText.destroy()
        });
        
        this.resetOrder();
    }

    orderFailed() {
        // Clean up existing tweens
        if (this.typingTween && this.typingTween.destroy) {
            this.typingTween.destroy();
        }
        if (this.orderTimer) {
            this.orderTimer.remove();
        }

        this.score = Math.max(0, this.score - 50);
        this.scoreText.setText('Score: ' + this.score);
        
        // Add fail effect
        const failText = this.add.text(400, 300, 'Wrong Order!', {
            fontSize: '48px',
            fill: '#ff0000',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: failText,
            scale: 1.5,
            alpha: 0,
            duration: 1000,
            onComplete: () => failText.destroy()
        });
        
        this.resetOrder();
    }

    resetOrder() {
        // Clean up any existing tweens
        if (this.typingTween && this.typingTween.destroy) {
            this.typingTween.destroy();
        }
        if (this.orderTimer) {
            this.orderTimer.remove();
        }

        // Animate and destroy all stack sprites
        this.stackSprites.forEach((sprite, index) => {
            this.tweens.add({
                targets: sprite,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: 200,
                delay: index * 50,
                ease: 'Back.in',
                onComplete: () => {
                    sprite.destroy();
                }
            });
        });
        
        // Clear arrays
        this.stack = [];
        this.stackSprites = [];
        
        // Create new order after a short delay
        this.time.delayedCall(300, () => {
            this.createNewOrder();
        });
    }

    updateTimerBar(progress) {
        this.timerBar.clear();
        
        // Calculate color based on progress (green to red)
        let color;
        if (progress > 0.6) {
            color = 0x00ff00;  // Green
        } else if (progress > 0.3) {
            color = 0xffff00;  // Yellow
        } else {
            color = 0xff0000;  // Red
        }
        
        // Draw timer bar with solid color
        this.timerBar.fillStyle(color, 1);
        const width = this.timerBarConfig.width * progress;
        this.timerBar.fillRoundedRect(
            this.timerBarConfig.x,
            this.timerBarConfig.y,
            width,
            this.timerBarConfig.height,
            10
        );

        // Add border to the filled portion
        this.timerBar.lineStyle(2, 0xffffff, 0.5);
        this.timerBar.strokeRoundedRect(
            this.timerBarConfig.x,
            this.timerBarConfig.y,
            width,
            this.timerBarConfig.height,
            10
        );
    }

    update() {
        // Update timer bar
        if (this.orderTimer) {
            const progress = this.orderTimer.getProgress();
            this.updateTimerBar(1 - progress);  // Invert progress for countdown effect
            
            // We'll handle the color change in updateTimerBar instead
        }
    }

    gameOver() {
        // Add fade out transition before switching to GameOverScene
        this.cameras.main.fade(1000, 0, 0, 0);
        this.time.delayedCall(900, () => {
            this.scene.start('GameOverScene', { score: this.score });
        });
    }
}
