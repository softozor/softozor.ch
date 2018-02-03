import { VoidSyncEvent } from 'ts-events';

import * as BANNER_IMG from '../../../assets/banner/gameStopped.png';
import * as SHADOW_IMG from '../../../assets/banner/gameStopped_shadow.png';
import * as BACKGROUND_IMG from '../../../assets/banner/gameStopped_background.png';

import Canvas from '../Canvas/Canvas';
import Renderer, { BannerSprites } from './Renderer';
import SpriteListLoader, {
  SpriteList,
  DistantSprite,
  DistantImgList,
  getSpriteWithSrc
} from '../Rendering/SpriteListLoader';
import BannerLoader from '../BannerLoader';

export default class Banner {
  constructor(private readonly m_Canvas: Canvas) {}

  /**
   * Public methods
   */
  public load(): void {
    const loader: SpriteListLoader = new SpriteListLoader(
      images(),
      this.onSpritesLoaded.bind(this)
    );
  }

  public attachLoader(loader: BannerLoader): void {
    loader.addEvent(this.m_ReadyEvent);
  }

  public show(): void {
    this.m_Alpha = 1;
    this.render();
  }

  public hide(): void {
    this.m_Alpha = 0;
    this.render();
  }

  public render(): void {
    this.m_Renderer.draw(this.m_Alpha);
  }

  /**
   * Private methods
   */
  private onSpritesLoaded(sprites: SpriteList): void {
    let result: BannerSprites = {
      stopped: getSpriteWithSrc(sprites, BANNER_IMG),
      background: getSpriteWithSrc(sprites, BACKGROUND_IMG),
      shadow: getSpriteWithSrc(sprites, SHADOW_IMG)
    };
    this.m_Renderer = new Renderer(this.m_Canvas, result);
    this.m_ReadyEvent.post();
    console.log('Banner loaded');
  }

  /**
   * Private members
   */
  private m_Renderer: Renderer;
  private m_Alpha: number = 0;
  private readonly m_ReadyEvent: VoidSyncEvent = new VoidSyncEvent();
}

/**
 * Non-member methods
 */
function images(): DistantImgList {
  return [
    { imgSrc: BANNER_IMG, distanceFactor: 1 },
    { imgSrc: BACKGROUND_IMG, distanceFactor: 1 },
    { imgSrc: SHADOW_IMG, distanceFactor: 1 }
  ];
}
