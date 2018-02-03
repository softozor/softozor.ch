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

export default class Banner {
  constructor(private readonly m_Canvas: Canvas) {
    const loader: SpriteListLoader = new SpriteListLoader(
      images(),
      this.onSpritesLoaded.bind(this)
    );
  }

  /**
   * Public methods
   */
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
    console.log('List of sprites loaded!');
    let result: BannerSprites = {
      stopped: getSpriteWithSrc(sprites, BANNER_IMG),
      background: getSpriteWithSrc(sprites, BACKGROUND_IMG),
      shadow: getSpriteWithSrc(sprites, SHADOW_IMG)
    };
    this.m_Renderer = new Renderer(this.m_Canvas, result);
  }

  /**
   * Private members
   */
  private m_Renderer: Renderer;
  private m_Alpha: number = 1;
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
