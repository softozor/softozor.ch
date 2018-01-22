import * as Helpers from '../Helpers';
import Vector2D from '../Math/Vector2D';
import Canvas from '../Canvas/Canvas';
import ScorePopManager from './ScorePopManager';
import Softozor from '../Softozor/Softozor';

export default class ScoreManager {
  constructor(private readonly m_Canvas: Canvas) {}

  /**
   * Public methods
   */
  public clear(): void {
    this.m_Score = 0;
    this.m_ScoreIncrement = 1;
    this.m_ScorePopMgr.clear();
  }

  public tick(): void {
    this.updateScore();
    this.m_ScorePopMgr.tick();
  }

  public setMovingObject(movingObject: Softozor): void {
    this.m_ScorePopMgr.setMovingObject(movingObject);
  }

  /**
   * Private methods
   */
  private get fillStyle(): string {
    return this.FILL_STYLE;
  }

  private get strokeStyle(): string {
    return this.STROKE_STYLE;
  }

  private get textPosition(): Vector2D {
    return new Vector2D(this.X_PX, this.Y_PX + this.HEIGHT_PX);
  }

  private get font(): string {
    return `bold ${this.HEIGHT_PX}px Arial`;
  }

  private get score(): number {
    return this.m_Score;
  }

  private get text(): string {
    return `SCORE : ${this.score}`;
  }

  private updateScore(): void {
    let ctx: CanvasRenderingContext2D = this.m_Canvas.context;
    ctx.globalAlpha = 0.6;
    ctx.font = this.font;
    ctx.fillStyle = this.fillStyle;
    ctx.fillText(this.text, this.textPosition.x, this.textPosition.y);
    ctx.strokeStyle = this.strokeStyle;
    ctx.strokeText(this.text, this.textPosition.x, this.textPosition.y);
  }

  /**
   * Private members
   */
  private readonly X_PX: number = 5; // TODO: put these numbers in a config file!
  private readonly Y_PX: number = 5;
  private readonly HEIGHT_PX: number = 20;
  private readonly FILL_STYLE: string = Helpers.rgba(255, 255, 255);
  private readonly STROKE_STYLE: string = Helpers.rgba(0, 64, 128);

  private m_Score: number;
  private m_ScoreIncrement: number;

  private m_ScorePopMgr: ScorePopManager = new ScorePopManager(this.m_Canvas);
}
