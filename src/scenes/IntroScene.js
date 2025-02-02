import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  preload() {
    // Load the background and person images (ensure these assets exist in your assets directory)
    this.load.image('background', 'assets/background.png');
    this.load.image('person', 'assets/person.png');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Add the same background used in the game
    this.add.image(width / 2, height / 2, 'background');

    // Add an image of a person for storytelling
    this.add.image(width * 0.3, height / 2, 'person');

    // Dialogue texts for the introduction
    this.dialogueTexts = [
      "Welcome to the Sandwich Shop.",
      "In this game, you'll learn to assemble the perfect sandwich by choosing the best ingredients.",
      "Prepare yourself and let's get started!"
    ];
    this.currentTextIndex = 0;

    // Display the first dialogue text
    this.dialogue = this.add.text(width * 0.5, height * 0.8, this.dialogueTexts[this.currentTextIndex], {
      font: '24px Arial',
      fill: '#fff',
      wordWrap: { width: width * 0.4 }
    });
    this.dialogue.setInteractive();
    this.dialogue.on('pointerdown', () => this.advanceDialogue());
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
