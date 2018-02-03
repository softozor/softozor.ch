import * as CONFIG from '../../config/game/GameManager.json';

import * as MovingCoordinateSystem from './Math/MovingCoordinateSystem';
import Canvas from './Canvas/Canvas';
import Softozor from './Softozor/Softozor';
import ParallaxManager from './Parallax/ParallaxManager';
import Banner from './Banner/Banner';
import ScoreManager from './ScoreManager/ScoreManager';

// import * as Helpers from './Helpers';
// import Vector2D from './Math/Vector2D';
// import ObstacleManager from './Obstacles/ObstacleManager';

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
// TODO: don't forget to load the GameStoppedRenderer (and to refresh it upon canvas resizing!)
// TODO: attach functionality to the restart and play buttons!

export default class GameManager {
  constructor() {
    this.init();
  }

  /**
   * private methods
   */
  private connectResizeEvents(): void {
    this.m_Canvas.clearResizeEvents(); // removes all current references to existing objects
    this.m_Canvas.attachResizeEvent(
      this.m_ParallaxMgr.render.bind(this.m_ParallaxMgr)
    );
    // this.m_Canvas.attachResizeEvent(
    //   this.m_ObstacleMgr.render.bind(this.m_ObstacleMgr)
    // );
    this.m_Canvas.attachResizeEvent(
      this.m_Softozor.render.bind(this.m_Softozor)
    );
    this.m_Canvas.attachResizeEvent(
      this.m_ScoreMgr.render.bind(this.m_ScoreMgr)
    );
    this.m_Canvas.attachResizeEvent(this.m_Banner.render.bind(this.m_Banner));
    this.m_Canvas.attachResizeEvent(this.m_Canvas.render.bind(this.m_Canvas));
  }

  private init(): void {
    MovingCoordinateSystem.setCanvas(this.m_Canvas);
    this.m_Softozor = new Softozor(this.m_Canvas);
    // this.m_ObstacleMgr.clear();
    this.m_ScoreMgr.clear();
    this.setMovingObject(this.m_Softozor);

    this.connectResizeEvents();
  }

  /**
   * This method needs to replace the reference to the Softozor object EVERYWHERE!
   */
  private setMovingObject(movingObject: Softozor): void {
    MovingCoordinateSystem.setMovingObject(movingObject);
  }

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

  /**
   * game frame function
   */
  private tick(): void {
    // The order here is very important! there is no z-index in an HTML5 canvas!
    // this.m_ParallaxMgr.tick();
    // this.m_Softozor.tick();
    // this.m_ObstacleMgr.tick();
    // this.m_ScoreMgr.tick();
    // TODO: render the gamestopped stuff
    this.m_Canvas.tick();
  }

  /**
   * private members
   */
  private readonly m_Canvas: Canvas = new Canvas();
  private m_Softozor: Softozor;
  private readonly m_ParallaxMgr: ParallaxManager = new ParallaxManager(
    this.m_Canvas
  );
  // private readonly m_ObstacleMgr: ObstacleManager = new ObstacleManager(
  //   this.m_Canvas
  // );
  private readonly m_ScoreMgr: ScoreManager = new ScoreManager(this.m_Canvas);
  private readonly m_Banner: Banner = new Banner(this.m_Canvas);

  private m_TickHandle: number;
  private m_TickInterval: number = (<any>CONFIG).tickIntervalInMs;
}
