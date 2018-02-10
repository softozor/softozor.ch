import { VoidSyncEvent } from 'ts-events';

import Canvas from '../Canvas/Canvas';
import SpriteRenderer from '../Rendering/SpriteRenderer';
import Sprite from '../Rendering/Sprite';

export type ClickHandlerCallback = () => void;

export default abstract class Button extends SpriteRenderer {
  constructor(
    canvas: Canvas,
    private readonly m_X: number,
    private readonly m_Y: number,
    private readonly m_Width: number,
    private readonly m_Height: number,
    private readonly m_ClickDelta: number
  ) {
    super(canvas);
  }

  /**
   * Public methods
   */
  public get visible(): Boolean {
    return this.alpha > 0;
  }

  public attachClickHandler(callback: ClickHandlerCallback) {
    this.m_ClickHandlerCallback.attach(callback);
  }

  public hide(): void {
    this.alpha = 0;
    this.draw(this.alpha);
  }

  public show(): void {
    this.alpha = 1;
    this.draw(this.alpha);
  }

  public click(): void {
    this.m_ClickHandlerCallback.post();
  }

  public hasMouse(event: MouseEvent): Boolean {
    return (
      event.clientX >= this.x - this.clickDelta
      && event.clientX <= this.x + this.width + this.clickDelta
      && event.clientY >= this.y - this.clickDelta
      && event.clientY <= this.y + this.height + this.clickDelta
      && this.visible
    );
  }

  public render(): void {
    this.draw(this.alpha);
  }

  /**
   * Protected methods
   */
  protected get width(): number {
    return this.m_Width;
  }

  protected get height(): number {
    return this.m_Height;
  }

  protected get clickDelta(): number {
    return this.m_ClickDelta;
  }

  protected get x(): number {
    return this.m_X;
  }

  protected get y(): number {
    return this.m_Y;
  }

  /**
   * Private methods
   */
  private get alpha(): number {
    return this.m_Alpha;
  }

  private set alpha(value: number) {
    this.m_Alpha = value;
  }

  /**
   * Protected members
   */
  protected readonly m_Sprite: Sprite = new Sprite();

  /**
   * Private members
   */
  private m_ClickHandlerCallback: VoidSyncEvent = new VoidSyncEvent();
  private m_Alpha: number = 0;
}
