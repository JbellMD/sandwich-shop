export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.currentOrder = null;
        this.stack = [];
    }

    init() {
        this.score = 0;
        this.stack = [];
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
    }

    setupIngredients() {
        const leftIngredients = ['bread_top', 'bread_bottom', 'lettuce', 'cheese', 'tomato', 'meat'];
        const rightIngredients = ['bacon', 'egg', 'mayo', 'mustard', 'ketchup', 'onion'];
        
        // Left side ingredients
        leftIngredients.forEach((ingredient, index) => {
            const x = 150;
            const y = 200 + (index * 60);
            
            // Add button background
            const button = this.add.image(x, y, 'ingredient_button');
            
            // Add ingredient icon
            const ingredientIcon = this.add.image(x, y, ingredient);
            ingredientIcon.setScale(0.8); // Slightly smaller scale for better fit
            
            // Make both interactive
            button.setInteractive();
            ingredientIcon.setInteractive();
            
            // Store ingredient name
            button.ingredient = ingredient;
            ingredientIcon.ingredient = ingredient;
            
            // Setup interactions for both button and icon
            this.setupIngredientInteraction(button);
            this.setupIngredientInteraction(ingredientIcon);
        });
        
        // Right side ingredients
        rightIngredients.forEach((ingredient, index) => {
            const x = 650;
            const y = 200 + (index * 60);
            
            // Add button background
            const button = this.add.image(x, y, 'ingredient_button');
            
            // Add ingredient icon
            const ingredientIcon = this.add.image(x, y, ingredient);
            ingredientIcon.setScale(0.8); // Slightly smaller scale for better fit
            
            // Make both interactive
            button.setInteractive();
            ingredientIcon.setInteractive();
            
            // Store ingredient name
            button.ingredient = ingredient;
            ingredientIcon.ingredient = ingredient;
            
            // Setup interactions for both button and icon
            this.setupIngredientInteraction(button);
            this.setupIngredientInteraction(ingredientIcon);
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
        const ingredients = ['bread_bottom', 'lettuce', 'cheese', 'meat', 'bread_top'];
        this.currentOrder = {
            ingredients: ingredients,
            timeLeft: 20000 // 20 seconds
        };

        // Display order
        this.displayOrder(this.currentOrder.ingredients);

        // Start timer
        this.orderTimer = this.time.addEvent({
            delay: 20000,
            callback: this.orderFailed,
            callbackScope: this
        });
    }

    addIngredient(ingredient) {
        // Add to stack array
        this.stack.push(ingredient);
        
        // Create visual representation of stacked ingredient
        const yPos = 450 - (this.stack.length * 30); // Stack from bottom up
        const ingredientSprite = this.add.image(400, yPos, ingredient);
        ingredientSprite.setScale(0.8);
        
        // Add a nice scale-in effect
        ingredientSprite.setScale(0);
        this.tweens.add({
            targets: ingredientSprite,
            scale: 0.8,
            duration: 200,
            ease: 'Back.out'
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
        this.stack = [];
        
        if (this.orderTimer) {
            this.orderTimer.remove();
        }
        this.createNewOrder();
    }

    displayOrder(order) {
        // Clear any existing tweens
        if (this.typingTween) {
            this.typingTween.stop();
        }
        
        const fullText = 'Order: ' + order.join(' + ');
        this.orderText.setText('');
        
        // Create typing effect
        let currentChar = 0;
        this.typingTween = this.time.addEvent({
            delay: 30,
            callback: () => {
                if (currentChar < fullText.length) {
                    this.orderText.setText(this.orderText.text + fullText[currentChar]);
                    currentChar++;
                }
            },
            repeat: fullText.length - 1
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
