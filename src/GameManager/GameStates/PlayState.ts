import GameState from './GameState';

export default class PlayState extends GameState {
  constructor() {
    super();
  }

  /**
   * Public methods
   */

  public enter(): void {
    this.m_HideBanner();
  }

  public exit(): void {}

  public onPlayClick(): void {
    console.log('pause');
    this.m_StopTick();
    this.m_SetPauseState();
  }
}
