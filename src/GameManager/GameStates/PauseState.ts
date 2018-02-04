import GameState from './GameState';

export default class PauseState extends GameState {
  constructor() {
    super();
  }

  /**
   * Public methods
   */
  public enter(): void {
    this.m_ShowBanner();
  }

  public exit(): void {}

  public onPlayClick(): void {
    console.log('play');
    this.m_StartTick();
    this.m_SetPlayState();
  }
}
