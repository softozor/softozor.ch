import { VoidSyncEvent } from 'ts-events';
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
    this.m_HideBanner.post();
    this.m_StartTick.post();
  }

  public exit(): void {
    console.log('leaving play state');
  }

  public onPlayClick(): void {
    this.m_SetPauseState.post();
  }

  public onRestartClick(): void {}
}
