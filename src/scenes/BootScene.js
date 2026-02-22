import Phaser from 'phaser';
import { setScaleFit } from '../utils/scaleHelper.js';

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

    // Backgrounds
    this.load.image('background', '/Generated Image February 21, 2026 - 10_46PM.jpeg');
    this.load.image('backgroundPixelLab', '/pixellab-Here-s-the-refined-prompt---Su-1771743129652.png');
  }

  create() {
    setScaleFit(this);
    this.scene.start('TitleScene');
  }

}
