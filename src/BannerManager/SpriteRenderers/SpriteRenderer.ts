import Canvas from '../Canvas'; // TODO: this is the old banner object
import Sprite from './Sprite';

// SpriteRenderer objects need a reference to the Canvas because
// they write in the Canvas directly (within draw())
export default abstract class SpriteRenderer {
  constructor(
    protected m_Canvas: Canvas,
    protected m_Width?: number,
    protected m_Height?: number
  ) {
    m_Canvas.attachResizedEvent((w: number, h: number): void =>
      this.onCanvasResized(w, h)
    );
  }

  /**
   * Public methods
   */
  public abstract draw(): void;

  /**
   * Protected getters / setters
   */

  protected get width(): number {
    return this.m_Width;
  }

  protected get height(): number {
    return this.m_Height;
  }

  protected set width(value: number) {
    this.m_Width = value;
  }

  protected set height(value: number) {
    this.m_Height = value;
  }

  /**
   * Protected methods
   */
  protected abstract onCanvasResized(width: number, height: number): void;
}
