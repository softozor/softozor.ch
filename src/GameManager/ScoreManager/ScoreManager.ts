import CONFIG from '../../../config/game/Score.json';

import * as Helpers from '../Helpers';
import Vector2D from '../Math/Vector2D';
import Canvas from '../Canvas/Canvas';
import ScorePopManager from './ScorePopManager';

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

  /**
   * Private methods
   */
  private get fillStyle(): string {
    return Helpers.rgba(
      CONFIG.fillStyle.r,
      CONFIG.fillStyle.g,
      CONFIG.fillStyle.b
    );
  }

  private get strokeStyle(): string {
    return Helpers.rgba(
      CONFIG.strokeStyle.r,
      CONFIG.strokeStyle.g,
      CONFIG.strokeStyle.b
    );
  }

  private get textPosition(): Vector2D {
    return new Vector2D(CONFIG.x, CONFIG.y + CONFIG.height);
  }

  private get font(): string {
    return `bold ${CONFIG.height}px Arial`;
  }

  private get score(): number {
    return this.m_Score;
  }

  private get text(): string {
    return `SCORE : ${this.score}`;
  }

  private updateScore(): void {
    let ctx: CanvasRenderingContext2D = this.m_Canvas.context;
    ctx.globalAlpha = CONFIG.alpha;
    ctx.font = this.font;
    ctx.fillStyle = this.fillStyle;
    ctx.fillText(this.text, this.textPosition.x, this.textPosition.y);
    ctx.strokeStyle = this.strokeStyle;
    ctx.strokeText(this.text, this.textPosition.x, this.textPosition.y);
  }

  /**
   * Private members
   */
  private m_Score: number;
  private m_ScoreIncrement: number;

  private m_ScorePopMgr: ScorePopManager = new ScorePopManager(this.m_Canvas);
}
