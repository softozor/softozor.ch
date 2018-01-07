import Canvas from '../Canvas'; // TODO: this is the old banner object
import Sprite from './Sprite';
import Position from '../Position';

// SpriteRenderer objects need a reference to the Canvas because
// they write in the Canvas directly (within draw())
export default abstract class SpriteRenderer {
  constructor(
    protected m_Canvas: Canvas,
    private readonly m_Width?: number,
    private readonly m_Height?: number
  ) {}

  /**
   * Public methods
   */
  public abstract draw(pos?: Position): void;

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
