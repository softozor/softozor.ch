import * as CONFIG from '../../../config/game/Score.json';

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
    this.m_Score = initScore();
    this.m_ScoreIncrement = initScoreIncrement();
    this.m_ScorePopMgr.clear();
  }

  public tick(): void {
    this.render();
    this.m_ScorePopMgr.tick();
  }

  public show(): void {
    this.m_Alpha = 1;
    this.render();
  }

  public hide(): void {
    this.m_Alpha = 0;
    this.render();
  }

  public render(): void {
    let ctx: CanvasRenderingContext2D = this.m_Canvas.context;
    ctx.globalAlpha = this.m_Alpha * (<any>CONFIG).alpha;
    ctx.font = this.font;
    ctx.fillStyle = this.fillStyle;
    ctx.fillText(this.text, this.textPosition.x, this.textPosition.y);
    ctx.strokeStyle = this.strokeStyle;
    ctx.strokeText(this.text, this.textPosition.x, this.textPosition.y);
  }

  public addGoodScore(): void {
    this.m_ScorePopMgr.pop(this.m_ScoreIncrement);
    this.m_Score += this.m_ScoreIncrement++;
  }

  public addBadScore(): void {
    this.m_ScorePopMgr.pop('xxx');
    this.m_ScoreIncrement = initScoreIncrement();
  }

  /**
   * Private methods
   */
  private get fillStyle(): string {
    return Helpers.rgba(
      (<any>CONFIG).fillStyle.r,
      (<any>CONFIG).fillStyle.g,
      (<any>CONFIG).fillStyle.b
    );
  }

  private get strokeStyle(): string {
    return Helpers.rgba(
      (<any>CONFIG).strokeStyle.r,
      (<any>CONFIG).strokeStyle.g,
      (<any>CONFIG).strokeStyle.b
    );
  }

  private get textPosition(): Vector2D {
    return new Vector2D(
      (<any>CONFIG).x,
      (<any>CONFIG).y + (<any>CONFIG).height
    );
  }

  private get font(): string {
    return `bold ${(<any>CONFIG).height}px Arial`;
  }

  private get score(): number {
    return this.m_Score;
  }

  private get text(): string {
    return `SCORE : ${this.score}`;
  }

  /**
   * Private members
   */
  private m_Alpha: number = 0;
  private m_Score: number = initScore();
  private m_ScoreIncrement: number = initScoreIncrement();

  private m_ScorePopMgr: ScorePopManager = new ScorePopManager(this.m_Canvas);
}

/**
 * Non-member methods
 */
function initScore(): number {
  return 0;
}

function initScoreIncrement(): number {
  return 1;
}
