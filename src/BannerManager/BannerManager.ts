import { forEach, remove } from 'lodash';

import ScoreManager from './ScoreManager';
import ScorePopper from './ScorePopper';
import * as Helpers from './Helpers';
import Position from './Position';
import World from './World';
import ObstacleManager from './Obstacles/ObstacleManager';

export default class BannerManager {
  constructor() {
    // TODO: initialize World:
    // m_World = new World(softozorData.startPosition, softozorData.maxYW);

    $(window).resize(() => {
      // TODO: maybe call resizeEvent.post(window.size), with resizeEvent: SyncEvent<size> (cf. Sprite.ts)
      // in the configuration phase of the BannerManager, for each resizable item, call
      // resizeEvent.attach(item.callback), where callback is the resize() method of each item (or onBannerResize)

      this.refreshSize();
      this.update();
    });
  }

  public onDocumentReady(): void {}

  /**
   * private methods
   */
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
    softozor.physicUpdate();
    this.graphicUpdate();
    this.m_ObstacleMgr.update();
    this.cleanupScorePops();
  }

  private refreshSize(): void {
    banner.refreshSize();
    // TODO: get rid of all of these refreshSize methods
    // playButton.refreshSize();
    // restartButton.refreshSize();
  }

  /**
   * private members
   */
  private m_ObstacleMgr: ObstacleManager = new ObstacleManager(
    softozorData.startPosition,
    (worldBandRatioToBanner - 1 + worldDistanceFactor) *
      100 /
      worldBandRatioToBanner
    // see bandProto::refreshSize; indeed, the method ObstacleManager::fillWorldSquare bases on band[worldBandIndex].spriteRenderer.heightW
    // and band[0] = new bandProto(spriteList.world, worldDistanceFactor);
    // which means that the bandProto::refreshSize always end up with the same this.spriteRenderer.heightW value, which turns to be 100
  );
  // private m_Obstacles: Obstacle[] = [];
  private m_ScorePops: ScorePopper[] = [];
  private m_ScoreMgr: ScoreManager = new ScoreManager();
  private m_World: World;
}
