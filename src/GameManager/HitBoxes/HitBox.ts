import Vector2D from '../Math/Vector2D';
import Collision from '../Collision';

export default abstract class HitBox {
  /**
   * Public methods
   */
  abstract get centerW(): Vector2D;
  public abstract collide(other: HitBox): Collision | undefined;
}
