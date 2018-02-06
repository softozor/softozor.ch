import { forEach, remove } from 'lodash';

import Canvas from '../Canvas/Canvas';
import ScorePop from './ScorePop';
import Vector2D from '../Math/Vector2D';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';

export default class ScorePopManager {
  constructor(private readonly m_Canvas: Canvas) {
    this.m_Canvas.attachResizeEvent(this.render.bind(this));
  }

  /**
   * Public methods
   */
  public tick(): void {
    forEach(this.m_ScorePops, (elem: ScorePop): void => elem.tick());
    this.cleanup();
  }

  public clear(): void {
    if (this.m_ScorePops !== undefined) {
      this.m_ScorePops.length = 0;
    }
  }

  public pop(score: number | string): void {
    this.m_ScorePops.push(new ScorePop(this.m_Canvas, score));
  }

  /**
   * Private methods
   */
  private cleanup(): void {
    remove(
      this.m_ScorePops,
      (element: ScorePop): Boolean => element.isTimedOut
    );
  }

  private render(): void {
    forEach(this.m_ScorePops, (elem: ScorePop): void => elem.render());
  }

  /**
   * Private members
   */
  private readonly m_ScorePops: ScorePop[] = new Array<ScorePop>();
}
