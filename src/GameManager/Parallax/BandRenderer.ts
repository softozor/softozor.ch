import Canvas from '../Canvas/Canvas';
import Sprite from '../SpriteRenderers/Sprite';
import DynamicSpriteRenderer from '../SpriteRenderers/DynamicSpriteRenderer';
import Vector2D from '../Math/Vector2D';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';

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
   * Public methods
   */
  public draw(pos0PX: Vector2D): void {
    this.m_Canvas.context.globalAlpha = 1;
    super.draw(pos0PX);
  }

  /**
   * Protected methods
   */
  protected get height(): number {
    return this.m_DistanceFactor === Infinity || this.m_DistanceFactor === 0
      ? this.m_Canvas.height
      : (MovingCoordinateSystem.WORLD_BAND_RATIO_TO_BANNER -
          1 +
          this.m_DistanceFactor) *
          100 /
          MovingCoordinateSystem.WORLD_BAND_RATIO_TO_BANNER;
  }

  protected get width(): number {
    return (
      this.height * this.m_Sprite.naturalWidth / this.m_Sprite.naturalHeight
    );
  }
}
