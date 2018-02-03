import * as CONFIG from '../../../config/banner/Renderer.json';

import SpriteRenderer from '../Rendering/SpriteRenderer';
import Sprite from '../Rendering/Sprite';
import Canvas from '../Canvas/Canvas';

export type BannerSprites = {
  stopped: Sprite;
  background: Sprite;
  shadow: Sprite;
};

export default class GameStoppedRenderer extends SpriteRenderer {
  constructor(canvas: Canvas, private readonly m_Sprites: BannerSprites) {
    super(canvas);
  }

  /**
   * Public methods
   */
  public draw(alpha: number): void {
    this.drawStoppedSprite(alpha);
    this.drawBackgroundSprite(alpha);
    this.drawShadowSprite(alpha);
  }

  /**
   * Protected methods
   */
  protected get height(): number {
    return this.isSmallAspectRatio
      ? this.m_Canvas.height * (<any>CONFIG).heightRatio
      : this.width * this.sheight / this.swidth;
  }

  protected get width(): number {
    return this.isSmallAspectRatio
      ? this.height * this.swidth / this.sheight
      : this.m_Canvas.width;
  }

  /**
   * Private methods
   */
  private get isSmallAspectRatio(): Boolean {
    return (
      this.swidth / this.sheight <=
      this.m_Canvas.width / (this.m_Canvas.height * (<any>CONFIG).heightRatio)
    );
  }

  private get swidth(): number {
    return this.m_Sprites.stopped.naturalWidth;
  }

  private get sheight(): number {
    return this.m_Sprites.stopped.naturalHeight;
  }

  private get sx(): number {
    return 0;
  }

  private get sy(): number {
    return 0;
  }

  private get x(): number {
    return this.isSmallAspectRatio ? (this.m_Canvas.width - this.width) / 2 : 0;
  }

  private get y(): number {
    return this.isSmallAspectRatio
      ? this.m_Canvas.height * (1 - (<any>CONFIG).heightRatio) / 2
      : (this.m_Canvas.height - this.height) / 2;
  }

  private drawStoppedSprite(alpha: number): void {
    // make hole in canvas
    this.m_Canvas.context.globalAlpha = alpha;
    this.m_Canvas.context.globalCompositeOperation = 'destination-out';
    this.m_Canvas.context.drawImage(
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

  private drawBackgroundSprite(alpha: number): void {
    this.m_Canvas.context.globalAlpha = alpha;
    this.m_Canvas.context.globalCompositeOperation = 'destination-over';
    this.m_Canvas.context.drawImage(
      this.m_Sprites.background.img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  private drawShadowSprite(alpha: number): void {
    this.m_Canvas.context.globalAlpha = alpha;
    this.m_Canvas.context.globalCompositeOperation = 'source-over';
    this.m_Canvas.context.drawImage(
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
   * Private members
   */
}
