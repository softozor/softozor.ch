import * as CONSTANTS from '../../../config/game/Constants.json';

import Canvas from '../Canvas/Canvas';
import Sprite from '../Rendering/Sprite';
import DynamicSpriteRenderer from '../Rendering/DynamicSpriteRenderer';
import Vector2D from '../Math/Vector2D';

export default class BandRenderer extends DynamicSpriteRenderer {
  constructor(
    canvas: Canvas,
    width: number,
    height: number,
    sprite: Sprite,
    distanceFactor: number
  ) {
    super(canvas, width, height, distanceFactor, sprite);
  }

  /**
   * Public methods
   */
  public draw(alpha: number, pos0PX: Vector2D): void {
    super.draw(alpha, pos0PX);
  }

  /**
   * Protected methods
   */
  protected get height(): number {
    let ratio: number = (<any>CONSTANTS).WorldBandRatioToBanner;
    let bannerUnit: number = (<any>CONSTANTS).BannerUnit;
    return this.m_DistanceFactor === Infinity || this.m_DistanceFactor === 0
      ? this.m_Canvas.height
      : (ratio - 1 + this.m_DistanceFactor) * bannerUnit / ratio;
  }

  protected get width(): number {
    return this.m_Sprite !== undefined
      ? this.height * this.m_Sprite.naturalWidth / this.m_Sprite.naturalHeight
      : 0;
  }
}
