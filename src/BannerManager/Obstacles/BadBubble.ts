import Position from '../Position';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import SpriteRenderer from '../SpriteRenderers/DynamicSpriteRenderer';
import CircularObstacle from './CircularObstacle';
import Sprite from '../SpriteRenderers/Sprite';
import Canvas from '../Canvas';

import BUBBLE from '../../../assets/banner/badbubble.png';

export default class BadBubble extends CircularObstacle {
  constructor(
    canvas: Canvas,
    topLeftCorner: Position,
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
      worldDistanceFactor
    );
  }

  /**
   * Private methods
   */
  protected render(): void {
    let pos: Position = new Position(
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
