export type ImgLoadedCallback = () => void;

export default class Sprite {
  constructor(imgSrc: string, callback?: ImgLoadedCallback) {
    this.m_Img = new Image();
    if (callback !== undefined) {
      this.m_Img.onload = callback;
    }
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
