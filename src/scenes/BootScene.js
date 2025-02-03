class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Create loading bar
        this.createLoadingBar();

        // Add error handling for asset loading
        this.load.on('loaderror', (fileObj) => {
            console.error('BootScene: Error loading asset:', {
                key: fileObj.key,
                url: fileObj.url
            });
        });

        this.load.on('filecomplete', (key) => {
            console.log('BootScene: Successfully loaded:', key);
        });

        // Load backgrounds first
        console.log('BootScene: Loading backgrounds...');
        this.load.image('background3', 'assets/images/ui/background3.jpg');
        this.load.image('background', 'assets/images/ui/background.jpg');

        // Set base path for ingredients
        this.load.setPath('assets/images/ingredients');

        // Load ingredient sprites
        console.log('BootScene: Loading ingredients...');
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
        console.log('BootScene: Loading UI elements...');
        this.load.setPath('assets/images/ui');
        this.load.image('order_box', 'order_box.png');
        this.load.image('timer_bar_bg', 'timer_bar_bg.png');
        this.load.image('timer_bar_fill', 'timer_bar_fill.png');
        this.load.image('button_start', 'button_start.png');
        this.load.image('ingredient_button', 'ingredient_button.png');
        this.load.image('stack_area', 'stack_area.png');

        // Load customer avatars
        console.log('BootScene: Loading customer avatars...');
        this.load.setPath('assets/images/customers');
        this.load.image('customer1', 'customer1.png');
        this.load.image('customer2', 'customer2.png');
        this.load.image('customer3', 'customer3.png');
    }

    create() {
        console.log('BootScene: Available textures:', Object.keys(this.textures.list));
        
        // Try to use background3 first, fall back to background if needed
        let bg;
        if (this.textures.exists('background3')) {
            console.log('BootScene: Using background3');
            bg = this.add.image(400, 300, 'background3');
        } else {
            console.log('BootScene: Falling back to original background');
            bg = this.add.image(400, 300, 'background');
        }

        const scaleX = 800 / bg.width;
        const scaleY = 600 / bg.height;
        const scale = Math.min(scaleX, scaleY);
        bg.setScale(scale);

        // Add title
        const titleStyle = {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        };
        
        const title = this.add.text(400, 150, "Adriel's\nSandwich Shop", titleStyle).setOrigin(0.5);

        // Simple delay then transition to MenuScene
        this.time.delayedCall(1000, () => {
            console.log('BootScene: Starting MenuScene...');
            this.scene.start('MenuScene');
        });
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

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }
}

export default BootScene;
