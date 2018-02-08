import { polyfill } from 'es6-promise';

import MainNavigationManager from './MainNavigationManager';
import GameManager from './GameManager/GameManager';
import TeamRenderer from './TeamRenderer';
import ContactFormManager from './ContactFormManager';

export class Application {
  constructor() {
    polyfill();
  }

  /**
   * Public methods
   */
  public exec(): void {
    // $(document).ready(() => this.onDocumentReady());
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
  }

  /**
   * Private members
   */
  private m_MainNavMgr: MainNavigationManager;
  private m_TeamRenderer: TeamRenderer;
  private m_GameMgr: GameManager;
  private m_ContactFormMgr: ContactFormManager;
}
/**
 * Non-member methods
 */
