import Position from '../Position';
import HitBox from '../HitBoxes/HitBox';
import Collision from '../Collision';
import Canvas from '../Canvas';

export default abstract class Obstacle {
  constructor(
    protected readonly m_Canvas: Canvas,
    protected readonly m_TopLeftCorner: Position
  ) {}

  /**
   * Public methods
   */
  get hasCollided(): Boolean {
    return this.m_HasCollided;
  }

  abstract get hitBox(): HitBox;

  public tick(): void {
    this.render();
  }

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