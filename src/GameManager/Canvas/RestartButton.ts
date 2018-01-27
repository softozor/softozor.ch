import RESTART_IMG from '../../../assets/banner/restart.png';
import CONFIG from '../../../config/game/Buttons/Restart.json';

import Button from './Button';
import Canvas from '../Canvas/Canvas';
import Sprite from '../SpriteRenderers/Sprite';

export default class RestartButton extends Button {
  constructor(
    canvas: Canvas,
    x: number = CONFIG.x,
    y: number = CONFIG.y,
    width: number = CONFIG.width,
    height: number = CONFIG.height,
    clickDelta: number = CONFIG.clickDelta
  ) {
    super(canvas, new Sprite(RESTART_IMG), x, y, width, height, clickDelta);
  }

  /**
   * Public methods
   */
  public draw(alpha: number): void {
    this.m_Canvas.context.globalAlpha = alpha;
    this.m_Canvas.context.drawImage(
      this.m_Sprite.img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  /**
   * Protected methods
   */
  protected get x(): number {
    return this.m_Canvas.width - CONFIG.rightMargin - this.width;
  }

  protected get y(): number {
    return this.m_Canvas.height - CONFIG.bottomMargin - this.height;
  }

  /**
   * Private members
   */
}
