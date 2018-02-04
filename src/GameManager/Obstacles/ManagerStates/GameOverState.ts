import ObstacleManager from '../ObstacleManager';
import ManagerState from './ManagerState';

export default class GameOverState extends ManagerState {
  constructor(mgr: ObstacleManager) {
    super(mgr);
  }

  /**
   * Public methods
   */
  public tick(): void {}

  public enter(): void {
    console.log('entering state game over');
    this.mgr.clear();
  }

  public exit(): void {
    console.log('leaving state game over');
  }
}
