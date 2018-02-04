import MainNavigationManager from './MainNavigationManager';
// import { initGame } from './BannerManager.js';

import GameManager from './GameManager/GameManager'; // new banner code

import TeamRenderer from './TeamRenderer';
import { ContactLoader } from './ContactLoader.js';

export class Application {
  constructor() {
    this.m_MainNavMgr = new MainNavigationManager();
    this.m_TeamRenderer = new TeamRenderer();
  }

  /**
   * Public methods
   */
  public exec(): void {
    $(document).ready(() => this.onDocumentReady());
  }

  /**
   * Private methods
   */
  private onDocumentReady(): void {
    // TODO: instead of calling onDocumentReady for each class, I would rather emit a signal and
    // register somewhere the signal / slot combination
    this.m_MainNavMgr.onDocumentReady();
    this.m_TeamRenderer.onDocumentReady();
    // this.m_GameMgr.onDocumentReady(); // new banner code
    //ContactLoader.showForm("contactForm");
    // initGame(); // old banner code

    this.m_GameMgr = new GameManager(); // new banner code
  }

  /**
   * Private members
   */
  private m_MainNavMgr: MainNavigationManager;
  private m_TeamRenderer: TeamRenderer;
  private m_GameMgr: GameManager; // new banner code
}

/**
 * Non-member methods
 */
