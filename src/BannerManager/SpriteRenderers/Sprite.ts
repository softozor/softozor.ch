import { VoidSyncEvent } from 'ts-events';

type ImgLoadedCallback = () => void;

export default class Sprite {
  constructor(imgSrc: string) {
    this.m_Img = new Image();
    let me: Sprite = this;
    // TODO: this must probably not be done any more; it made some kind of sense in the original code but not here any more!
    this.m_Img.onload = function() {
      me.m_ImgLoadedEvent.post();
    };
    this.m_Img.src = imgSrc;
  }

  /**
   * Public members
   */
  get img(): HTMLImageElement {
    return this.m_Img;
  }

  get naturalWidth(): number {
    return this.m_Img.naturalWidth;
  }

  get naturalHeight(): number {
    return this.m_Img.naturalHeight;
  }

  public attachImgLoadedEvent(callback: ImgLoadedCallback): void {
    this.m_ImgLoadedEvent.attach(callback);
  }

  /**
   * Private members
   */
  private m_Img: HTMLImageElement;
  private m_ImgLoadedEvent: VoidSyncEvent = new VoidSyncEvent();
}
