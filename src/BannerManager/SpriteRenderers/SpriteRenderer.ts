import Canvas from '../Canvas'; // TODO: this is the old banner object
import Sprite from './Sprite';
import Vector2D from '../Vector2D';

// SpriteRenderer objects need a reference to the Canvas because
// they write in the Canvas directly (within draw())
export default abstract class SpriteRenderer {
  constructor(
    protected readonly m_Canvas: Canvas,
    private readonly m_Width?: number,
    private readonly m_Height?: number
  ) {}

  /**
   * Public methods
   */
  public abstract draw(pos?: Vector2D): void;

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
