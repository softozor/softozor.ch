import BUBBLE from '../../../assets/banner/badbubble.png';

import Vector2D from '../Math/Vector2D';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import SpriteRenderer from '../SpriteRenderers/DynamicSpriteRenderer';
import CircularObstacle from './CircularObstacle';
import Sprite from '../SpriteRenderers/Sprite';
import Canvas from '../Canvas/Canvas';
import * as CoordinatesAdapter from '../Math/CoordinatesAdapter';

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
      BadBubble.SPRITE,
      this.m_DistanceFactor
    );
  }

  /**
   * Private methods
   */
  protected render(): void {
    let pos: Vector2D = CoordinatesAdapter.obsPX(
      this.m_TopLeftCorner,
      this.m_DistanceFactor
    );
    this.m_Canvas.context.globalAlpha = 1;
    this.m_SpriteRenderer.draw(pos);
  }

  /**
   * Private members
   */
  private static SPRITE: Sprite = new Sprite(BUBBLE);

  private m_DistanceFactor: number = CoordinatesAdapter.WORLD_DISTANCE_FACTOR;
  private m_SpriteRenderer: SpriteRenderer;
}
