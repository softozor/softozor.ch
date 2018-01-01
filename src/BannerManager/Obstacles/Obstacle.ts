import { Position } from '../Position';
import { HitBox } from '../HitBoxes/HitBox';
import { Collision } from '../Collision';

/**
 * m_Position is the top-left corner of a rectangle that wraps the obstacle
 */
export abstract class Obstacle {
  constructor(protected readonly m_Position: Position) {}

  /**
   * Getters / setters
   */

  get hasCollided(): Boolean {
    return this.m_HasCollided;
  }

  abstract get hitBox(): HitBox;

  /**
   * Public methods
   */

  public update(): void {
    this.render();
  }

  public abstract refreshSize(): void;

  public collide(hitBox: HitBox): Collision | undefined {
    let collision: Collision | undefined = this.hitBox.collide(hitBox);
    if (collision !== undefined) {
      this.m_HasCollided = true;
      return collision;
    }
    return undefined;
  }

  public abstract isOutOfBounds(scrollingXW: number): Boolean;

  /**
   * Protected methods
   */

  protected abstract render(): void;

  /**
   * Private members
   */
  private m_HasCollided: Boolean = false;
}
