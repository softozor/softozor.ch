import { forEach, remove } from 'lodash';

import Canvas from '../Canvas/Canvas';
import ScorePop from './ScorePop';
import Vector2D from '../Math/Vector2D';
import * as CoordinatesAdapter from '../Math/CoordinatesAdapter';
import Softozor from '../Softozor/Softozor';

export default class ScorePopManager {
  constructor(private readonly m_Canvas: Canvas) {}

  /**
   * Public methods
   */
  public tick(): void {
    let movingPos: Vector2D = CoordinatesAdapter.obsPX(
      this.m_MovingObject.position,
      CoordinatesAdapter.WORLD_DISTANCE_FACTOR
    );
    forEach(this.m_ScorePops, function(elem) {
      elem.tick(movingPos);
    });
    this.cleanup();
  }

  public setMovingObject(movingObject: Softozor): void {
    this.m_MovingObject = movingObject;
  }

  public clear(): void {
    this.m_ScorePops.length = 0;
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
  private readonly m_ScorePops: ScorePop[];
  private m_MovingObject: Softozor;
}
