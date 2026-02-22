/**
 * QTE (Quick Time Event) manager for Whiplash.
 * Requires the player to press a specific key within a time window.
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import {
  QTE_DEFAULT_DURATION,
  QTE_BAR_WIDTH,
  QTE_BAR_HEIGHT,
  QTE_COLOR_SUCCESS,
  QTE_OVERLAY_ALPHA,
} from '../config/gameConfig.js';

export class QTEManager {
  /**
   * @param {Phaser.Scene} scene - The Phaser scene this QTE runs in.
   */
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.timerEvent = null;
    this.keyObj = null;
    this.graphics = null;
    this.textGroup = null;
  }

  /**
   * Start a QTE.
   * @param {Object} options
   * @param {number} options.keyCode - Phaser key code (e.g. Phaser.Input.Keyboard.KeyCodes.SPACE)
   * @param {string} [options.keyLabel='?'] - Display label (e.g. 'SPACE', 'E')
   * @param {number} [options.duration=QTE_DEFAULT_DURATION] - Time in ms
   * @param {string} [options.prompt] - Custom prompt; defaults to "Press {keyLabel}!"
   * @param {Function} [options.onSuccess] - Called when correct key pressed in time
   * @param {Function} [options.onFail] - Called when time runs out or wrong key pressed
   * @returns {void}
   */
  start(options) {
    if (this.active) {
      this.cancel();
    }

    const {
      keyCode,
      keyLabel = '?',
      duration = QTE_DEFAULT_DURATION,
      prompt,
      onSuccess = () => {},
      onFail = () => {},
    } = options;

    const displayPrompt = prompt ?? `Press ${keyLabel}!`;

    this.active = true;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    // Semi-transparent overlay
    const overlay = this.scene.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, QTE_OVERLAY_ALPHA)
      .setOrigin(0)
      .setDepth(1000);

    // Timer bar background
    const barBg = this.scene.add
      .rectangle(
        cx,
        cy + 40,
        QTE_BAR_WIDTH,
        QTE_BAR_HEIGHT,
        0x333333
      )
      .setOrigin(0.5)
      .setDepth(1001);

    // Timer bar fill (shrinks over time)
    const barFill = this.scene.add
      .rectangle(
        cx - QTE_BAR_WIDTH / 2,
        cy + 40,
        QTE_BAR_WIDTH,
        QTE_BAR_HEIGHT,
        QTE_COLOR_SUCCESS
      )
      .setOrigin(0, 0.5)
      .setDepth(1002);

    // Prompt text
    const promptText = this.scene.add
      .text(cx, cy - 30, displayPrompt, {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(1003);

    this.graphics = { overlay, barBg, barFill, promptText };

    // Keyboard listener
    this.keyObj = this.scene.input.keyboard.addKey(keyCode);

    const finish = (success) => {
      if (!this.active) return;
      this.active = false;

      if (this.timerEvent) {
        this.timerEvent.remove();
        this.timerEvent = null;
      }
      this.keyObj.off('down');
      this.scene.input.keyboard.off('keydown', this.wrongKeyListener);

      Object.values(this.graphics).forEach((g) => g.destroy());
      this.graphics = null;

      if (success) {
        onSuccess();
      } else {
        onFail();
      }
    };

    const onKeyDown = () => {
      // Correct key
      finish(true);
    };

    // Wrong key = fail (required input)
    this.wrongKeyListener = (event) => {
      if (event.keyCode !== keyCode) {
        finish(false);
      }
    };
    this.scene.input.keyboard.on('keydown', this.wrongKeyListener);

    this.keyObj.once('down', onKeyDown);

    // Timer
    const startTime = Date.now();
    this.timerEvent = this.scene.time.addEvent({
      delay: 16,
      repeat: -1,
      callback: () => {
        const elapsed = Date.now() - startTime;
        const remaining = 1 - Math.min(elapsed / duration, 1);

        barFill.width = QTE_BAR_WIDTH * remaining;
        barFill.x = cx - QTE_BAR_WIDTH / 2;

        if (remaining <= 0) {
          finish(false);
        }
      },
    });
  }

  /**
   * Cancel the current QTE without calling onSuccess or onFail.
   */
  cancel() {
    if (!this.active) return;
    this.active = false;

    if (this.timerEvent) {
      this.timerEvent.remove();
      this.timerEvent = null;
    }
    if (this.keyObj) {
      this.keyObj.off('down');
    }
    if (this.graphics) {
      Object.values(this.graphics).forEach((g) => g.destroy());
      this.graphics = null;
    }
    if (this.wrongKeyListener) {
      this.scene.input.keyboard?.off('keydown', this.wrongKeyListener);
    }
  }

  isActive() {
    return this.active;
  }
}
