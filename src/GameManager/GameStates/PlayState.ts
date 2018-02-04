import GameState from './GameState';

export default class PlayState extends GameState {
  constructor() {
    super();
  }

  /**
   * Public methods
   */

  public enter(): void {
    console.log('entering play state');
    this.m_HideBanner();
    this.m_StartTick();
  }

  public exit(): void {
    console.log('leaving play state');
  }

  public onPlayClick(): void {
    this.m_SetPauseState();
  }

  public onRestartClick(): void {}
}
