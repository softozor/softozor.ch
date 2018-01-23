import { values, filter, forEach } from 'lodash';

import Button, { ClickHandlerCallback } from './Button';
import PlayButton from './PlayButton';
import RestartButton from './RestartButton';

type T_ButtonMap = { [key: string]: Button };

enum KEY {
  e_ESC = 27,
  e_SPACE = 32
}

export default class Canvas {
  constructor() {
    this.connectMouseEvents();
    this.connectKeyboardEvents();
    this.connectResizeEvent();
    this.setupButtons();
  }

  /**
   * Public methods
   */
  public get context(): CanvasRenderingContext2D {
    return this.m_RenderingContext;
  }

  public get width(): number {
    return this.canvas.width;
  }

  public get height(): number {
    return this.canvas.height;
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

  public showRestartButton(): void {
    this.m_Buttons.restart.show();
  }

  public hideRestartButton(): void {
    this.m_Buttons.restart.hide();
  }

  /**
   * Private methods
   */
  private get canvas(): HTMLCanvasElement {
    return this.context.canvas;
  }

  private connectMouseEvents(): void {
    this.canvas.onmousedown = this.handleMouseDown.bind(this);
    this.canvas.onmouseup = this.handleMouseUp.bind(this);
    this.canvas.ontouchstart = this.handleMouseDown.bind(this);
    this.canvas.ontouchend = this.handleMouseUp.bind(this);
    this.canvas.onmouseenter = this.m_MouseEnterHandler;
    this.canvas.onmouseleave = this.m_MouseLeaveHandler;
  }

  private connectKeyboardEvents(): void {
    document.onkeydown = this.handleKeyDown.bind(this);
    document.onkeyup = this.handleKeyUp.bind(this);
  }

  private resizeCanvasElement(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private renderButtons(): void {
    forEach(this.m_Buttons, (value: Button): void => value.draw());
  }

  private resizeToWindow(): void {
    this.resizeCanvasElement();
    this.renderButtons();
    // TODO: in this class we probably need a VoidSyncEvent which we can attach resize events to (from objects that have a reference to the Canvas)
    // then, here, we would then call this.m_ResizeEvents.post() which then will trigger all the attached events
    // each object having a reference to the canvas should call Canvas::attachResizeHandler
    // In that case, we can remove the call to this.renderButtons(), as the buttons all have a reference to the Canvas!
  }

  private connectResizeEvent(): void {
    $(window).resize(this.resizeToWindow.bind(this));
  }

  private setupButtons(): void {
    this.m_Buttons.play.show();
    this.m_Buttons.restart.hide();
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

  /**
   * Private members
   */
  private m_RenderingContext: CanvasRenderingContext2D = getRenderingContext();

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
function getRenderingContext(): CanvasRenderingContext2D {
  return (<HTMLCanvasElement>$('#banner > canvas')[0]).getContext('2d');
}
