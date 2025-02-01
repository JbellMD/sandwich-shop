export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.currentOrder = null;
        this.sandwichStack = [];
        this.stackDisplay = [];
    }

    init() {
        this.score = 0;
        this.sandwichStack = [];
        this.stackDisplay = [];
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');
        
        this.setupUI();
        this.setupIngredients();
        this.setupStackArea();
        this.setupCustomerQueue();
        this.createNewOrder();
    }

    setupUI() {
        // Add order box
        this.add.image(400, 60, 'order_box');
        
        // Score display
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 }
        });

        // Timer bar background
        this.timerBarBg = this.add.image(400, 580, 'timer_bar_bg');
        this.timerBar = this.add.image(400, 580, 'timer_bar_fill');
        this.timerBar.setOrigin(0, 0.5);
        this.timerBar.x = 250; // Adjust based on your timer_bar_bg width
    }

    setupIngredients() {
        const leftIngredients = [
            'bread_top', 'bread_bottom', 'lettuce',
            'cheese', 'tomato', 'meat'
        ];

        const rightIngredients = [
            'bacon', 'egg', 'mayo',
            'mustard', 'ketchup', 'onion'
        ];

        // Left side ingredients
        leftIngredients.forEach((ingredient, index) => {
            const button = this.add.image(100, 150 + (index * 70), 'ingredient_button');
            const ingredientSprite = this.add.image(100, 150 + (index * 70), ingredient);
            
            button.setInteractive();
            ingredientSprite.setInteractive();
            
            button.on('pointerdown', () => this.addIngredient(ingredient));
            ingredientSprite.on('pointerdown', () => this.addIngredient(ingredient));
            
            // Add hover effect
            button.on('pointerover', () => button.setTint(0xdddddd));
            button.on('pointerout', () => button.clearTint());
        });

        // Right side ingredients
        rightIngredients.forEach((ingredient, index) => {
            const button = this.add.image(700, 150 + (index * 70), 'ingredient_button');
            const ingredientSprite = this.add.image(700, 150 + (index * 70), ingredient);
            
            button.setInteractive();
            ingredientSprite.setInteractive();
            
            button.on('pointerdown', () => this.addIngredient(ingredient));
            ingredientSprite.on('pointerdown', () => this.addIngredient(ingredient));
            
            // Add hover effect
            button.on('pointerover', () => button.setTint(0xdddddd));
            button.on('pointerout', () => button.clearTint());
        });
    }

    setupStackArea() {
        // Add stack area background
        this.add.image(400, 300, 'stack_area');
        
        this.add.text(400, 150, 'Sandwich Stack', {
            fontSize: '24px',
            fill: '#000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    }

    setupCustomerQueue() {
        // Placeholder for customer queue
        this.customerQueue = [];
        this.maxCustomers = 3;
        
        // Add initial customer
        const customer = this.add.image(100, 60, 'customer1');
        customer.setScale(0.5);
    }

    createNewOrder() {
        const ingredients = ['bread_bottom', 'lettuce', 'cheese', 'meat', 'bread_top'];
        this.currentOrder = {
            ingredients: ingredients,
            timeLeft: 20000 // 20 seconds
        };

        // Display order
        this.displayOrder();

        // Start timer
        this.orderTimer = this.time.addEvent({
            delay: 20000,
            callback: this.orderFailed,
            callbackScope: this
        });
    }

    addIngredient(ingredient) {
        this.sandwichStack.push(ingredient);
        
        // Create a new ingredient display in the stack area
        const yPos = 450 - (this.stackDisplay.length * 40);
        const ingredientSprite = this.add.image(400, yPos, ingredient);
        
        // Add a nice scale-in effect
        ingredientSprite.setScale(0);
        this.tweens.add({
            targets: ingredientSprite,
            scale: 1,
            duration: 200,
            ease: 'Back.out'
        });

        this.stackDisplay.push(ingredientSprite);
        
        this.checkOrder();
    }

    checkOrder() {
        if (this.sandwichStack.length === this.currentOrder.ingredients.length) {
            let correct = true;
            for (let i = 0; i < this.sandwichStack.length; i++) {
                if (this.sandwichStack[i] !== this.currentOrder.ingredients[i]) {
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
        // Clear the stack with a nice animation
        this.stackDisplay.forEach((sprite, index) => {
            this.tweens.add({
                targets: sprite,
                x: '+=400',
                alpha: 0,
                duration: 300,
                delay: index * 50,
                onComplete: () => sprite.destroy()
            });
        });
        
        this.sandwichStack = [];
        this.stackDisplay = [];
        
        if (this.orderTimer) {
            this.orderTimer.remove();
        }
        this.createNewOrder();
    }

    displayOrder() {
        if (this.orderText) {
            this.orderText.destroy();
        }
        this.orderText = this.add.text(400, 60, 'Order: ' + this.currentOrder.ingredients.join(' + '), {
            fontSize: '20px',
            fill: '#000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    }

    update() {
        // Update timer bar
        if (this.orderTimer) {
            const progress = this.orderTimer.getProgress();
            this.timerBar.scaleX = 1 - progress;
            
            // Change color to red when time is running out
            if (progress > 0.7) {
                this.timerBar.setTint(0xff0000);
            } else {
                this.timerBar.clearTint();
            }
        }
    }
}
