class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Create loading bar
        this.createLoadingBar();

        // Add load event listeners
        this.load.on('loaderror', (fileObj) => {
            console.error('PreloadScene: Error loading asset:', {
                key: fileObj.key,
                url: fileObj.url,
                path: this.load.path
            });
        });

        this.load.on('filecomplete', (key) => {
            console.log('PreloadScene: Successfully loaded:', key);
        });

        this.load.on('complete', () => {
            console.log('PreloadScene: All assets loaded');
            console.log('PreloadScene: Final texture list:', Object.keys(this.textures.list));
            this.scene.start('MenuScene');
        });

        // Set base path for ingredients
        this.load.setPath('assets/images/ingredients');

        // Load ingredient sprites
        console.log('PreloadScene: Loading ingredients...');
        this.load.image('bread_top', 'bread_top.png');
        this.load.image('bread_bottom', 'bread_bottom.png');
        this.load.image('lettuce', 'lettuce.png');
        this.load.image('cheese', 'cheese.png');
        this.load.image('tomato', 'tomato.png');
        this.load.image('meat', 'meat.png');
        this.load.image('bacon', 'bacon.png');
        this.load.image('egg', 'egg.png');
        this.load.image('mayo', 'mayo.png');
        this.load.image('mustard', 'mustard.png');
        this.load.image('ketchup', 'ketchup.png');
        this.load.image('onion', 'onion.png');

        // Load UI elements
        console.log('PreloadScene: Loading UI elements...');
        this.load.setPath('assets/images/ui');
        this.load.image('order_box', 'order_box.png');
        this.load.image('timer_bar_bg', 'timer_bar_bg.png');
        this.load.image('timer_bar_fill', 'timer_bar_fill.png');
        this.load.image('button_start', 'button_start.png');
        this.load.image('ingredient_button', 'ingredient_button.png');
        this.load.image('stack_area', 'stack_area.png');

        // Load customer avatars
        console.log('PreloadScene: Loading customer avatars...');
        this.load.setPath('assets/images/customers');
        this.load.image('customer1', 'customer1.png');
        this.load.image('customer2', 'customer2.png');
        this.load.image('customer3', 'customer3.png');
    }

    create() {
        console.log('PreloadScene: Starting MenuScene...');
        this.scene.start('MenuScene');
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
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });
    }
}

export default PreloadScene;
