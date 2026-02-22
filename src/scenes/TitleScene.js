import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { QTEManager } from '../systems/QTEManager.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    this.qte = new QTEManager(this);
    const cx = GAME_WIDTH / 2;

    // Dark background
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0d0d1a).setOrigin(0);

    // ── Big title block ──────────────────────────────────────────────
    const titleBlockH = 110;
    const titleBlockY = 140;

    this.add
      .rectangle(cx, titleBlockY, 560, titleBlockH, 0x1a1a3a)
      .setOrigin(0.5);
    this.add
      .rectangle(cx, titleBlockY, 562, titleBlockH + 2, 0x4fc3f7, 0)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x4fc3f7);

    this.add
      .text(cx, titleBlockY, 'WHIPLASH', {
        fontFamily: 'monospace',
        fontSize: '64px',
        color: '#4fc3f7',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // ── Two smaller option blocks ────────────────────────────────────
    const btnW = 240;
    const btnH = 64;
    const btnY = 320;
    const gap = 30;

    const buttons = [
      {
        label: 'NEW GAME',
        action: () => this.startNewGame(),
        x: cx - btnW / 2 - gap / 2,
      },
      { label: 'CONTINUE', action: null, x: cx + btnW / 2 + gap / 2 },
    ];

    buttons.forEach(({ label, action, x }) => {
      const bg = this.add
        .rectangle(x, btnY, btnW, btnH, 0x1a1a3a)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      const border = this.add
        .rectangle(x, btnY, btnW + 2, btnH + 2, 0x4fc3f7, 0)
        .setOrigin(0.5)
        .setStrokeStyle(2, 0x4fc3f7);

      const text = this.add
        .text(x, btnY, label, {
          fontFamily: 'monospace',
          fontSize: '22px',
          color: '#4fc3f7',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Hover
      bg.on('pointerover', () => {
        bg.setFillStyle(0x2a2a5a);
        border.setStrokeStyle(2, 0xa8d8f0);
        text.setColor('#a8d8f0');
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(0x1a1a3a);
        border.setStrokeStyle(2, 0x4fc3f7);
        text.setColor('#4fc3f7');
      });

      // Click
      bg.on('pointerdown', () => {
        if (action) action.call(this);
      });
    });
  }

  startNewGame() {
    if (this.qte.isActive()) return;

    this.qte.start({
      keyCode: Phaser.Input.Keyboard.KeyCodes.SPACE,
      keyLabel: 'SPACE',
      prompt: 'Press SPACE to begin!',
      duration: 2000,
      onSuccess: () => this.scene.start('GameScene'),
      onFail: () => {
        const msg = this.add
          .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, 'Too slow! Try again.', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#f44336',
          })
          .setOrigin(0.5)
          .setDepth(1004);
        this.time.delayedCall(1500, () => msg.destroy());
      },
    });
  }
}
