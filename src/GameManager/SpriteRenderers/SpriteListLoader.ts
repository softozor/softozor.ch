import { forEach } from 'lodash';

import Sprite from './Sprite';

type DistantImg = { imgSrc: string; distanceFactor: number };
export type DistantImgList = DistantImg[];
export type DistantSprite = { sprite: Sprite; distanceFactor: number };
export type SpriteList = DistantSprite[];
export type ImgsLoadedCallback = (spriteList: SpriteList) => void;

export default class SpriteListLoader {
  constructor(
    list: DistantImgList,
    private readonly m_Callback: ImgsLoadedCallback
  ) {
    this.m_Counter = list.length;
    this.m_SpriteList = $.map(list, this.imgToSprite);
  }

  /**
   * Private methods
   */
  private createSprite(imgSrc: string): Sprite {
    let result: Sprite = new Sprite();
    result.load(imgSrc, this.onImgLoaded.bind(this));
    return result;
  }

  private imgToSprite(img: DistantImg): DistantSprite {
    return {
      sprite: this.createSprite(img.imgSrc),
      distanceFactor: img.distanceFactor
    };
  }

  private onImgLoaded(): void {
    if (--this.m_Counter === 0 && this.m_Callback) {
      this.m_Callback(this.m_SpriteList);
    }
  }

  /**
   * Private members
   */
  private m_Counter: number;
  private readonly m_SpriteList: SpriteList;
}
