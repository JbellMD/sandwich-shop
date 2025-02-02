export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  preload() {
    // Background is already loaded in BootScene
    // Load the storyteller image
    this.load.image('storyteller', 'assets/images/customers/storyteller.png');
  }

  create() {
    // Get the game config dimensions
    const width = this.scale.width;
    const height = this.scale.height;

    // Add the same background used in the game
    const bg = this.add.image(width / 2, height / 2, 'background');
    // Scale background to fit the screen
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);

    // Add the storyteller image
    const storyteller = this.add.image(width * 0.3, height * 0.5, 'storyteller');
    // Scale the storyteller image appropriately
    const storytellerScale = Math.min(
      (height * 0.5) / storyteller.height,  // 50% of screen height
      (width * 0.3) / storyteller.width     // 30% of screen width
    );
    storyteller.setScale(storytellerScale);
    
    // Add a fade-in effect for the storyteller
    storyteller.alpha = 0;
    this.tweens.add({
      targets: storyteller,
      alpha: 1,
      duration: 1000,
      ease: 'Power2'
    });

    // Three consecutive dialogue boxes that explain the game
    this.dialogueTexts = [
      "Welcome to the Sandwich Shop.",
      "In this game, you'll learn to assemble the perfect sandwich by choosing the best ingredients.",
      "Prepare yourself and let's get started!"
    ];
    this.currentTextIndex = 0;

    // Create a semi-transparent dialogue box
    const dialogueBoxWidth = width * 0.8;
    const dialogueBoxHeight = height * 0.2;
    const dialogueBox = this.add.graphics();
    
    // Add semi-transparent background
    dialogueBox.fillStyle(0x000000, 0.7);
    dialogueBox.fillRoundedRect(width/2 - dialogueBoxWidth/2, height * 0.7, dialogueBoxWidth, dialogueBoxHeight, 15);
    
    // Add border
    dialogueBox.lineStyle(3, 0xffffff, 1);
    dialogueBox.strokeRoundedRect(width/2 - dialogueBoxWidth/2, height * 0.7, dialogueBoxWidth, dialogueBoxHeight, 15);

    // Display the first dialogue text
    this.dialogue = this.add.text(width * 0.5, height * 0.75, this.dialogueTexts[this.currentTextIndex], {
      font: '24px Arial',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: dialogueBoxWidth - 40 },
      stroke: '#000000',
      strokeThickness: 2
    });
    this.dialogue.setOrigin(0.5);

    // Add "Click to continue" text
    const continueText = this.add.text(width * 0.5, height * 0.85, 'Click to continue...', {
      font: '18px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Make the entire scene clickable
    this.input.on('pointerdown', () => this.advanceDialogue());
  }

  advanceDialogue() {
    this.currentTextIndex++;
    if (this.currentTextIndex < this.dialogueTexts.length) {
      this.dialogue.setText(this.dialogueTexts[this.currentTextIndex]);
    } else {
      // When all dialogues are shown, fade out and move to the GameScene
      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(450, () => {
        this.scene.start('GameScene');
      });
    }
  }
}
