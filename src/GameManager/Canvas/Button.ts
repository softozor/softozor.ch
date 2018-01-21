import Canvas from './Canvas/Canvas';
import SpriteRenderer from '../SpriteRenderers/SpriteRenderer';
import Sprite from '../SpriteRenderers/Sprite';

export type ClickHandlerCallback = () => void;

export default abstract class Button extends SpriteRenderer {
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
  public set clickHandler(callback: ClickHandlerCallback) {
    this.m_ClickHandlerCallback = callback;
  }

  public get visible(): Boolean {
    return this.m_Visible;
  }

  // TODO: do an animation on the globalAlpha value from 1 to 0 (or vice-versa) when we hide (or show) a button
  public hide(): void {
    this.m_Canvas.context.globalAlpha = 0;
    this.draw();
    this.m_Visible = false;
  }

  public show(): void {
    this.m_Canvas.context.globalAlpha = 1;
    this.draw();
    this.m_Visible = true;
  }

  public click(): void {
    this.m_ClickHandlerCallback();
  }

  public hasMouse(event: MouseEvent): Boolean {
    return (
      event.clientX >= this.xPX - this.clickDeltaPX &&
      event.clientX <= this.xPX + this.width + this.clickDeltaPX &&
      event.clientY >= this.yPX - this.clickDeltaPX &&
      event.clientY <= this.yPX + this.height + this.clickDeltaPX &&
      this.visible
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

  /**
   * Private members
   */
  private m_ClickHandlerCallback: ClickHandlerCallback;
  private m_Visible: Boolean = false;
}
