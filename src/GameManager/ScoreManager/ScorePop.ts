import CONSTANTS from '../../../config/game/Constants.json';
import CONFIG from '../../../config/game/ScorePop.json';

import * as Helpers from '../Helpers';
import Vector2D from '../Math/Vector2D';
import Canvas from '../Canvas/Canvas';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';
import MovingObject from '../MovingObject';

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
      ? Helpers.rgba(
        CONFIG.fillStyle.good.r,
        CONFIG.fillStyle.good.g,
        CONFIG.fillStyle.good.b,
        this.opacity()
      )
      : Helpers.rgba(
        CONFIG.fillStyle.bad.r,
        CONFIG.fillStyle.bad.g,
        CONFIG.fillStyle.bad.b,
        this.opacity()
      );
  }

  public get token(): string {
    return this.m_Pop > 0 ? '+' : '';
  }

  public get text(): string {
    return this.token + this.pop;
  }

  public get isTimedOut(): Boolean {
    return this.m_Lifetime <= 0;
  }

  public tick(): void {
    this.render();
    this.updateParams();
  }

  public textPosition(objectPos: Vector2D): Vector2D {
    return new Vector2D(
      objectPos.x + this.deltaXPX,
      objectPos.y - this.deltaYPX
    );
  }

  public render(): void {
    let ctx: CanvasRenderingContext2D = this.m_Canvas.context;
    ctx.globalAlpha = CONFIG.alpha;
    ctx.font = CONFIG.font;
    ctx.fillStyle = this.fillStyle;
    let textPos: Vector2D = this.textPosition(this.movingPosition);
    ctx.fillText(this.text, textPos.x, textPos.y);
  }

  /**
   * Private methods
   */
  private get movingPosition(): Vector2D {
    return MovingCoordinateSystem.obsPX(
      movingObject().position,
      CONSTANTS.WorldDistanceFactor
    );
  }

  private updateParams(): void {
    ++this.m_DeltaYPX;
    this.updateLifetime();
  }

  private updateLifetime(): void {
    --this.m_Lifetime;
  }

  private opacity(): number {
    return this.m_Lifetime / CONFIG.opacityFactor;
  }

  /**
   * Private members
   */
  private m_DeltaYPX: number = CONFIG.deltaY;
  private m_Lifetime: number = CONFIG.lifeTime;
}

function movingObject(): MovingObject {
  return MovingCoordinateSystem.movingObject();
}
