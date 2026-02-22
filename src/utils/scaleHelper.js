import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

/**
 * Set game canvas to fit viewport (maintain aspect ratio).
 * Used for TitleScene, BootScene.
 */
export function setScaleFit(scene) {
  const scale = Math.min(
    window.innerWidth / GAME_WIDTH,
    window.innerHeight / GAME_HEIGHT
  );
  const w = Math.floor(GAME_WIDTH * scale);
  const h = Math.floor(GAME_HEIGHT * scale);
  scene.scale.resize(w, h);
}

/**
 * Set game canvas to full viewport width.
 * Used for GameScene2 (main game).
 */
export function setScaleFullWidth(scene) {
  scene.scale.resize(window.innerWidth, window.innerHeight);
}
