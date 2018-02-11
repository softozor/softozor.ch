﻿import { polyfill } from 'es6-promise';

import MainNavigationManager from './MainNavigationManager';
import GameManager from './GameManager/GameManager';
import TeamRenderer from './TeamRenderer';
import ContactFormManager from './ContactFormManager';
import FocusRenderer from './FocusRenderer';
import HighScoresRenderer from './HighScoresRenderer';

export class Application {
  constructor() {
    polyfill();
    this.connectHandlers();
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
  private connectHandlers(): void {
    this.m_GameMgr.attachRefreshHighScoresHandler(
      this.m_HighScoresRenderer.refreshScores.bind(this.m_HighScoresRenderer)
    );
  }

  /**
   * Private members
   */
  private readonly m_MainNavMgr: MainNavigationManager = new MainNavigationManager();
  private readonly m_TeamRenderer: TeamRenderer = new TeamRenderer();
  private readonly m_GameMgr: GameManager = new GameManager();
  private readonly m_ContactFormMgr: ContactFormManager = new ContactFormManager();
  private readonly m_FocusRenderer: FocusRenderer = new FocusRenderer();
  private readonly m_HighScoresRenderer: HighScoresRenderer = new HighScoresRenderer();
}
/**
 * Non-member methods
 */
