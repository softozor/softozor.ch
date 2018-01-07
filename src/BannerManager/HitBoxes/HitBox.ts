import Position from '../Position';
import Collision from '../Collision';

export default abstract class HitBox {
  /**
   * Public methods
   */
  abstract get centerW(): Position;
  public abstract collide(other: HitBox): Collision | undefined;
}
