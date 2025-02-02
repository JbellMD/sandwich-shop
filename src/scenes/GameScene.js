export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.currentOrder = { ingredients: [] };
        this.stack = [];
        this.stackSprites = [];
    }

    init() {
        this.score = 0;
        this.currentOrder = { ingredients: [] };
        this.stack = [];
        this.stackSprites = [];
    }

    create() {
        // Add background with fade in
        const bg = this.add.image(400, 300, 'background');
        // Increase scale to fully cover the canvas
        const scaleX = 900 / bg.width;
        const scaleY = 700 / bg.height;
        const scale = Math.max(scaleX, scaleY);  // Use max instead of min to ensure full coverage
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

        // Initialize order display container
        this.orderContainer = this.add.container(600, 50);
        
        // Create a semi-transparent dark backdrop
        const backdropWidth = 450;
        const backdropHeight = 95;  // Increased height for longer orders
        const backdrop = this.add.graphics();
        backdrop.fillStyle(0x000000, 0.7);
        backdrop.fillRoundedRect(-backdropWidth/2, -backdropHeight/2, backdropWidth, backdropHeight, 15);
        
        // Add a decorative border
        const border = this.add.graphics();
        border.lineStyle(2, 0xFFFFFF, 0.3);
        border.strokeRoundedRect(-backdropWidth/2, -backdropHeight/2, backdropWidth, backdropHeight, 15);
        
        // Add a small "Order" label at the top
        const orderLabel = this.add.text(-backdropWidth/2 + 20, -backdropHeight/2 + 10, 'ORDER:', {
            fontSize: '16px',
            fill: '#FFD700',
            fontStyle: 'bold'
        });
        
        // Create the main order text
        this.orderText = this.add.text(0, 15, '', {
            fontSize: '18px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: backdropWidth - 40 },
            lineSpacing: 5
        }).setOrigin(0.5);
        
        // Add everything to the container
        this.orderContainer.add([backdrop, border, orderLabel, this.orderText]);

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
            if (this.orderTimer) {
                this.orderTimer.remove();
            }
        }

        // Generate a random order
        const numIngredients = Phaser.Math.Between(3, 6);
        const allIngredients = ['bread_top', 'bread_bottom', 'lettuce', 'cheese', 'tomato', 'meat', 'bacon', 'egg', 'mayo', 'mustard', 'ketchup', 'onion'];
        const orderIngredients = [];
        
        // Always start with bread_bottom
        orderIngredients.push('bread_bottom');
        
        // Add random ingredients
        for (let i = 0; i < numIngredients; i++) {
            const randomIngredient = allIngredients[Phaser.Math.Between(0, allIngredients.length - 1)];
            if (randomIngredient !== 'bread_bottom' && randomIngredient !== 'bread_top') {
                orderIngredients.push(randomIngredient);
            }
        }
        
        // Always end with bread_top
        orderIngredients.push('bread_top');
        
        // Create the order object
        const order = {
            ingredients: orderIngredients,
            timeLimit: 30000
        };

        // Set and display the order
        this.currentOrder = order;
        this.displayOrder(order);

        // Start the timer
        this.orderTimer = this.time.delayedCall(this.currentOrder.timeLimit, () => {
            this.orderFailed();
        });

        // Reset and start the timer bar animation
        this.timerBar.clear();
        this.timerBar.fillStyle(0x00ff00);
        this.timerBar.fillRect(250, 460, 300, 20);
        
        this.tweens.add({
            targets: this.timerMask,
            x: -300,
            duration: 30000,
            ease: 'Linear'
        });
    }

    displayOrder(order) {
        // Setup typing animation
        const ingredients = order.ingredients
            .map(ing => ing.replace(/_/g, ' '))
            .join(' + ');
        const fullText = ingredients;
        let currentCharacter = 0;
        
        // Clear existing text
        this.orderText.setText('');
        
        // Create typing effect
        this.typingTimer = this.time.addEvent({
            delay: 50,
            callback: () => {
                currentCharacter++;
                const currentText = fullText.substring(0, currentCharacter);
                this.orderText.setText(currentText);
                
                // Adjust vertical position based on current text height
                const textHeight = this.orderText.height;
                this.orderText.y = -textHeight/2 + 30;  // More space from the top
            },
            repeat: fullText.length - 1
        });
    }

    updateOrderDisplay() {
        if (!this.orderText) return;

        const ingredients = this.currentOrder.ingredients;
        if (!ingredients || ingredients.length === 0) {
            this.orderText.setText('Waiting for order...');
            return;
        }

        // Format the order text nicely
        const formattedIngredients = ingredients
            .map(ing => ing.replace(/_/g, ' '))
            .join(' + ');
            
        this.orderText.setText(formattedIngredients);
        
        // Center the text vertically based on its height
        const textHeight = this.orderText.height;
        this.orderText.y = -textHeight/2 + 30;  // More space from the top
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
        // Clear any existing typing animation
        if (this.typingTimer) {
            this.typingTimer.destroy();
        }
        
        // Clear the current order
        this.currentOrder = {
            ingredients: []
        };
        
        // Clear any existing stack
        this.stack = [];
        this.stackSprites.forEach(sprite => sprite.destroy());
        this.stackSprites = [];
        
        // Update display
        this.updateOrderDisplay();
        
        // Create a new order after a delay
        this.time.delayedCall(1000, () => {
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
