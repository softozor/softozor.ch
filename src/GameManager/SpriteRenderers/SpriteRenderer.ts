import Canvas from '../Canvas/Canvas';
import Sprite from './Sprite';
import Vector2D from '../Math/Vector2D';

export default abstract class SpriteRenderer {
  constructor(
    protected readonly m_Canvas: Canvas,
    private readonly m_Width?: number,
    private readonly m_Height?: number
  ) {}

  /**
   * Public methods
   */
  public abstract draw(alpha: number, pos?: Vector2D): void;

  /**
   * Protected methods
   */
  protected get width(): number {
    return this.m_Width;
  }

  protected get height(): number {
    return this.m_Height;
  }
}
