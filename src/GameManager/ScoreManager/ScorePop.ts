import * as Helpers from '../Helpers';
import Vector2D from '../Math/Vector2D';
import Canvas from '../Canvas/Canvas';

export default class ScorePop {
  constructor(
    private readonly m_Canvas: Canvas,
    private readonly m_Pop: string | number,
    private readonly m_DeltaXPX: number
  ) {}

  /**
   * Public methods
   */
  public get deltaXPX(): number {
    return this.m_DeltaXPX;
  }

  public get deltaYPX(): number {
    return this.m_DeltaYPX;
  }

  public get pop(): string | number {
    return this.m_Pop;
  }

  public get fillStyle(): string {
    return this.m_Pop > 0
      ? Helpers.rgba(0, 50, 0, this.opacity())
      : Helpers.rgba(128, 0, 0, this.opacity());
  }

  public get token(): string {
    return this.m_Pop > 0 ? '+' : '';
  }

  public get font(): string {
    return this.FONT;
  }

  public get text(): string {
    return this.token + this.pop;
  }

  public get isTimedOut(): Boolean {
    return this.m_Lifetime <= 0;
  }

  public tick(position: Vector2D): void {
    this.updateText(position);
    this.updateParams();
  }

  public textPosition(objectPos: Vector2D): Vector2D {
    return new Vector2D(
      objectPos.x + this.deltaXPX,
      objectPos.y - this.deltaYPX
    );
  }

  /**
   * Private methods
   */
  private updateText(position: Vector2D): void {
    let ctx: CanvasRenderingContext2D = this.m_Canvas.context;
    ctx.globalAlpha = 0.6;
    ctx.font = this.font;
    ctx.fillStyle = this.fillStyle;
    let textPos: Vector2D = this.textPosition(position);
    ctx.fillText(this.text, textPos.x, textPos.y);
  }

  private updateParams(): void {
    ++this.m_DeltaYPX;
    this.updateLifetime();
  }

  private updateLifetime(): void {
    --this.m_Lifetime;
  }

  private opacity(): number {
    return this.m_Lifetime / this.OPACITY_FACTOR;
  }

  /**
   * Private members
   */
  private readonly FONT: string = 'bold 15px Arial';
  private readonly OPACITY_FACTOR: number = 30;

  private m_DeltaYPX: number = 0;
  private m_Lifetime: number = 30;
}
