import * as IMG from '../../../assets/banner/restart.png';
import * as CONFIG from '../../../config/game/Buttons/Restart.json';

import Button from './Button';
import Canvas from '../Canvas/Canvas';
import Sprite from '../Rendering/Sprite';

type ButtonReadyCallback = () => void;

export default class RestartButton extends Button {
  constructor(
    canvas: Canvas,
    callback: ButtonReadyCallback,
    x: number = (<any>CONFIG).x,
    y: number = (<any>CONFIG).y,
    width: number = (<any>CONFIG).width,
    height: number = (<any>CONFIG).height,
    clickDelta: number = (<any>CONFIG).clickDelta
  ) {
    super(canvas, x, y, width, height, clickDelta);
    this.m_Sprite.load(IMG, callback);
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
    return this.m_Canvas.width - (<any>CONFIG).rightMargin - this.width;
  }

  protected get y(): number {
    return this.m_Canvas.height - (<any>CONFIG).bottomMargin - this.height;
  }

  /**
   * Private members
   */
}
