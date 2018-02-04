import Canvas from '../Canvas/Canvas';
import Vector2D from '../Math/Vector2D';

export default abstract class SpriteRenderer {
  constructor(protected readonly m_Canvas: Canvas) {}

  /**
   * Public methods
   */
  public abstract draw(alpha: number, pos?: Vector2D): void;

  /**
   * Protected methods
   */
  protected abstract get width(): number;

  protected abstract get height(): number;
}
