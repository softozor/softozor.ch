import SpriteRenderer from './SpriteRenderer';
import Sprite from './Sprite';
import Canvas from '../Canvas';

import GAME_STOPPED_IMG from '../../../assets/banner/gameStopped.png';
import GAME_STOPPED_SHADOW_IMG from '../../../assets/banner/gameStopped_shadow.png';
import GAME_STOPPED_BACKGROUND_IMG from '../../../assets/banner/gameStopped_background.png';

export default class GameStoppedRenderer extends SpriteRenderer {
  constructor(canvas: Canvas) {
    super(canvas);
  }

  /**
   * Public methods
   */
  // TODO: call <==> banner.playState === 'paused'
  public draw(): void {
    this.drawStoppedSprite();
    this.drawBackgroundSprite();
    this.drawShadowSprite();
  }

  /**
   * Protected methods
   */
  protected get height(): number {
    return this.isSmallAspectRatio
      ? this.m_Canvas.heightPX * GameStoppedRenderer.HEIGHT_RATIO
      : this.width * this.sheight / this.swidth;
  }

  protected get width(): number {
    return this.isSmallAspectRatio
      ? this.height * this.swidth / this.sheight
      : this.m_Canvas.widthPX;
  }

  /**
   * Private methods
   */
  private get isSmallAspectRatio(): Boolean {
    return (
      this.swidth / this.sheight <=
      this.m_Canvas.widthPX /
        (this.m_Canvas.heightPX * GameStoppedRenderer.HEIGHT_RATIO)
    );
  }

  private get swidth(): number {
    return GameStoppedRenderer.SPRITES.stopped.naturalWidth;
  }

  private get sheight(): number {
    return GameStoppedRenderer.SPRITES.stopped.naturalHeight;
  }

  private get sx(): number {
    return 0;
  }

  private get sy(): number {
    return 0;
  }

  private get x(): number {
    return this.isSmallAspectRatio
      ? (this.m_Canvas.widthPX - this.width) / 2
      : 0;
  }

  private get y(): number {
    return this.isSmallAspectRatio
      ? this.m_Canvas.heightPX * (1 - GameStoppedRenderer.HEIGHT_RATIO) / 2
      : (this.m_Canvas.heightPX - this.height) / 2;
  }

  private drawStoppedSprite(): void {
    // make hole in canvas
    this.m_Canvas.ctx.globalCompositeOperation = 'destination-out';
    this.m_Canvas.ctx.drawImage(
      GameStoppedRenderer.SPRITES.stopped.img,
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
      GameStoppedRenderer.SPRITES.background.img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  private drawShadowSprite(): void {
    this.m_Canvas.ctx.globalCompositeOperation = 'source-over';
    this.m_Canvas.ctx.drawImage(
      GameStoppedRenderer.SPRITES.shadow.img,
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
   * Private members
   */
  private static HEIGHT_RATIO: number = 0.6;
  private static SPRITES: {
    stopped: Sprite;
    background: Sprite;
    shadow: Sprite;
  } = {
    stopped: new Sprite(GAME_STOPPED_IMG),
    background: new Sprite(GAME_STOPPED_BACKGROUND_IMG),
    shadow: new Sprite(GAME_STOPPED_SHADOW_IMG)
  };
}
