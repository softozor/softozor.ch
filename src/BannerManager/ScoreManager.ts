import * as Helpers from './Helpers';
import Position from './Position';

export default class ScoreManager {
  constructor() {}

  /**
   * Getters / setters
   */

  get fillStyle(): string {
    return this.FILL_STYLE;
  }

  get strokeStyle(): string {
    return this.STROKE_STYLE;
  }

  // get heightPX(): number {
  //   return this.HEIGHT_PX;
  // }

  get textPosition(): Position {
    return new Position(this.X_PX, this.Y_PX + this.HEIGHT_PX);
  }

  get font(): string {
    return `bold ${this.HEIGHT_PX}px Arial`;
  }

  // get xPX(): number {
  //   return this.X_PX;
  // }

  // get yPX(): number {
  //   return this.Y_PX;
  // }

  get score(): number {
    return this.m_Score;
  }

  get text(): string {
    return `SCORE : ${this.score}`;
  }

  /**
   * Public methods
   */
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
