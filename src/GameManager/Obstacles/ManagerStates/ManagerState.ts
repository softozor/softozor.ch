import ObstacleManager from '../ObstacleManager';

export default abstract class ManagerState {
  constructor(private readonly m_Mgr: ObstacleManager) {}

  /**
   * Public methods
   */
  public abstract tick(): void;

  public abstract enter(): void;
  public abstract exit(): void;

  /**
   * Protected methods
   */
  protected get mgr(): ObstacleManager {
    return this.m_Mgr;
  }
}
