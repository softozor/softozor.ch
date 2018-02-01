import { find } from 'lodash';

import * as CONFIG from '../../../config/game/GameStopped.json';

import * as GAME_STOPPED_IMG from '../../../assets/banner/gameStopped.png';
import * as GAME_STOPPED_SHADOW_IMG from '../../../assets/banner/gameStopped_shadow.png';
import * as GAME_STOPPED_BACKGROUND_IMG from '../../../assets/banner/gameStopped_background.png';

import SpriteRenderer from './SpriteRenderer';
import Sprite from './Sprite';
import Canvas from '../Canvas/Canvas';
import SpriteListLoader, {
  SpriteList,
  DistantImgList,
  DistantSprite
} from './SpriteListLoader';

export default class GameStoppedRenderer extends SpriteRenderer {
  constructor(canvas: Canvas) {
    super(canvas);
    const loader: SpriteListLoader = new SpriteListLoader(
      images(),
      this.onSpritesLoaded.bind(this)
    );
  }

  /**
   * Public methods
   */
  // TODO: call <==> banner.playState === 'paused'
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

  private getSprite(sprites: SpriteList, imgSrc: string): Sprite {
    return find(
      sprites,
      (element: DistantSprite): Boolean => element.sprite.img.src === imgSrc
    ).sprite;
  }

  private onSpritesLoaded(sprites: SpriteList): void {
    console.log('List of sprites loaded!');
    this.m_Sprites.stopped = this.getSprite(sprites, GAME_STOPPED_IMG);
    this.m_Sprites.background = this.getSprite(
      sprites,
      GAME_STOPPED_BACKGROUND_IMG
    );
    this.m_Sprites.shadow = this.getSprite(sprites, GAME_STOPPED_SHADOW_IMG);
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
  private m_Sprites: {
    stopped: Sprite;
    background: Sprite;
    shadow: Sprite;
  };
}

/**
 * Non-member methods
 */
/**
 * Non-member methods
 */
function images(): DistantImgList {
  return [
    { imgSrc: GAME_STOPPED_IMG, distanceFactor: 1 },
    { imgSrc: GAME_STOPPED_BACKGROUND_IMG, distanceFactor: 1 },
    { imgSrc: GAME_STOPPED_SHADOW_IMG, distanceFactor: 1 }
  ];
}
