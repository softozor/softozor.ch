import { MainNavigationManager } from './MainNavigationManager'
import './BannerManager.js'

import { AccordionLoader } from './AccordionLoader.js'
import { ContactLoader } from './ContactLoader.js'

export class Application {
  private m_MainNavMgr: MainNavigationManager;

  constructor() {
    this.m_MainNavMgr = new MainNavigationManager();
  }

  private onDocumentReady(): void {
    this.m_MainNavMgr.onDocumentReady();
    AccordionLoader.showTeam("teamContent");
    ContactLoader.showForm("contactForm");
  }

  public exec(): void {
    $(document).ready(() => this.onDocumentReady());
  }
}