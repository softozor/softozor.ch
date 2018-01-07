import SpriteRenderer from './SpriteRenderer';
import Sprite from './Sprite';
import Canvas from '../Canvas';

import GAME_STOPPED_IMG from '../../../assets/banner/gameStopped.png';
import GAME_STOPPED_SHADOW_IMG from '../../../assets/banner/gameStopped_shadow.png';
import GAME_STOPPED_BACKGROUND_IMG from '../../../assets/banner/gameStopped_background.png';

export default class GameStoppedRenderer extends SpriteRenderer {
  constructor(canvas: Canvas) {
    super(canvas);
    this.m_Sprites = {
      stopped: new Sprite(GAME_STOPPED_IMG),
      shadow: new Sprite(GAME_STOPPED_SHADOW_IMG),
      background: new Sprite(GAME_STOPPED_BACKGROUND_IMG)
    };
  }

  /**
   * Public methods
   */
  // TODO: this method MUST be called when the game is being initialized
  public onCanvasResized(width: number, height: number): void {
    this.swidth = this.m_Sprites.stopped.img.naturalWidth;
    this.sheight = this.m_Sprites.stopped.img.naturalHeight;

    if (
      this.swidth / this.sheight <=
      this.m_Canvas.widthPX /
        (this.m_Canvas.heightPX * GameStoppedRenderer.HEIGHT_RATIO)
    ) {
      this.y =
        this.m_Canvas.heightPX * (1 - GameStoppedRenderer.HEIGHT_RATIO) / 2;
      this.height = this.m_Canvas.heightPX * GameStoppedRenderer.HEIGHT_RATIO;
      this.width = this.height * this.swidth / this.sheight;
      this.x = (this.m_Canvas.widthPX - this.width) / 2;
    } else {
      this.x = 0;
      this.width = this.m_Canvas.widthPX;
      this.height = this.width * this.sheight / this.swidth;
      this.y = (this.m_Canvas.heightPX - this.height) / 2;
    }
  }

  // TODO: call <==> banner.playState === 'paused'
  public draw(): void {
    this.drawStoppedSprite();
    this.drawBackgroundSprite();
    this.drawShadowSprite();
  }

  /**
   * Private methods
   */
  private drawStoppedSprite(): void {
    // make hole in canvas
    this.m_Canvas.ctx.globalCompositeOperation = 'destination-out';
    this.m_Canvas.ctx.drawImage(
      this.m_Sprites.stopped.img,
      0,
      0,
      this.swidth,
      this.sheight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  private drawBackgroundSprite(): void {
    this.m_Canvas.ctx.globalCompositeOperation = 'destination-over';
    this.m_Canvas.ctx.drawImage(
      this.m_Sprites.background.img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  private drawShadowSprite(): void {
    this.m_Canvas.ctx.globalCompositeOperation = 'source-over';
    this.m_Canvas.ctx.drawImage(
      this.m_Sprites.shadow.img,
      this.sx,
      this.sy,
      this.swidth,
      this.sheight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  /**
   * Private getters / setters
   */
  private get swidth(): number {
    return this.m_SWidth;
  }

  private get sheight(): number {
    return this.m_SHeight;
  }

  private get sx(): number {
    return this.m_Sx;
  }

  private get sy(): number {
    return this.m_Sy;
  }

  private get x(): number {
    return this.m_X;
  }

  private get y(): number {
    return this.m_Y;
  }

  private set swidth(value: number) {
    this.m_SWidth = value;
  }

  private set sheight(value: number) {
    this.m_SHeight = value;
  }

  private set sx(value: number) {
    this.m_Sx = value;
  }

  private set sy(value: number) {
    this.m_Sy = value;
  }

  private set x(value: number) {
    this.m_X = value;
  }

  private set y(value: number) {
    this.m_Y = value;
  }

  /**
   * Private members
   */
  private static HEIGHT_RATIO: number = 0.6;

  private m_Sx: number = 0;
  private m_Sy: number = 0;
  private m_SWidth: number = 0;
  private m_SHeight: number = 0;
  private m_X: number = 0;
  private m_Y: number = 0;

  private m_Sprites: { stopped: Sprite; background: Sprite; shadow: Sprite };
}
