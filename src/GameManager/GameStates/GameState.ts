type ActionHandler = () => void;

export default abstract class GameState {
  constructor() {}

  /**
   * Public methods
   */
  public abstract enter(): void;
  public abstract exit(): void;
  public abstract onPlayClick(): void;

  public attachStartTickHandler(callback: ActionHandler): void {
    this.m_StartTick = callback;
  }

  public attachStopTickHandler(callback: ActionHandler): void {
    this.m_StopTick = callback;
  }

  public attachSetPlayStateHandler(callback: ActionHandler): void {
    this.m_SetPlayState = callback;
  }

  public attachSetPauseStateHandler(callback: ActionHandler): void {
    this.m_SetPauseState = callback;
  }

  public attachShowBannerHandler(callback: ActionHandler): void {
    this.m_ShowBanner = callback;
  }

  public attachHideBannerHandler(callback: ActionHandler): void {
    this.m_HideBanner = callback;
  }

  /**
   * Protected members
   */
  protected m_StartTick: ActionHandler;
  protected m_StopTick: ActionHandler;
  protected m_SetPlayState: ActionHandler;
  protected m_SetPauseState: ActionHandler;
  protected m_ShowBanner: ActionHandler;
  protected m_HideBanner: ActionHandler;
}
