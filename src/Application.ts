import { polyfill } from 'es6-promise';

import MainNavigationManager from './MainNavigationManager';
import GameManager from './GameManager/GameManager';
import TeamRenderer from './TeamRenderer';
import ContactFormManager from './ContactFormManager';
import FocusRenderer from './FocusRenderer';
import HighScoresRenderer from './HighScoresRenderer';

export class Application {
  constructor() {
    polyfill();
  }

  /**
   * Public methods
   */
  public exec(): void {
    this.onDocumentReady();
  }

  /**
   * Private methods
   */
  private onDocumentReady(): void {
    this.m_MainNavMgr = new MainNavigationManager();
    this.m_TeamRenderer = new TeamRenderer();
    this.m_GameMgr = new GameManager();
    this.m_ContactFormMgr = new ContactFormManager('#contactForm');
    this.m_FocusRenderer = new FocusRenderer();
    this.m_HighScoresRenderer = new HighScoresRenderer();
  }

  /**
   * Private members
   */
  private m_MainNavMgr: MainNavigationManager;
  private m_TeamRenderer: TeamRenderer;
  private m_GameMgr: GameManager;
  private m_ContactFormMgr: ContactFormManager;
  private m_FocusRenderer: FocusRenderer;
  private m_HighScoresRenderer: HighScoresRenderer;
}
/**
 * Non-member methods
 */
