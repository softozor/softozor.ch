import * as CONFIG from '../../config/game/GameManager.json';

import * as MovingCoordinateSystem from './Math/MovingCoordinateSystem';
import Canvas from './Canvas/Canvas';
import Softozor from './Softozor/Softozor';
import ParallaxManager from './Parallax/ParallaxManager';
import Banner from './Banner/Banner';
import ScoreManager from './ScoreManager/ScoreManager';
import ObstacleManager from './Obstacles/ObstacleManager';
import BannerLoader from './BannerLoader';
import GameState from './GameStates/GameState';
import PlayState from './GameStates/PlayState';
import PauseState from './GameStates/PauseState';

// import * as Helpers from './Helpers';
// import Vector2D from './Math/Vector2D';

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
    this.load();
    this.setupStates();
  }

  /**
   * Private methods
   */
  private connectButtonEvents(): void {
    this.m_Canvas.playClickHandler = this.onPlayClick.bind(this);
    this.m_Canvas.restartClickHandler = this.onRestartClick.bind(this);
  }

  private connectMouseEvents(): void {
    this.m_Canvas.upHandler = this.onUpPress.bind(this);
    this.m_Canvas.downHandler = this.onDownPress.bind(this);
    this.m_Canvas.mouseEnterHandler = this.onCanvasEnter.bind(this);
    this.m_Canvas.mouseLeaveHandler = this.onCanvasLeave.bind(this);
  }

  private connectResizeEvents(): void {
    this.m_Canvas.attachResizeEvent(
      this.m_ParallaxMgr.render.bind(this.m_ParallaxMgr)
    );
    this.m_Canvas.attachResizeEvent(
      this.m_ObstacleMgr.render.bind(this.m_ObstacleMgr)
    );
    this.m_Canvas.attachResizeEvent(
      this.m_Softozor.render.bind(this.m_Softozor)
    );
    this.m_Canvas.attachResizeEvent(
      this.m_ScoreMgr.render.bind(this.m_ScoreMgr)
    );
    this.m_Canvas.attachResizeEvent(this.m_Banner.render.bind(this.m_Banner));
    this.m_Canvas.attachResizeEvent(this.m_Canvas.render.bind(this.m_Canvas));
  }

  private load(): void {
    this.m_Loader.attachReadyEvent(this.onComponentsReady.bind(this));
    this.m_ParallaxMgr.attachLoader(this.m_Loader);
    this.m_ParallaxMgr.load();
    this.m_Banner.attachLoader(this.m_Loader);
    this.m_Banner.load();
    this.m_Canvas.attachLoader(this.m_Loader);
    this.m_Canvas.load();
  }

  private init(): void {
    MovingCoordinateSystem.setCanvas(this.m_Canvas);
    this.m_Softozor = new Softozor(this.m_Canvas);
    this.connectMouseEvents();
    this.m_ObstacleMgr.clear();
    this.m_ScoreMgr.clear();
    this.setMovingObject(this.m_Softozor);
    this.m_Canvas.clearEvents();
    this.connectResizeEvents();
  }

  private setMovingObject(movingObject: Softozor): void {
    MovingCoordinateSystem.setMovingObject(movingObject);
  }

  private setupStates(): void {
    this.m_States.play.attachStartTickHandler(this.startTick.bind(this));
    this.m_States.play.attachStopTickHandler(this.stopTick.bind(this));
    this.m_States.play.attachSetPlayStateHandler(this.setPlayState.bind(this));
    this.m_States.play.attachSetPauseStateHandler(
      this.setPauseState.bind(this)
    );
    this.m_States.play.attachHideBannerHandler(this.hideBanner.bind(this));
    this.m_States.play.attachShowBannerHandler(this.showBanner.bind(this));
    this.m_States.pause.attachStartTickHandler(this.startTick.bind(this));
    this.m_States.pause.attachStopTickHandler(this.stopTick.bind(this));
    this.m_States.pause.attachSetPlayStateHandler(this.setPlayState.bind(this));
    this.m_States.pause.attachSetPauseStateHandler(
      this.setPauseState.bind(this)
    );
    this.m_States.pause.attachHideBannerHandler(this.hideBanner.bind(this));
    this.m_States.pause.attachShowBannerHandler(this.showBanner.bind(this));
  }

  private onComponentsReady(): void {
    this.m_ParallaxMgr.render();
    this.m_Softozor.hide();
    this.m_ObstacleMgr.render();
    this.m_ScoreMgr.hide();
    this.m_Banner.show();
    this.m_Canvas.render();

    this.connectButtonEvents();
  }

  private hideBanner(): void {
    this.m_ParallaxMgr.render();
    this.m_Softozor.show();
    this.m_ObstacleMgr.render();
    this.m_ScoreMgr.show();
    this.m_Banner.hide();
    this.m_Canvas.render();
  }

  private showBanner(): void {
    this.m_ParallaxMgr.render();
    this.m_Softozor.hide();
    this.m_ScoreMgr.hide();
    this.m_Banner.show();
    this.m_Canvas.render();
  }

  private onPlayClick(): void {
    this.m_CurrentState.onPlayClick();
  }

  private onRestartClick(): void {
    console.log('Restart!');
  }

  private onUpPress(): void {
    this.m_Softozor.stopFlap();
  }

  private onDownPress(): void {
    this.m_Softozor.startFlap();
  }

  private onCanvasEnter(): void {
    console.log('Entered canvas!');
  }

  private onCanvasLeave(): void {
    console.log('Left canvas!');
  }

  private startTick(): void {
    clearInterval(this.m_TickHandle);
    this.m_TickHandle = setInterval(this.tick.bind(this), this.m_TickInterval);
  }

  private stopTick(): void {
    clearInterval(this.m_TickHandle);
  }

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

  private tick(): void {
    console.log('tick');
    // The order here is very important! there is no z-index in an HTML5 canvas!
    this.m_ParallaxMgr.tick();
    this.m_Softozor.tick();
    this.m_ObstacleMgr.tick();
    this.m_ScoreMgr.tick();
    this.m_Canvas.tick();
  }

  private switchState(target: GameState): void {
    this.m_CurrentState.exit();
    this.m_CurrentState = target;
    this.m_CurrentState.enter();
  }

  private setPauseState(): void {
    this.switchState(this.m_States.pause);
  }

  private setPlayState(): void {
    this.switchState(this.m_States.play);
  }

  /**
   * private members
   */
  private readonly m_Loader: BannerLoader = new BannerLoader();
  private readonly m_Canvas: Canvas = new Canvas();
  private m_Softozor: Softozor;
  private readonly m_ParallaxMgr: ParallaxManager = new ParallaxManager(
    this.m_Canvas
  );
  private readonly m_ObstacleMgr: ObstacleManager = new ObstacleManager(
    this.m_Canvas
  );
  private readonly m_ScoreMgr: ScoreManager = new ScoreManager(this.m_Canvas);
  private readonly m_Banner: Banner = new Banner(this.m_Canvas);

  private m_TickHandle: number;
  private m_TickInterval: number = (<any>CONFIG).tickIntervalInMs;

  private m_States: { [key: string]: GameState } = {
    play: new PlayState(),
    pause: new PauseState()
  };
  private m_CurrentState: GameState = this.m_States.pause;
}
