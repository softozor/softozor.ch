import RESTART_IMG from '../../../assets/banner/restart.png';

import Button from './Button';
import Canvas from '../Canvas/Canvas';
import Sprite from '../SpriteRenderers/Sprite';

export default class RestartButton extends Button {
  constructor(
    canvas: Canvas,
    xPX: number = 5, // TODO: put these numbers in a config file!
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
  public draw(): void {
    this.m_Canvas.context.drawImage(
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
    return this.m_Canvas.width - this.m_xRightPX - this.width;
  }

  protected get yPX(): number {
    return this.m_Canvas.height - this.m_yBottomPX - this.height;
  }

  /**
   * Private members
   */
  private readonly m_yBottomPX: 5;
  private readonly m_xRightPX: 5;
}
