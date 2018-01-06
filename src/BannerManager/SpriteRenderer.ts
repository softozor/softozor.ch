import Sprite from './Sprite';

type ClippingParams = {
  pos: number;
  sPos: number;
  length: number;
  sLength: number;
};

// TODO: probably need to write a generic SpriteRenderer and derive this one from it
export default class SpriteRenderer {
  constructor(
    private readonly m_Sprite: Sprite,
    private readonly m_WidthW: number,
    private readonly m_HeightW: number,
    private readonly m_DistanceFactor: number
  ) {}

  /**
   * Public methods
   */
  // TODO: must take the banner and softozor objects as arguments
  public draw(x0PX: number, y0PX: number, bannerHeightPX: number): void {
    this.refreshSize(bannerHeightPX);

    let vertParams: ClippingParams = this.getClippingParams(
      x0PX,
      this.m_WidthPX,
      banner.widthPX,
      this.m_WidthPXToN
    );
    let horizParams: ClippingParams = this.getClippingParams(
      y0PX,
      this.m_HeightPX,
      banner.heightPX,
      this.m_HeightPXToN
    );

    banner.ctx.drawImage(
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

  /**
   * Private methods
   */
  private getClippingParams(
    pos0PX: number,
    lengthPX: number,
    bannerLengthPX: number,
    lengthPXToN: number
  ): ClippingParams {
    var scrollXPX = scrollingPosition.xObsPX();

    if (pos0PX <= -lengthPX) {
      return undefined;
    } else if (pos0PX <= 0) {
      let result: ClippingParams;
      result.pos = 0;
      result.length = Math.min(bannerLengthPX, lengthPX + pos0PX);
      result.sPos = -pos0PX * lengthPXToN;
      result.sLength = result.length * lengthPXToN;
      return result;
    } else if (pos0PX <= scrollXPX + bannerLengthPX - lengthPX) {
      let result: ClippingParams;
      result.pos = pos0PX;
      result.length = Math.min(bannerLengthPX - pos0PX, lengthPX);
      result.sPos = 0;
      result.sLength = result.length * lengthPXToN;
      return result;
    } else if (pos0PX < scrollXPX + bannerLengthPX) {
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

  // TODO: in the end, we will not need that argument any more
  // The CoordinatesAdapter singleton will be kept up-to-date with the banner height!
  private refreshSize(bannerHeightPX: number): void {
    // TODO: this is the same as the coordinate transformation in positionProto, but for distances!
    if (this.m_DistanceFactor === 0 || this.m_DistanceFactor === Infinity) {
      this.m_HeightPX = this.m_HeightW;
      this.m_WidthPX = this.m_WidthW;
    } else {
      this.m_HeightPX =
        this.m_HeightW *
        worldBandRatioToBanner *
        bannerHeightPX /
        100 /
        this.m_DistanceFactor;
      this.m_WidthPX =
        this.m_WidthW *
        worldBandRatioToBanner *
        bannerHeightPX /
        100 /
        this.m_DistanceFactor;
    }

    this.m_WidthPXToN = this.m_Sprite.img.naturalWidth / this.m_WidthPX;
    this.m_HeightPXToN = this.m_Sprite.img.naturalHeight / this.m_HeightPX;
  }

  /**
   * Private members
   */
  private m_WidthPX: number = 0;
  private m_HeightPX: number = 0;
  private m_WidthPXToN: number = 0;
  private m_HeightPXToN: number = 0;
}
