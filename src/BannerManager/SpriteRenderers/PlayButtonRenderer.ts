import PLAY_PAUSE_IMG from '../../../assets/banner/play_pause.png';

import ButtonRenderer from './ButtonRenderer';
import Canvas from '../Canvas';
import Sprite from './Sprite';

export default class PlayButtonRenderer extends ButtonRenderer {
  constructor(
    canvas: Canvas,
    xPX: number = 5,
    yPX: number = 5,
    widthPX: number = 50,
    heightPX: number = 50,
    clickDeltaPX: number = 50
  ) {
    super(
      canvas,
      new Sprite(PLAY_PAUSE_IMG),
      xPX,
      yPX,
      widthPX,
      heightPX,
      clickDeltaPX
    );
  }

  /**
   * Public methods
   */
  public draw(): void {
    // TODO: animate this button as it was done in the old code
    // it must show the transition between the sprites as depicted
    // in the play_pause.png image
    // The button should be animated during the state transition from
    // 'paused' to 'running' and vice-versa!
    // We don't need the actual state; we only need to initialize this
    // position at the correct button (xN = 0 ==> pause; xN = 600 ==> play)
    // and then just toggle the direction!
    // The animation must be done here in this method!
    let xN: number = 0;
    this.m_Canvas.ctx.drawImage(
      this.m_Sprite.img,
      xN,
      0,
      50,
      50,
      this.xPX,
      this.yPX,
      this.width,
      this.height
    );
  }

  /**
   * Protected methods
   */
  protected get yPX(): number {
    return this.m_Canvas.heightPX - this.m_yBottomPX - this.height;
  }

  /**
   * Private members
   */
  private readonly m_yBottomPX: 5;
}
