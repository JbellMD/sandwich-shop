export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Create loading bar
        this.createLoadingBar();

        // Load ingredient sprites
        this.load.image('bread_top', 'assets/images/ingredients/bread_top.png');
        this.load.image('bread_bottom', 'assets/images/ingredients/bread_bottom.png');
        this.load.image('lettuce', 'assets/images/ingredients/lettuce.png');
        this.load.image('cheese', 'assets/images/ingredients/cheese.png');
        this.load.image('tomato', 'assets/images/ingredients/tomato.png');
        this.load.image('meat', 'assets/images/ingredients/meat.png');
        this.load.image('bacon', 'assets/images/ingredients/bacon.png');
        this.load.image('egg', 'assets/images/ingredients/egg.png');
        this.load.image('mayo', 'assets/images/ingredients/mayo.png');
        this.load.image('mustard', 'assets/images/ingredients/mustard.png');
        this.load.image('ketchup', 'assets/images/ingredients/ketchup.png');
        this.load.image('onion', 'assets/images/ingredients/onion.png');

        // Load UI elements
        this.load.image('order_box', 'assets/images/ui/order_box.png');
        this.load.image('timer_bar_bg', 'assets/images/ui/timer_bar_bg.png');
        this.load.image('timer_bar_fill', 'assets/images/ui/timer_bar_fill.png');
        this.load.image('button_start', 'assets/images/ui/button_start.png');
        this.load.image('ingredient_button', 'assets/images/ui/ingredient_button.png');
        this.load.image('stack_area', 'assets/images/ui/stack_area.png');

        // Load background
        this.load.image('background', 'assets/images/ui/background.jpg');

        // Load customer avatars
        this.load.image('customer1', 'assets/images/customers/customer1.png');
        this.load.image('customer2', 'assets/images/customers/customer2.png');
        this.load.image('customer3', 'assets/images/customers/customer3.png');
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);
        
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }

    create() {
        this.scene.start('MenuScene');
    }
}
