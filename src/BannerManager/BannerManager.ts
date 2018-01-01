import { forEach, remove } from 'lodash';

import { ScoreManager } from './ScoreManager';
import { ScorePopper } from './ScorePopper';
import * as BubbleHelpers from './BubbleHelpers';
import * as Helpers from './Helpers';
import { Position } from './Position';
import { Obstacle } from './Obstacle';
import { World } from './World';

export class BannerManager {
  constructor() {
    // TODO: initialize World:
    // m_World = new World(softozorData.startPosition, softozorData.maxYW);

    $(window).resize(() => {
      this.refreshSize();
      this.update();
    });
  }

  public onDocumentReady(): void {}

  /**
   * private methods
   */

  /**
   *  fill image of bubbles
   */
  private fillWorldSquare(): void {
    while (
      banner.gameState === 'on' &&
      lastFilledSquareXW <
        scrollingPosition.xW + banner.widthPX / worldBandRatioToBanner
    ) {
      for (var fillIndex = 0; fillIndex < badBubblePerSquare; fillIndex++) {
        var x =
          Math.random() * band[worldBandIndex].spriteRenderer.heightW +
          lastFilledSquareXW;
        var y =
          BubbleHelpers.approachExtrema01(
            BubbleHelpers.approachExtrema01(Math.random())
          ) *
            90 -
          5;
        var diameter = 10 + Math.random() * 20;
        obstacle[obstacle.length] = BubbleHelpers.badBubble(x, y, diameter);
        obstacle[obstacle.length - 1].refreshSize();
      }
      for (fillIndex = 0; fillIndex < goodBubblePerSquare; fillIndex++) {
        var x =
          Math.random() * band[worldBandIndex].spriteRenderer.heightW +
          lastFilledSquareXW;
        var y =
          BubbleHelpers.approachCenter(
            BubbleHelpers.approachCenter(Math.random())
          ) *
            90 -
          5;
        var diameter = 10 + Math.random() * 20;
        obstacle[obstacle.length] = BubbleHelpers.goodBubble(x, y, diameter);
        obstacle[obstacle.length - 1].refreshSize();
      }
      lastFilledSquareXW += band[worldBandIndex].spriteRenderer.heightW;
    }
  }

  private updateScore(): void {
    // TODO: add a reference to the banner's context in the ScoreMgr?
    let txt: string = this.m_ScoreMgr.text;
    banner.ctx.font = this.m_ScoreMgr.font;
    banner.ctx.fillStyle = this.m_ScoreMgr.fillStyle;
    let textPos: Position = this.m_ScoreMgr.textPosition;
    banner.ctx.fillText(txt, textPos.x, textPos.y);
    banner.ctx.strokeStyle = this.m_ScoreMgr.strokeStyle;
    banner.ctx.strokeText(txt, textPos.x, textPos.y);
  }

  private updateScorePop(element: ScorePopper): void {
    // TODO: add a reference to the banner's context in the ScorePopper?
    banner.ctx.font = element.font;
    banner.ctx.fillStyle = element.fillStyle;
    let softozorPos: Position = new Position(
      softozor.position.xObsPX(),
      softozor.position.yObsPX()
    );
    let textPos: Position = element.textPosition(softozorPos);
    banner.ctx.fillText(element.text, textPos.x, textPos.y);
    element.update();
  }

  private updateScorePops(): void {
    forEach(this.m_ScorePops, function(elem) {
      this.updateScorePop(elem);
    });
  }

  private graphicUpdate(): void {
    // world display
    banner.ctx.globalAlpha = 1;
    for (var bandIndex = band.length - 1; bandIndex >= 0; bandIndex--)
      band[bandIndex].update();

    // game objects display
    banner.ctx.globalAlpha =
      1 * banner.stateTransition * banner.gameEndingTransition;
    softozor.graphicUpdate();
    for (
      var obstacleIndex = 0;
      obstacleIndex < obstacle.length;
      obstacleIndex++
    ) {
      obstacle[obstacleIndex].update();
    }

    // dashboard display
    banner.ctx.globalAlpha = 0.6 * banner.stateTransition;
    this.updateScore();
    this.updateScorePops();

    // game stopped display
    banner.ctx.globalAlpha = 1;
    gameStopped.update();

    // buttonsdisplay
    playButton.update();
    restartButton.update();
  }

  private cleanupObstacles(): void {
    remove(
      this.m_Obstacles,
      (element: Obstacle): Boolean =>
        element.isOutOfBounds(scrollingPosition.xW) || element.hasCollided
    );
  }

  private cleanupScorePops(): void {
    // ScorePops is filled by the softozor class --> maybe softozor should clean that up directly!
    remove(
      this.m_ScorePops,
      (element: ScorePopper): Boolean => element.isTimedOut
    );
  }

  /**
   * game frame function
   */
  private update(): void {
    banner.transitionUpdate();

    softozor.physicUpdate();
    this.graphicUpdate();
    this.cleanupObstacles();
    this.cleanupScorePops();
    this.fillWorldSquare();
  }

  private refreshSize(): void {
    banner.refreshSize();
    for (var bandIndex = 0; bandIndex < band.length; bandIndex++) {
      band[bandIndex].refreshSize();
    }
    softozor.refreshSize();
    for (
      var obstacleIndex = 0;
      obstacleIndex < obstacle.length;
      obstacleIndex++
    ) {
      obstacle[obstacleIndex].refreshSize();
    }
    gameStopped.refreshSize();
    playButton.refreshSize();
    restartButton.refreshSize();
    console.log(banner.widthPX);
  }

  /**
   * private members
   */
  private m_Obstacles: Obstacle[] = [];
  private m_ScorePops: ScorePopper[] = [];
  private m_ScoreMgr: ScoreManager = new ScoreManager();
  private m_World: World;
}
