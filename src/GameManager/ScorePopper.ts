import * as Helpers from './Helpers';
import Vector2D from './Vector2D';

export default class ScorePopper {
  constructor(
    private readonly m_Pop: string | number,
    private readonly m_DeltaXPX: number
  ) {}

  /**
   * Public methods
   */
  get deltaXPX(): number {
    return this.m_DeltaXPX;
  }

  get deltaYPX(): number {
    return this.m_DeltaYPX;
  }

  get pop(): string | number {
    return this.m_Pop;
  }

  get fillStyle(): string {
    return this.m_Pop > 0
      ? Helpers.rgba(0, 50, 0, this.opacity())
      : Helpers.rgba(128, 0, 0, this.opacity());
  }

  get token(): string {
    return this.m_Pop > 0 ? '+' : '';
  }

  get font(): string {
    return this.FONT;
  }

  get text(): string {
    return this.token + this.pop;
  }

  get isTimedOut(): Boolean {
    return this.m_Lifetime <= 0;
  }

  public update(): void {
    ++this.m_DeltaYPX;
    this.updateLifetime();
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
