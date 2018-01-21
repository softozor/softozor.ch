import { forEach, remove } from 'lodash';

import ScoreManager from './ScoreManager';
import ScorePopper from './ScorePopper';
import * as Helpers from './Helpers';
import Vector2D from './Math/Vector2D';
import World from './World';
import ObstacleManager from './Obstacles/ObstacleManager';
import ParallaxManager from './Parallax/ParallaxManager';
import Canvas from './Canvas/Canvas';

// TODO: rename this object "GameManager" instead of "BannerManager"
// TODO: let this this object decide whether the game stops based on e.g. Softozor::outOfBounds
// TODO: let this object connect / disconnect the Softozor::tick and ObstacleManager::tick
// TODO: do not forget to call ObstacleManager::attachGoodScoreHandler with the following callback:
// scorePop[scorePop.length] = new scorePopProto(scoreIncrement);
// score += scoreIncrement;
// scoreIncrement++;
// TODO: do not forget to call ObstacleManager::attachBadScoreHandler with the following callback:
// scorePop[scorePop.length] = new scorePopProto('xxx');
// scoreIncrement = 1;
// TODO: connect Canvas::upHandler with softozor.stopFlap();
// TODO: connect Canvas::downHandler with softozor.startFlap();
// TODO: connect Canvas::mouseEnterHandler with GameManager::run();
// TODO: connect Canvas::mouseLeaveHandler with GameManager::pause();
// TODO: don't forget to display the restart button when the game is over!

export default class GameManager {
  constructor() {
    // TODO: initialize World:
    // m_World = new World(softozorData.startPosition, softozorData.maxYW);

    $(window).resize(() => {
      // TODO: maybe call resizeEvent.post(window.size), with resizeEvent: SyncEvent<size> (cf. Sprite.ts)
      // in the configuration phase of the BannerManager, for each resizable item, call
      // resizeEvent.attach(item.callback), where callback is the resize() method of each item (or onBannerResize)

      this.refreshSize();
      this.tick();
    });
  }

  public onDocumentReady(): void {}

  /**
   * private methods
   */

  //   // run the game
  // run: function() {
  //   clearInterval(banner.runSpeed);
  //   banner.runSpeed = setInterval(update, this.frameTime);
  //   this.playState = 'starting';
  // },

  // // stop the game
  // pause: function() {
  //   this.playState = 'pausing';
  // },

  // transition between game started and game stopped
  // transitionUpdate: function() {
  //   if (this.playState === 'paused') {
  //   } else if (this.playState === 'pausing') {
  //     if (this.stateTransition > 0)
  //       this.stateTransition = Math.max(0, this.stateTransition - 0.03);
  //     else {
  //       this.playState = 'paused';
  //       clearInterval(banner.runSpeed);
  //     }
  //   } else if (this.playState === 'running') {
  //   } else if (this.playState === 'starting') {
  //     if (this.stateTransition < 1)
  //       this.stateTransition = Math.min(1, this.stateTransition + 0.03);
  //     else this.playState = 'running';
  //   }

  //   if (this.gameState === 'over' && this.gameEndingTransition > 0) {
  //     this.gameEndingTransition = Math.max(this.gameEndingTransition - 0.02, 0);
  //   }

  //   if (this.gameState === 'restarting') {
  //     if (this.gameEndingTransition < 1) {
  //       this.gameEndingTransition = Math.min(
  //         this.gameEndingTransition + 0.01,
  //         1
  //       );
  //       score = Math.round(this.restartScore * (1 - this.gameEndingTransition));
  //       scrollingPosition.xW =
  //         (softozorData.startPosition - this.restartScrollingXW) *
  //           this.gameEndingTransition +
  //         this.restartScrollingXW;
  //       softozor.deltaXW =
  //         (softozorData.originalDeltaXW - this.restartSoftozorDeltaXW) *
  //           this.gameEndingTransition +
  //         this.restartSoftozorDeltaXW;
  //       softozor.position.yW =
  //         (softozorData.originalYW -
  //           softozorData.heightW * worldBandRatioToBanner -
  //           this.restartSoftozorYW) *
  //           this.gameEndingTransition +
  //         this.restartSoftozorYW;
  //       softozor.updatePosition();
  //     } else {
  //       this.gameState = 'on';
  //       banner.reInitialize();
  //     }
  //   }
  // }

  // reInitialize: function() {
  //   this.gameState = 'on';
  //   this.gameEndingTransition = 1;
  //   obstacle = [];
  //   scorePop = [];
  //   scrollingPosition.xW = softozorData.startPosition;
  //   softozor.position.yW =
  //     softozorData.originalYW - softozorData.heightW * worldBandRatioToBanner;
  //   softozor.updatePosition();
  //   softozor.ySpeed = softozorData.minSpeed;
  //   softozor.deltaXW = softozorData.originalDeltaXW;
  //   softozor.flapWait = 0;
  //   softozor.deltaXSpeed = 0;
  //   lastFilledSquareXW = firstFilledSquareDistance + softozorData.startPosition;
  //   score = 0;
  //   scoreIncrement = 1;
  // },

  // restart: function() {
  //   this.gameState = 'restarting';
  //   obstacle = [];
  //   scorePop = [];
  //   this.restartScore = score;
  //   this.restartScrollingXW = scrollingPosition.xW;
  //   this.restartSoftozorDeltaXW = softozor.deltaXW;
  //   this.restartSoftozorYW = softozor.position.yW;
  //   softozor.flapWait = 0;
  //   softozor.deltaXSpeed = 0;
  //   lastFilledSquareXW = firstFilledSquareDistance + softozorData.startPosition;
  //   score = 0;
  //   scoreIncrement = 1;
  // },

  private updateScore(): void {
    // TODO: add a reference to the banner's context in the ScoreMgr?
    let txt: string = this.m_ScoreMgr.text;
    banner.ctx.font = this.m_ScoreMgr.font;
    banner.ctx.fillStyle = this.m_ScoreMgr.fillStyle;
    let textPos: Vector2D = this.m_ScoreMgr.textPosition;
    banner.ctx.fillText(txt, textPos.x, textPos.y);
    banner.ctx.strokeStyle = this.m_ScoreMgr.strokeStyle;
    banner.ctx.strokeText(txt, textPos.x, textPos.y);
  }

  private updateScorePop(element: ScorePopper): void {
    // TODO: add a reference to the banner's context in the ScorePopper?
    banner.ctx.font = element.font;
    banner.ctx.fillStyle = element.fillStyle;
    let softozorPos: Vector2D = new Vector2D(
      softozor.position.xObsPX(),
      softozor.position.yObsPX()
    );
    let textPos: Vector2D = element.textPosition(softozorPos);
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

    this.m_ParallaxMgr.tick();

    // game objects display
    banner.ctx.globalAlpha =
      1 * banner.stateTransition * banner.gameEndingTransition;
    softozor.graphicUpdate();

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
  private tick(): void {
    softozor.physicUpdate();
    this.graphicUpdate();
    this.m_ObstacleMgr.tick();
    this.cleanupScorePops();
    this.m_ParallaxMgr.tick();
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
  private m_Canvas: Canvas = new Canvas();
  private m_ObstacleMgr: ObstacleManager = new ObstacleManager(
    this.m_Canvas,
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
  private readonly m_ParallaxMgr: ParallaxManager = new ParallaxManager(
    this.m_Canvas
  );
}
