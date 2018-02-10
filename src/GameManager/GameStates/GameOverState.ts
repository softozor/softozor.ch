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
    console.log('entering game over state');
    this.m_ClearGame.post();
  }

  public exit(): void {
    console.log('leaving game over state');
  }

  public onPlayClick(): void {}
}
