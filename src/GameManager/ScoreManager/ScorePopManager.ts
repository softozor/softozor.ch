import { forEach, remove } from 'lodash';

import Canvas from '../Canvas/Canvas';
import ScorePop from './ScorePop';
import Vector2D from '../Math/Vector2D';

export default class ScorePopManager {
  constructor(private readonly m_Canvas: Canvas) {}

  /**
   * Public methods
   */
  public tick(position: Vector2D): void {
    forEach(this.m_ScorePops, function(elem) {
      elem.tick(position);
    });
    this.cleanup();
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

  /**
   * Private members
   */
  private m_ScorePops: ScorePop[] = [];
}
