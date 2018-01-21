import Canvas from '../Canvas/Canvas';
import Sprite from '../SpriteRenderers/Sprite';
import DynamicSpriteRenderer from '../SpriteRenderers/DynamicSpriteRenderer';

export default class BandRenderer extends DynamicSpriteRenderer {
  constructor(
    canvas: Canvas,
    width: number,
    height: number,
    sprite: Sprite,
    distanceFactor: number
  ) {
    super(canvas, width, height, sprite, distanceFactor);
  }

  /**
   * Protected methods
   */
  protected get height(): number {
    return this.m_DistanceFactor === Infinity || this.m_DistanceFactor === 0
      ? this.m_Canvas.height
      : (worldBandRatioToBanner - 1 + this.m_DistanceFactor) *
          100 /
          worldBandRatioToBanner;
  }

  protected get width(): number {
    return (
      this.height * this.m_Sprite.naturalWidth / this.m_Sprite.naturalHeight
    );
  }
}
