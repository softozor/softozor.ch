import Canvas from '../Canvas';
import SpriteRenderer from './SpriteRenderer';
import Sprite from './Sprite';

export default abstract class ButtonRenderer extends SpriteRenderer {
  constructor(
    canvas: Canvas,
    protected readonly m_Sprite: Sprite,
    private readonly m_xPX: number,
    private readonly m_yPX: number,
    width: number,
    height: number,
    private readonly m_ClickDeltaPX: number
  ) {
    super(canvas, width, height);
  }

  /**
   * Public methods
   */
  public hasMouse(event: MouseEvent): Boolean {
    return (
      event.clientX >= this.xPX - this.clickDeltaPX &&
      event.clientX <= this.xPX + this.width + this.clickDeltaPX &&
      event.clientY >= this.yPX - this.clickDeltaPX &&
      event.clientY <= this.yPX + this.height + this.clickDeltaPX
    );
  }

  /**
   * Protected methods
   */
  protected get clickDeltaPX(): number {
    return this.m_ClickDeltaPX;
  }

  protected get xPX(): number {
    return this.m_xPX;
  }

  protected get yPX(): number {
    return this.m_yPX;
  }
}
