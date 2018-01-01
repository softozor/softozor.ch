import { MainNavigationManager } from './MainNavigationManager';
import { initGame } from './BannerManager.js';

// import { BannerManager } from './BannerManager/BannerManager'; // new banner code

import { TeamRenderer } from './TeamRenderer';
import { ContactLoader } from './ContactLoader.js';

export class Application {
  private m_MainNavMgr: MainNavigationManager;
  private m_TeamRenderer: TeamRenderer;
  // private m_BannerMgr: BannerManager; // new banner code

  constructor() {
    this.m_MainNavMgr = new MainNavigationManager();
    this.m_TeamRenderer = new TeamRenderer();
    // this.m_BannerMgr = new BannerManager(); // new banner code
  }

  private onDocumentReady(): void {
    // TODO: instead of calling onDocumentReady for each class, I would rather emit a signal and
    // register somewhere the signal / slot combination
    this.m_MainNavMgr.onDocumentReady();
    this.m_TeamRenderer.onDocumentReady();
    // this.m_BannerMgr.onDocumentReady(); // new banner code
    //ContactLoader.showForm("contactForm");
    initGame(); // old banner code
  }

  public exec(): void {
    $(document).ready(() => this.onDocumentReady());
  }
}
