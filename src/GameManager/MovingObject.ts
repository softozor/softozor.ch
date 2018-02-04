import Vector2D from './Math/Vector2D';
import Collision from './Collision';
import Obstacle from './Obstacles/Obstacle';

export default abstract class MovingObject {
  /**
   * Public methods
   */
  public abstract get position(): Vector2D;
  public abstract get deltaXW(): number;

  public abstract collide(obstacle: Obstacle): Collision | undefined;
  public abstract handleBadCollision(collision: Collision): void;
}
