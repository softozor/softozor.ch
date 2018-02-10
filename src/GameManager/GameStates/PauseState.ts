import { VoidSyncEvent } from 'ts-events';
import GameState from './GameState';

export default class PauseState extends GameState {
  constructor() {
    super();
  }

  /**
   * Public methods
   */
  public enter(): void {
    console.log('entering pause state');
    this.m_ShowBanner.post();
    this.m_StopTick.post();
  }

  public exit(): void {
    console.log('leaving pause state');
  }

  public onPlayClick(): void {
    console.log('play');
    this.m_SetPlayState.post();
  }
}
