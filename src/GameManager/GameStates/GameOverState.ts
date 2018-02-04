import GameState from './GameState';

export default class PauseState extends GameState {
  constructor() {
    super();
  }

  /**
   * Public methods
   */
  public enter(): void {
    console.log('entering game over state');
    this.m_ClearGame();
  }

  public exit(): void {
    console.log('leaving game over state');
  }

  public onPlayClick(): void {}
}
