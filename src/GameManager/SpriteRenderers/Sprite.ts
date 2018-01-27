import { VoidSyncEvent } from 'ts-events';

export default class Sprite {
  constructor(imgSrc: string) {
    this.m_Img = new Image();
    this.m_Img.src = imgSrc;
  }

  /**
   * Public members
   */
  public get img(): HTMLImageElement {
    return this.m_Img;
  }

  public get naturalWidth(): number {
    return this.m_Img.naturalWidth;
  }

  public get naturalHeight(): number {
    return this.m_Img.naturalHeight;
  }

  /**
   * Private members
   */
  private m_Img: HTMLImageElement;
}
