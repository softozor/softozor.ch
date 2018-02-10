import { forEach } from 'lodash';

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
import GameOverState from './GameStates/GameOverState';

// TODO: publish the score
// axios
//   .post(`${this.SERVER}/PublishScore/`, {
//     username: 'comteharbour',
//     score: '1'
//   })
//   .then(res =>
//     console.log('Score published with success: ' + JSON.stringify(res))
//   )
//   .catch((err: string): void => this.onFormSubmitFailure(err));

export default class GameManager {
  constructor() {
    this.init();
    this.load();
    this.setupStates();
    this.setupScoring();
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

  private setupScoring(): void {
    this.m_ObstacleMgr.attachBadScoreHandler(
      this.m_ScoreMgr.addBadScore.bind(this.m_ScoreMgr)
    );
    this.m_ObstacleMgr.attachGoodScoreHandler(
      this.m_ScoreMgr.addGoodScore.bind(this.m_ScoreMgr)
    );
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
    this.connectMouseEvents();
    this.m_Softozor.reset();
    this.m_ObstacleMgr.clear();
    this.m_ObstacleMgr.setGameOnState();
    this.m_ScoreMgr.clear();
    this.setMovingObject(this.m_Softozor);
    this.m_Canvas.clearEvents();
    this.connectResizeEvents();
  }

  private setMovingObject(movingObject: Softozor): void {
    MovingCoordinateSystem.setMovingObject(movingObject);
  }

  private connectState(state: GameState): void {
    state.attachStartTickHandler(this.startTick.bind(this));
    state.attachStopTickHandler(this.stopTick.bind(this));
    state.attachSetPlayStateHandler(this.setPlayState.bind(this));
    state.attachSetPauseStateHandler(this.setPauseState.bind(this));
    state.attachHideBannerHandler(this.hideBanner.bind(this));
    state.attachShowBannerHandler(this.showBanner.bind(this));
    state.attachClearGameHandler(this.clearGame.bind(this));
  }

  private setupStates(): void {
    forEach(this.m_States, this.connectState.bind(this));
  }

  private onComponentsReady(): void {
    // The order here is very important! there is no z-index in an HTML5 canvas!
    this.m_ParallaxMgr.render();
    this.m_Softozor.hide();
    this.m_ObstacleMgr.render();
    this.m_ScoreMgr.hide();
    this.m_Banner.show();
    this.m_Canvas.render();

    this.connectButtonEvents();
  }

  private hideBanner(): void {
    // The order here is very important! there is no z-index in an HTML5 canvas!
    this.m_ParallaxMgr.render();
    this.m_Softozor.show();
    this.m_ObstacleMgr.render();
    this.m_ScoreMgr.show();
    this.m_Banner.hide();
    this.m_Canvas.render();
  }

  private showBanner(): void {
    // The order here is very important! there is no z-index in an HTML5 canvas!
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
    this.init();
    this.m_Canvas.hideRestartButton();
    this.m_Softozor.show();
    this.setPlayState();
  }

  private onUpPress(): void {
    this.m_Softozor.stopFlap();
  }

  private onDownPress(): void {
    this.m_Softozor.startFlap();
  }

  private onCanvasEnter(): void {
    this.setPlayState();
  }

  private onCanvasLeave(): void {
    this.setPauseState();
  }

  private startTick(): void {
    clearInterval(this.m_TickHandle);
    this.m_TickHandle = setInterval(this.tick.bind(this), this.m_TickInterval);
  }

  private stopTick(): void {
    clearInterval(this.m_TickHandle);
  }

  private clearGame(): void {
    this.m_ObstacleMgr.setGameOverState();
    this.m_Canvas.showRestartButton();
    this.m_Softozor.hide();
  }

  private tick(): void {
    // The order here is very important! there is no z-index in an HTML5 canvas!
    this.m_ParallaxMgr.tick();
    this.m_Softozor.tick();
    this.m_ObstacleMgr.tick();
    this.m_ScoreMgr.tick();
    this.m_Canvas.tick();

    if (this.m_Softozor.isOutOfBounds) {
      this.setGameOverState();
    }
  }

  private switchState(target: GameState): void {
    if (target === this.m_CurrentState) {
      return;
    }
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

  private setGameOverState(): void {
    this.switchState(this.m_States.gameOver);
  }

  /**
   * private members
   */
  private readonly m_Loader: BannerLoader = new BannerLoader();
  private readonly m_Canvas: Canvas = new Canvas();
  private m_Softozor: Softozor = new Softozor(this.m_Canvas);
  private readonly m_ParallaxMgr: ParallaxManager = new ParallaxManager(
    this.m_Canvas
  );
  private readonly m_ObstacleMgr: ObstacleManager = new ObstacleManager(
    this.m_Canvas
  );
  private readonly m_ScoreMgr: ScoreManager = new ScoreManager(this.m_Canvas);
  private readonly m_Banner: Banner = new Banner(this.m_Canvas);

  private m_TickHandle: number = 0;
  private m_TickInterval: number = (<any>CONFIG).tickIntervalInMs;

  private m_States: { [key: string]: GameState } = {
    play: new PlayState(),
    pause: new PauseState(),
    gameOver: new GameOverState()
  };
  private m_CurrentState: GameState = this.m_States.pause;
}
