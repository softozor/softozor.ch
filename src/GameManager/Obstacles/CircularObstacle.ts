import Vector2D from '../Math/Vector2D';
import HitBox from '../HitBoxes/HitBox';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import Obstacle from './Obstacle';
import Canvas from '../Canvas/Canvas';

export default abstract class CircularObstacle extends Obstacle {
  constructor(
    canvas: Canvas,
    topLeftCorner: Vector2D,
    private readonly m_Radius: number,
    private readonly m_Hitbox: CircularHitBox
  ) {
    super(canvas, topLeftCorner);
  }

  /**
   * Public methods
   */
  public isOutOfBounds(scrollingXW: number): Boolean {
    return this.m_TopLeftCorner.x + this.m_Radius <= scrollingXW;
  }

  /**
   * Protected methods
   */
  protected get hitBox(): HitBox {
    return this.m_Hitbox;
  }
}
