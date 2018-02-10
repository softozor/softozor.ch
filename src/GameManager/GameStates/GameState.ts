import { VoidSyncEvent } from 'ts-events';

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
    this.m_StartTick.attach(callback);
  }

  public attachStopTickHandler(callback: ActionHandler): void {
    this.m_StopTick.attach(callback);
  }

  public attachSetPlayStateHandler(callback: ActionHandler): void {
    this.m_SetPlayState.attach(callback);
  }

  public attachSetPauseStateHandler(callback: ActionHandler): void {
    this.m_SetPauseState.attach(callback);
  }

  public attachShowBannerHandler(callback: ActionHandler): void {
    this.m_ShowBanner.attach(callback);
  }

  public attachHideBannerHandler(callback: ActionHandler): void {
    this.m_HideBanner.attach(callback);
  }

  public attachClearGameHandler(callback: ActionHandler): void {
    this.m_ClearGame.attach(callback);
  }

  /**
   * Protected members
   */
  protected m_StartTick: VoidSyncEvent = new VoidSyncEvent();
  protected m_StopTick: VoidSyncEvent = new VoidSyncEvent();
  protected m_SetPlayState: VoidSyncEvent = new VoidSyncEvent();
  protected m_SetPauseState: VoidSyncEvent = new VoidSyncEvent();
  protected m_ShowBanner: VoidSyncEvent = new VoidSyncEvent();
  protected m_HideBanner: VoidSyncEvent = new VoidSyncEvent();
  protected m_ClearGame: VoidSyncEvent = new VoidSyncEvent();
}
