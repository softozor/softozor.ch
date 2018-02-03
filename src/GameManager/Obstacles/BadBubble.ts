import * as BUBBLE from '../../../assets/banner/badbubble.png';

import * as CONSTANTS from '../../../config/game/Constants.json';

import Vector2D from '../Math/Vector2D';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import SpriteRenderer from '../Rendering/DynamicSpriteRenderer';
import CircularObstacle from './CircularObstacle';
import Sprite from '../Rendering/Sprite';
import Canvas from '../Canvas/Canvas';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';

export default class BadBubble extends CircularObstacle {
  constructor(
    canvas: Canvas,
    topLeftCorner: Vector2D,
    radius: number,
    hitbox: CircularHitBox
  ) {
    super(canvas, topLeftCorner, radius, hitbox);
    let diameter: number = 2 * radius;
    this.m_SpriteRenderer = new SpriteRenderer(
      canvas,
      diameter,
      diameter,
      (<any>CONSTANTS).WorldDistanceFactor,
      BadBubble.SPRITE
    );
  }

  /**
   * Private methods
   */
  public render(): void {
    let pos: Vector2D = MovingCoordinateSystem.obsPX(
      this.m_TopLeftCorner,
      (<any>CONSTANTS).WorldDistanceFactor
    );
    this.m_SpriteRenderer.draw(1, pos);
  }

  /**
   * Private members
   */
  private static SPRITE: Sprite = createSprite();

  private m_SpriteRenderer: SpriteRenderer;
}

/**
 * Non-member methods
 */
function onImgLoaded(): void {
  console.log(`Loaded sprite ${BUBBLE}.`);
}

function createSprite(): Sprite {
  let result: Sprite = new Sprite();
  result.load(BUBBLE, onImgLoaded);
  return result;
}
