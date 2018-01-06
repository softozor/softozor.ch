import { VoidSyncEvent } from 'ts-events';

type ImgLoadedCallback = () => void;

export default class Sprite {
  constructor(imgSrc: string) {
    this.m_Img = new Image();
    let me: Sprite = this;
    this.m_Img.onload = function() {
      me.m_ImgLoadedEvent.post();
    };
    this.m_Img.src = imgSrc;
  }

  /**
   * Getters / setters
   */
  get img(): HTMLImageElement {
    return this.m_Img;
  }

  /**
   * Public members
   */
  public attachImgLoadedEvent(callback: ImgLoadedCallback): void {
    this.m_ImgLoadedEvent.attach(callback);
  }

  /**
   * Private members
   */
  private m_Img: HTMLImageElement;
  private m_ImgLoadedEvent: VoidSyncEvent = new VoidSyncEvent();
}
