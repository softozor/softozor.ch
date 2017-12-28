import { MainNavigationManager } from './MainNavigationManager';
import { initGame } from './BannerManager.js';

import { TeamRenderer } from './TeamRenderer';
import { ContactLoader } from './ContactLoader.js';

export class Application {
  private m_MainNavMgr: MainNavigationManager;
  private m_TeamRenderer: TeamRenderer;

  constructor() {
    this.m_MainNavMgr = new MainNavigationManager();
    this.m_TeamRenderer = new TeamRenderer();
  }

  private onDocumentReady(): void {
    this.m_MainNavMgr.onDocumentReady();
    this.m_TeamRenderer.onDocumentReady();
    //ContactLoader.showForm("contactForm");
    initGame();
  }

  public exec(): void {
    $(document).ready(() => this.onDocumentReady());
  }
}
