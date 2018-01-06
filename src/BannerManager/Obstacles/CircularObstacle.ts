import Position from '../Position';
import HitBox from '../HitBoxes/HitBox';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import Obstacle from './Obstacle';

export default abstract class CircularObstacle extends Obstacle {
  constructor(
    position: Position,
    private readonly m_Radius: number,
    private readonly m_Hitbox: CircularHitBox
  ) {
    super(position);
  }

  /**
   * Getters / setters
   */
  get hitBox(): HitBox {
    return this.m_Hitbox;
  }

  /**
   * Public methods
   */
  public isOutOfBounds(scrollingXW: number): Boolean {
    return this.m_Position.x + this.m_Radius <= scrollingXW;
  }

  /**
   * Private methods
   */

  /**
   * Private members
   */
}
