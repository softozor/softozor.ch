import Position from '../Position';
import Collision from '../Collision';

export default abstract class HitBox {
  /**
   * Getters / setters
   */
  abstract get centerW(): Position;

  /**
   * Public methods
   */
  public abstract collide(other: HitBox): Collision | undefined;
}
