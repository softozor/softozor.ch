import Sprite from './Sprite';
import SpriteRenderer from './SpriteRenderer';
import Canvas from '../Canvas'; // TODO: this is the old banner object

type ClippingParams = {
  pos: number;
  sPos: number;
  length: number;
  sLength: number;
};

// TODO: probably need to write a generic SpriteRenderer and derive this one from it
// TODO: must take the softozor scrolling position as reference
export default class DynamicSpriteRenderer extends SpriteRenderer {
  constructor(
    canvas: Canvas,
    widthW: number,
    heightW: number,
    private readonly m_Sprite: Sprite,
    private readonly m_DistanceFactor: number
  ) {
    super(canvas, widthW, heightW);
  }

  /**
   * Getters / setters
   */
  get x0PX(): number {
    return this.m_x0PX;
  }

  get y0PX(): number {
    return this.m_y0PX;
  }

  set x0PX(value: number) {
    this.m_x0PX = value;
  }

  set y0PX(value: number) {
    this.m_y0PX = value;
  }

  /**
   * Public methods
   */
  public draw(): void {
    let vertParams: ClippingParams = this.getClippingParams(
      this.x0PX,
      this.m_WidthPX,
      this.m_Canvas.widthPX,
      this.m_WidthPXToN,
      scrollingPosition.xObsPX()
    );
    let horizParams: ClippingParams = this.getClippingParams(
      this.y0PX,
      this.m_HeightPX,
      this.m_Canvas.heightPX,
      this.m_HeightPXToN,
      scrollingPosition.yObsPX()
    );

    if (
      typeof vertParams !== 'undefined' &&
      typeof horizParams !== 'undefined'
    ) {
      this.m_Canvas.ctx.drawImage(
        this.m_Sprite.img,
        vertParams.sPos,
        horizParams.sPos,
        vertParams.sLength,
        horizParams.sLength,
        vertParams.pos,
        horizParams.pos,
        vertParams.length,
        horizParams.length
      );
    }
  }

  // TODO: in the end, we will not need that argument any more
  // The CoordinatesAdapter singleton will be kept up-to-date with the banner height!
  public onCanvasResized(width: number, height: number): void {
    // TODO: this is the same as the coordinate transformation in positionProto, but for distances!
    if (this.m_DistanceFactor === 0 || this.m_DistanceFactor === Infinity) {
      this.m_HeightPX = this.m_Height;
      this.m_WidthPX = this.m_Width;
    } else {
      this.m_HeightPX =
        this.m_Height *
        worldBandRatioToBanner *
        this.m_Canvas.heightPX /
        100 /
        this.m_DistanceFactor;
      this.m_WidthPX =
        this.m_Width *
        worldBandRatioToBanner *
        this.m_Canvas.heightPX /
        100 /
        this.m_DistanceFactor;
    }

    // TODO: These data are sprite renderer-specific and must be refreshed when the canvas is resized
    this.m_WidthPXToN = this.m_Sprite.img.naturalWidth / this.m_WidthPX;
    this.m_HeightPXToN = this.m_Sprite.img.naturalHeight / this.m_HeightPX;
  }

  /**
   * Private methods
   */
  private getClippingParams(
    pos0PX: number,
    lengthPX: number,
    bannerLengthPX: number,
    lengthPXToN: number,
    scrollPX: number
  ): ClippingParams {
    if (pos0PX <= -lengthPX) {
      return undefined;
    } else if (pos0PX <= 0) {
      let result: ClippingParams;
      result.pos = 0;
      result.length = Math.min(bannerLengthPX, lengthPX + pos0PX);
      result.sPos = -pos0PX * lengthPXToN;
      result.sLength = result.length * lengthPXToN;
      return result;
    } else if (pos0PX <= scrollPX + bannerLengthPX - lengthPX) {
      let result: ClippingParams;
      result.pos = pos0PX;
      result.length = Math.min(bannerLengthPX - pos0PX, lengthPX);
      result.sPos = 0;
      result.sLength = result.length * lengthPXToN;
      return result;
    } else if (pos0PX < scrollPX + bannerLengthPX) {
      let result: ClippingParams;
      result.pos = pos0PX;
      result.length = bannerLengthPX - pos0PX;
      result.sPos = 0;
      result.sLength = result.length * lengthPXToN;
      return result;
    } else {
      return undefined;
    }
  }

  /**
   * Private members
   */
  // TODO: use a size object here
  private m_WidthPX: number = 0;
  private m_HeightPX: number = 0;
  private m_WidthPXToN: number = 0;
  private m_HeightPXToN: number = 0;

  private m_x0PX: number = 0;
  private m_y0PX: number = 0;
}
