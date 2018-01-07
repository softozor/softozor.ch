import Position from '../Position';
import HitBox from '../HitBoxes/HitBox';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import Obstacle from './Obstacle';
import Canvas from '../Canvas';

export default abstract class CircularObstacle extends Obstacle {
  constructor(
    canvas: Canvas,
    position: Position,
    private readonly m_Radius: number,
    private readonly m_Hitbox: CircularHitBox
  ) {
    super(canvas, position);
  }

  /**
   * Public methods
   */
  get hitBox(): HitBox {
    return this.m_Hitbox;
  }

  public isOutOfBounds(scrollingXW: number): Boolean {
    return this.m_Position.x + this.m_Radius <= scrollingXW;
  }
}
