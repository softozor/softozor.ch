import { VoidSyncEvent } from 'ts-events';

export type ReadyEventCallback = () => void;

export default class BannerLoader {
  constructor() {}

  /**
   * Public methods
   */
  public attachReadyEvent(callback: ReadyEventCallback): void {
    this.m_ReadyEvent.attach(callback);
  }

  public onComponentReady(): void {
    if (--this.m_Counter === 0) {
      this.m_ReadyEvent.post();
    }
  }

  public addEvent(event: VoidSyncEvent): void {
    ++this.m_Counter;
    event.attach(this.onComponentReady.bind(this));
  }

  /**
   * Private members
   */
  private m_Counter: number = 0;
  private m_ReadyEvent: VoidSyncEvent = new VoidSyncEvent();
}
