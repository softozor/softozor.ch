import ObstacleManager from '../ObstacleManager';
import ManagerState from './ManagerState';

export default class GameOnState extends ManagerState {
  constructor(mgr: ObstacleManager) {
    super(mgr);
  }

  /**
   * Public methods
   */

  public enter(): void {
    console.log('entering state game on');
  }

  public exit(): void {
    console.log('leaving state game on');
  }

  public tick(): void {
    this.mgr.doTick();
  }
}
