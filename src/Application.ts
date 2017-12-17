import { MainNavigationManager } from './MainNavigationManager'
import './BannerManager.js'

export class Application {
  private m_MainNavMgr: MainNavigationManager;

  constructor() {
    this.m_MainNavMgr = new MainNavigationManager();
  }

  public exec(): void {
    let me: Application = this;
    $(document).ready(function () {
      me.m_MainNavMgr.onDocumentReady();
    });
  }
}