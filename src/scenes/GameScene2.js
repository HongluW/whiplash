import Phaser from 'phaser';
import { setScaleFullWidth } from '../utils/scaleHelper.js';

/**
 * Main game scene — Pixel Lab background.
 * Full-width canvas.
 */
export class GameScene2 extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene2' });
  }

  create() {
    setScaleFullWidth(this);
    const w = this.scale.width;
    const h = this.scale.height;
    // Black base — entire frame; any uncovered areas stay black
    this.add.rectangle(0, 0, w, h, 0x000000).setOrigin(0);

    // Background — Pixel Lab image
    const bg = this.add.image(w / 2, h / 2, 'backgroundPixelLab');
    const scale = Math.min(w / bg.width, h / bg.height, 1);
    bg.setScale(scale);

    // UI text
    this.add
      .text(8, 8, 'Whiplash | ESC to pause', {
        fontSize: '14px',
        fill: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 6, y: 4 },
      })
      .setScrollFactor(0);

    // Pause — ESC key
    this.paused = false;
    this.pauseOverlay = null;
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true);
    this.escListener = () => this.togglePause();
    this.input.keyboard.on('keydown-ESC', this.escListener);
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) this.showPauseOverlay();
    else this.hidePauseOverlay();
  }

  showPauseOverlay() {
    if (this.pauseOverlay) return;
    const w = this.scale.width;
    const h = this.scale.height;
    const cx = w / 2;
    const cy = h / 2;

    const overlay = this.add
      .rectangle(0, 0, w, h, 0x000000, 0.7)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(900)
      .setInteractive();

    const title = this.add
      .text(cx, cy - 60, 'PAUSED', {
        fontFamily: 'monospace',
        fontSize: '48px',
        color: '#4fc3f7',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(901);

    const btnW = 220;
    const btnH = 50;
    const btnY = cy;

    const resumeBg = this.add
      .rectangle(cx, btnY - 35, btnW, btnH, 0x1a1a3a)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(901)
      .setInteractive({ useHandCursor: true });
    const resumeText = this.add.text(cx, btnY - 35, 'RESUME', { fontFamily: 'monospace', fontSize: '20px', color: '#4fc3f7' }).setOrigin(0.5).setScrollFactor(0).setDepth(902);

    const exitBg = this.add
      .rectangle(cx, btnY + 35, btnW, btnH, 0x1a1a3a)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(901)
      .setInteractive({ useHandCursor: true });
    const exitText = this.add.text(cx, btnY + 35, 'EXIT TO TITLE', { fontFamily: 'monospace', fontSize: '20px', color: '#4fc3f7' }).setOrigin(0.5).setScrollFactor(0).setDepth(902);

    resumeBg.on('pointerover', () => { resumeBg.setFillStyle(0x2a2a5a); resumeText.setColor('#a8d8f0'); });
    resumeBg.on('pointerout', () => { resumeBg.setFillStyle(0x1a1a3a); resumeText.setColor('#4fc3f7'); });
    exitBg.on('pointerover', () => { exitBg.setFillStyle(0x2a2a5a); exitText.setColor('#a8d8f0'); });
    exitBg.on('pointerout', () => { exitBg.setFillStyle(0x1a1a3a); exitText.setColor('#4fc3f7'); });

    resumeBg.on('pointerdown', () => this.togglePause());
    exitBg.on('pointerdown', () => this.scene.start('TitleScene'));

    this.pauseOverlay = { overlay, title, resumeBg, resumeText, exitBg, exitText };
  }

  hidePauseOverlay() {
    if (!this.pauseOverlay) return;
    Object.values(this.pauseOverlay).forEach((g) => g.destroy());
    this.pauseOverlay = null;
  }

  shutdown() {
    this.input.keyboard.off('keydown-ESC', this.escListener);
  }

  update() {}
}
