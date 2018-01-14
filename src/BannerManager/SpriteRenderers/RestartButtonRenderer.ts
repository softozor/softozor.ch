import RESTART_IMG from '../../../assets/banner/restart.png';

import ButtonRenderer from './ButtonRenderer';
import Canvas from '../Canvas';
import Sprite from './Sprite';

export default class RestartButtonRenderer extends ButtonRenderer {
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
      new Sprite(RESTART_IMG),
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
  // TODO: only call if gameState = 'over' or gameState = 'restarting'
  public draw(): void {
    // TODO: do an animation on the globalAlpha value from 1 to 0 during the state transition from state = 'stopped' to 'started'
    this.m_Canvas.ctx.globalAlpha = 1;
    this.m_Canvas.ctx.drawImage(
      this.m_Sprite.img,
      this.xPX,
      this.yPX,
      this.width,
      this.height
    );
  }

  /**
   * Protected methods
   */
  protected get xPX(): number {
    return this.m_Canvas.widthPX - this.m_xRightPX - this.width;
  }

  protected get yPX(): number {
    return this.m_Canvas.heightPX - this.m_yBottomPX - this.height;
  }

  /**
   * Private members
   */
  private readonly m_yBottomPX: 5;
  private readonly m_xRightPX: 5;
}
