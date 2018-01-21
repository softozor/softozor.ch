import Vector2D from './Math/Vector2D';

export default abstract class MovingObject {
  /**
   * Public methods
   */
  public abstract get position(): Vector2D;
  public abstract get deltaXW(): number;
}
