import { polyfill } from 'es6-promise';

import MainNavigationManager from './MainNavigationManager';
import GameManager from './GameManager/GameManager';
import TeamRenderer from './TeamRenderer';
import ContactFormManager from './ContactFormManager';
import FocusRenderer from './FocusRenderer';
import HighScoresRenderer from './HighScoresRenderer';
import HighScoresDialog from './HighScoresDialog';

export class Application {
  constructor() {
    polyfill();
  }

  /**
   * Public methods
   */
  public exec(): void {
    console.log('Executing application');
  }

  /**
   * Private methods
   */

  /**
   * Private members
   */
  private readonly m_MainNavMgr: MainNavigationManager = new MainNavigationManager();
  private readonly m_TeamRenderer: TeamRenderer = new TeamRenderer();
  private readonly m_GameMgr: GameManager = new GameManager();
  private readonly m_ContactFormMgr: ContactFormManager = new ContactFormManager();
  private readonly m_FocusRenderer: FocusRenderer = new FocusRenderer();
  private readonly m_HighScoresRenderer: HighScoresRenderer = new HighScoresRenderer();
  private readonly m_HighScoresDialog: HighScoresDialog = new HighScoresDialog();
}
/**
 * Non-member methods
 */
