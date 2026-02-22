import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Display a loading bar
    const { width, height } = this.scale;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x4fc3f7, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Placeholder assets — replace with real sprites later
    // Generate a simple colored rectangle as the player texture
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x4fc3f7);
    playerGraphics.fillRect(0, 0, 32, 48);
    playerGraphics.generateTexture('player', 32, 48);
    playerGraphics.destroy();

    const tileGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    tileGraphics.fillStyle(0x3a5f3a);
    tileGraphics.fillRect(0, 0, 32, 32);
    tileGraphics.lineStyle(1, 0x2a4f2a);
    tileGraphics.strokeRect(0, 0, 32, 32);
    tileGraphics.generateTexture('grass', 32, 32);
    tileGraphics.destroy();
  }

  create() {
    this.scene.start('TitleScene');
  }
}
