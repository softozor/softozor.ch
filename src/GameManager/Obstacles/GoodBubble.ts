import BUBBLE from '../../../assets/banner/goodbubble.png';

import Vector2D from '../Math/Vector2D';
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
      worldDistanceFactor
    );
  }

  /**
   * Private methods
   */
  protected render(): void {
    let pos: Vector2D = new Vector2D(
      this.m_TopLeftCorner.xObsPX,
      this.m_TopLeftCorner.yObsPX
    );
    this.m_SpriteRenderer.draw(pos);
  }

  /**
   * Private members
   */
  private static SPRITE: Sprite = new Sprite(BUBBLE);

  private m_SpriteRenderer: SpriteRenderer;
}
