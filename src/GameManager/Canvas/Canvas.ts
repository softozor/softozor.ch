import { values, filter } from 'lodash';

import Button, { ClickHandlerCallback } from './Button';
import PlayButton from './PlayButton';
import RestartButton from './RestartButton';

type T_ButtonMap = { [key: string]: Button };

enum KEY {
  e_ESC = 27,
  e_SPACE = 32
}

// TODO: don't forget to show the playButton / restartButton
export default class Canvas {
  constructor() {
    this.connectMouseEvents();
    this.connectKeyboardEvents();
  }

  /**
   * Public methods
   */
  public get context(): CanvasRenderingContext2D {
    return this.m_CanvasElement.getContext('2d');
  }

  public set playClickHandler(value: ClickHandlerCallback) {
    this.m_Buttons.play.clickHandler = value;
  }

  public set restartClickHandler(value: ClickHandlerCallback) {
    this.m_Buttons.restart.clickHandler = value;
  }

  public set upHandler(value: ClickHandlerCallback) {
    this.m_UpHandler = value;
  }

  public set downHandler(value: ClickHandlerCallback) {
    this.m_DownHandler = value;
  }

  public set mouseEnterHandler(value: ClickHandlerCallback) {
    this.m_MouseEnterHandler = value;
  }

  public set mouseLeaveHandler(value: ClickHandlerCallback) {
    this.m_MouseLeaveHandler = value;
  }

  /**
   * Private methods
   */
  private connectMouseEvents(): void {
    this.m_CanvasElement.onmousedown = this.handleMouseDown.bind(this);
    this.m_CanvasElement.onmouseup = this.handleMouseUp.bind(this);
    this.m_CanvasElement.ontouchstart = this.handleMouseDown.bind(this);
    this.m_CanvasElement.ontouchend = this.handleMouseUp.bind(this);
    this.m_CanvasElement.onmouseenter = this.m_MouseEnterHandler;
    this.m_CanvasElement.onmouseleave = this.m_MouseLeaveHandler;
  }

  private connectKeyboardEvents(): void {
    document.onkeydown = this.handleKeyDown.bind(this);
    document.onkeyup = this.handleKeyUp.bind(this);
  }

  private getClickedObject(event: MouseEvent): Button | undefined {
    let buttons: Button[] = values(this.m_Buttons);
    let clickedBtns: Button[] = filter(buttons, (elem: Button): Boolean =>
      elem.hasMouse(event)
    );
    return clickedBtns.length === 1 ? clickedBtns.pop() : undefined;
  }

  private handleMouseDown(event: MouseEvent): void {
    let btn: Button | undefined = this.getClickedObject(event);
    if (btn === undefined) {
      this.m_DownHandler();
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    let btn: Button | undefined = this.getClickedObject(event);
    if (btn !== undefined) {
      btn.click();
    } else {
      this.m_UpHandler();
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {
    case KEY.e_SPACE:
      this.m_DownHandler();
      break;
    case KEY.e_ESC:
      this.m_Buttons.play.click();
    default:
      break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    switch (event.keyCode) {
    case KEY.e_SPACE:
      this.m_UpHandler();
      break;
    default:
      break;
    }
  }

  /*reInitialize: function() {
    this.gameState = 'on';
    this.gameEndingTransition = 1;
    obstacle = [];
    scorePop = [];
    scrollingPosition.xW = softozorData.startPosition;
    softozor.position.yW =
      softozorData.originalYW - softozorData.heightW * worldBandRatioToBanner;
    softozor.updatePosition();
    softozor.ySpeed = softozorData.minSpeed;
    softozor.deltaXW = softozorData.originalDeltaXW;
    softozor.flapWait = 0;
    softozor.deltaXSpeed = 0;
    lastFilledSquareXW = firstFilledSquareDistance + softozorData.startPosition;
    score = 0;
    scoreIncrement = 1;
  },

  restart: function() {
    this.gameState = 'restarting';
    obstacle = [];
    scorePop = [];
    this.restartScore = score;
    this.restartScrollingXW = scrollingPosition.xW;
    this.restartSoftozorDeltaXW = softozor.deltaXW;
    this.restartSoftozorYW = softozor.position.yW;
    softozor.flapWait = 0;
    softozor.deltaXSpeed = 0;
    lastFilledSquareXW = firstFilledSquareDistance + softozorData.startPosition;
    score = 0;
    scoreIncrement = 1;
  },

  refreshSize: function() {
    this.widthPX = $('#banner').width();
    this.heightPX = $('#banner').height();
    this.canvas.width = this.widthPX;
    this.canvas.height = this.heightPX;
  },

  // run the game
  run: function() {
    clearInterval(banner.runSpeed);
    banner.runSpeed = setInterval(update, this.frameTime);
    this.playState = 'starting';
  },

  // stop the game
  pause: function() {
    this.playState = 'pausing';
  },

  // transition between game started and game stopped
  transitionUpdate: function() {
    if (this.playState === 'paused') {
    } else if (this.playState === 'pausing') {
      if (this.stateTransition > 0)
        this.stateTransition = Math.max(0, this.stateTransition - 0.03);
      else {
        this.playState = 'paused';
        clearInterval(banner.runSpeed);
      }
    } else if (this.playState === 'running') {
    } else if (this.playState === 'starting') {
      if (this.stateTransition < 1)
        this.stateTransition = Math.min(1, this.stateTransition + 0.03);
      else this.playState = 'running';
    }

    if (this.gameState === 'over' && this.gameEndingTransition > 0) {
      this.gameEndingTransition = Math.max(this.gameEndingTransition - 0.02, 0);
    }

    if (this.gameState === 'restarting') {
      if (this.gameEndingTransition < 1) {
        this.gameEndingTransition = Math.min(
          this.gameEndingTransition + 0.01,
          1
        );
        score = Math.round(this.restartScore * (1 - this.gameEndingTransition));
        scrollingPosition.xW =
          (softozorData.startPosition - this.restartScrollingXW) *
            this.gameEndingTransition +
          this.restartScrollingXW;
        softozor.deltaXW =
          (softozorData.originalDeltaXW - this.restartSoftozorDeltaXW) *
            this.gameEndingTransition +
          this.restartSoftozorDeltaXW;
        softozor.position.yW =
          (softozorData.originalYW -
            softozorData.heightW * worldBandRatioToBanner -
            this.restartSoftozorYW) *
            this.gameEndingTransition +
          this.restartSoftozorYW;
        softozor.updatePosition();
      } else {
        this.gameState = 'on';
        banner.reInitialize();
      }
    }
  }*/

  /**
   * Private members
   */
  private m_CanvasElement: HTMLCanvasElement = getCanvasElement();

  private m_TickHandle: number;
  private m_TickInterval: number = 20; // TODO: put this in a config file!

  private m_Buttons: T_ButtonMap = {
    play: new PlayButton(this),
    restart: new RestartButton(this)
  };

  private m_UpHandler: ClickHandlerCallback;
  private m_DownHandler: ClickHandlerCallback;
  private m_MouseEnterHandler: ClickHandlerCallback;
  private m_MouseLeaveHandler: ClickHandlerCallback;
}

/**
 * Non-member methods
 */
function getCanvasElement(): HTMLCanvasElement {
  return <HTMLCanvasElement>$('#banner > canvas')[0];
}
