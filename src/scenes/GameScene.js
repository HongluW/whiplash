import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, PLAYER_SPEED } from '../config/gameConfig.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Draw a simple tile-based floor
    const cols = Math.ceil(GAME_WIDTH / TILE_SIZE) + 2;
    const rows = Math.ceil(GAME_HEIGHT / TILE_SIZE) + 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.add.image(col * TILE_SIZE, row * TILE_SIZE, 'grass').setOrigin(0);
      }
    }

    // Player
    this.player = this.physics.add.sprite(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      'player'
    );
    this.player.setCollideWorldBounds(true);

    // Camera follows player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD keys
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // UI text
    this.add
      .text(8, 8, 'Whiplash — Arrow keys or WASD to move | ESC to pause', {
        fontSize: '14px',
        fill: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 6, y: 4 },
      })
      .setScrollFactor(0);

    // Pause — use keydown-ESC event (addKey + justDown can miss ESC due to browser capture)
    this.paused = false;
    this.pauseOverlay = null;
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true);
    this.escListener = () => this.togglePause();
    this.input.keyboard.on('keydown-ESC', this.escListener);
  }

  togglePause() {
    this.paused = !this.paused;

    if (this.paused) {
      this.physics.pause();
      this.showPauseOverlay();
    } else {
      this.physics.resume();
      this.hidePauseOverlay();
    }
  }

  showPauseOverlay() {
    if (this.pauseOverlay) return;

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    const overlay = this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7)
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

    const resumeText = this.add
      .text(cx, btnY - 35, 'RESUME', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#4fc3f7',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(902);

    const exitBg = this.add
      .rectangle(cx, btnY + 35, btnW, btnH, 0x1a1a3a)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(901)
      .setInteractive({ useHandCursor: true });

    const exitText = this.add
      .text(cx, btnY + 35, 'EXIT TO TITLE', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#4fc3f7',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(902);

    const addHover = (bg, text) => {
      bg.on('pointerover', () => {
        bg.setFillStyle(0x2a2a5a);
        text.setColor('#a8d8f0');
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(0x1a1a3a);
        text.setColor('#4fc3f7');
      });
    };
    addHover(resumeBg, resumeText);
    addHover(exitBg, exitText);

    resumeBg.on('pointerdown', () => this.togglePause());
    exitBg.on('pointerdown', () => this.scene.start('TitleScene'));

    this.pauseOverlay = { overlay, title, resumeBg, resumeText, exitBg, exitText };
  }

  hidePauseOverlay() {
    if (!this.pauseOverlay) return;
    const { overlay, title, resumeBg, resumeText, exitBg, exitText } = this.pauseOverlay;
    [overlay, title, resumeBg, resumeText, exitBg, exitText].forEach((g) => g.destroy());
    this.pauseOverlay = null;
  }

  shutdown() {
    this.input.keyboard.off('keydown-ESC', this.escListener);
  }

  update() {
    if (this.paused) return;

    const { cursors, wasd, player } = this;

    const left = cursors.left.isDown || wasd.left.isDown;
    const right = cursors.right.isDown || wasd.right.isDown;
    const up = cursors.up.isDown || wasd.up.isDown;
    const down = cursors.down.isDown || wasd.down.isDown;

    player.setVelocity(0);

    if (left) player.setVelocityX(-PLAYER_SPEED);
    else if (right) player.setVelocityX(PLAYER_SPEED);

    if (up) player.setVelocityY(-PLAYER_SPEED);
    else if (down) player.setVelocityY(PLAYER_SPEED);
  }
}
