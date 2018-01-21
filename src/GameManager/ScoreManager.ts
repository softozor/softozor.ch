import * as Helpers from './Helpers';
import Vector2D from './Math/Vector2D';

export default class ScoreManager {
  constructor() {}

  /**
   * Public methods
   */
  get fillStyle(): string {
    return this.FILL_STYLE;
  }

  get strokeStyle(): string {
    return this.STROKE_STYLE;
  }

  get textPosition(): Vector2D {
    return new Vector2D(this.X_PX, this.Y_PX + this.HEIGHT_PX);
  }

  get font(): string {
    return `bold ${this.HEIGHT_PX}px Arial`;
  }

  get score(): number {
    return this.m_Score;
  }

  get text(): string {
    return `SCORE : ${this.score}`;
  }

  public update(): void {}

  /**
   * Private members
   */
  private readonly X_PX: number = 5;
  private readonly Y_PX: number = 5;
  private readonly HEIGHT_PX: number = 20;
  private readonly FILL_STYLE: string = Helpers.rgba(255, 255, 255);
  private readonly STROKE_STYLE: string = Helpers.rgba(0, 64, 128);

  private m_Score: number = 0;
  private m_ScoreIncrement: number = 1;
}
