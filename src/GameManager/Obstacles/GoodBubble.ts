import BUBBLE from '../../../assets/banner/goodbubble.png';

import CONSTANTS from '../../../config/game/Constants.json';

import Vector2D from '../Math/Vector2D';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import SpriteRenderer from '../SpriteRenderers/DynamicSpriteRenderer';
import CircularObstacle from './CircularObstacle';
import Sprite from '../SpriteRenderers/Sprite';
import Canvas from '../Canvas/Canvas';

export default class GoodBubble extends CircularObstacle {
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
      GoodBubble.SPRITE,
      CONSTANTS.WorldDistanceFactor
    );
  }

  public render(): void {
    let pos: Vector2D = MovingCoordinateSystem.obsPX(
      this.m_TopLeftCorner,
      CONSTANTS.WorldDistanceFactor
    );
    this.m_SpriteRenderer.draw(1, pos);
  }

  /**
   * Private members
   */
  private static SPRITE: Sprite = new Sprite(BUBBLE);

  private m_SpriteRenderer: SpriteRenderer;
}
