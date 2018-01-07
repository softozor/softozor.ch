import Position from '../Position';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import SpriteRenderer from '../SpriteRenderers/DynamicSpriteRenderer';
import CircularObstacle from './CircularObstacle';
import Sprite from '../SpriteRenderers/Sprite';
import Canvas from '../Canvas';

import BUBBLE from '../../../assets/banner/goodbubble.png';

export default class GoodBubble extends CircularObstacle {
  constructor(
    canvas: Canvas,
    position: Position,
    radius: number,
    hitbox: CircularHitBox
  ) {
    super(canvas, position, radius, hitbox);
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
    let pos: Position = new Position(
      this.m_Position.xObsPX,
      this.m_Position.yObsPX
    );
    this.m_SpriteRenderer.draw(pos);
  }

  /**
   * Private members
   */
  private static SPRITE: Sprite = new Sprite(BUBBLE);

  private m_SpriteRenderer: SpriteRenderer;
}
