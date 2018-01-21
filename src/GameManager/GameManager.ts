import { forEach, remove } from 'lodash';

import ScoreManager from './ScoreManager/ScoreManager';
import * as Helpers from './Helpers';
import Vector2D from './Math/Vector2D';
import ObstacleManager from './Obstacles/ObstacleManager';
import ParallaxManager from './Parallax/ParallaxManager';
import Canvas from './Canvas/Canvas';
import Softozor from './Softozor/Softozor';
import * as CoordinatesAdapter from './Math/CoordinatesAdapter';

// TODO: let this this object decide whether the game stops based on e.g. Softozor::outOfBounds
// TODO: let this object connect / disconnect the Softozor::tick and ObstacleManager::tick
// TODO: do not forget to call ObstacleManager::attachGoodScoreHandler with the following callback:
// scorePop[scorePop.length] = new scorePopProto(scoreIncrement);
// score += scoreIncrement;
// scoreIncrement++;
// maybe also pass the softozor's position in the event posting
// TODO: do not forget to call ObstacleManager::attachBadScoreHandler with the following callback:
// scorePop[scorePop.length] = new scorePopProto('xxx');
// scoreIncrement = 1;
// TODO: connect Canvas::upHandler with softozor.stopFlap();
// TODO: connect Canvas::downHandler with softozor.startFlap();
// TODO: connect Canvas::mouseEnterHandler with GameManager::run();
// TODO: connect Canvas::mouseLeaveHandler with GameManager::pause();
// TODO: don't forget to display the restart button when the game is over!
// TODO: implement state pattern for paused / running

export default class GameManager {
  constructor() {
    CoordinatesAdapter.setCanvas(this.m_Canvas);
    CoordinatesAdapter.setMovingObject(this.m_Softozor);
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

  /**
   * game frame function
   */
  private tick(): void {
    this.m_Softozor.tick();
    this.m_ParallaxMgr.tick();
    let softozorPos: Vector2D = new Vector2D(
      this.m_Softozor.position.xObsPX(),
      this.m_Softozor.position.yObsPX()
    );
    this.m_ScoreMgr.tick(softozorPos);
    this.m_ObstacleMgr.tick();
  }

  /**
   * private members
   */
  private readonly m_Canvas: Canvas = new Canvas();
  private readonly m_Softozor: Softozor = new Softozor(this.m_Canvas);
  private readonly m_ObstacleMgr: ObstacleManager = new ObstacleManager(
    this.m_Canvas,
    softozorData.startPosition,
    (worldBandRatioToBanner - 1 + worldDistanceFactor) *
      100 /
      worldBandRatioToBanner,
    // see bandProto::refreshSize; indeed, the method ObstacleManager::fillWorldSquare bases on band[worldBandIndex].spriteRenderer.heightW
    // and band[0] = new bandProto(spriteList.world, worldDistanceFactor);
    // which means that the bandProto::refreshSize always end up with the same this.spriteRenderer.heightW value, which turns to be 100
    this.m_Softozor
  );
  private readonly m_World: World;
  private readonly m_ParallaxMgr: ParallaxManager = new ParallaxManager(
    this.m_Canvas
  );
  private readonly m_ScoreMgr: ScoreManager = new ScoreManager(this.m_Canvas);
}
