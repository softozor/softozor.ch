import { VoidSyncEvent } from 'ts-events';

export type ImgLoadedCallback = () => void;

export default class Sprite {
  constructor() {
    this.m_Img = new Image();
    this.m_Img.onload = this.onImgLoaded.bind(this);
  }

  /**
   * Public methods
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

  public load(imgSrc: string, callback: ImgLoadedCallback): void {
    console.log('constructing sprite with img <' + imgSrc + '>');
    this.m_LoadedEvent.attach(callback);
    this.m_Img.src = imgSrc;
  }

  /**
   * Private methods
   */
  private onImgLoaded(): void {
    this.m_LoadedEvent.post();
  }

  /**
   * Private members
   */
  private m_Img: HTMLImageElement;
  private m_LoadedEvent: VoidSyncEvent = new VoidSyncEvent();
}
