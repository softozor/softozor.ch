import Canvas from '../Canvas';
import Sprite from './Sprite';
import DynamicSpriteRenderer from './DynamicSpriteRenderer';
import Position from '../Position';

// TODO: call with width = 2000 and height = 200
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
  public tick(): void {
    let x: number = 0;
    if (x + this.width < scrollingPosition.xW) {
      x += this.width;
    }

    let x0PX: number = CoordinatesAdapter.xObsPX(x, this.m_DistanceFactor);
    let y0PX: number = CoordinatesAdapter.yObsPX(0, this.m_DistanceFactor);
    let pos0PX: Position = new Position(x0PX, y0PX);
    while (pos0PX.x <= this.m_Canvas.widthPX) {
      this.draw(pos0PX);
      pos0PX.x += this.widthPX;
    }
  }

  /**
   * Protected methods
   */
  protected get height(): number {
    return this.m_DistanceFactor === Infinity || this.m_DistanceFactor === 0
      ? this.m_Canvas.heightPX
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
