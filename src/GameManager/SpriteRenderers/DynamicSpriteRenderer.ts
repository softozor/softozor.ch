import Sprite from './Sprite';
import SpriteRenderer from './SpriteRenderer';
import Canvas from '../Canvas/Canvas';
import Vector2D from '../Math/Vector2D';
import * as CoordinatesAdapter from '../Math/CoordinatesAdapter';

type ClippingParams = {
  pos: number;
  sPos: number;
  length: number;
  sLength: number;
};

// TODO: must take the softozor scrolling position as reference
export default class DynamicSpriteRenderer extends SpriteRenderer {
  constructor(
    canvas: Canvas,
    widthW: number,
    heightW: number,
    protected m_Sprite: Sprite,
    protected readonly m_DistanceFactor: number
  ) {
    super(canvas, widthW, heightW);
  }

  /**
   * Public methods
   */
  public get distanceFactor(): number {
    return this.m_DistanceFactor;
  }

  // TODO: this is the same as the coordinate transformation in positionProto, but for distances!
  public get heightPX(): number {
    if (this.m_DistanceFactor === 0 || this.m_DistanceFactor === Infinity) {
      return this.height;
    }
    return (
      this.height *
      CoordinatesAdapter.WORLD_BAND_RATIO_TO_BANNER *
      this.m_Canvas.height /
      100 /
      this.m_DistanceFactor
    );
  }

  public get widthPX(): number {
    if (this.m_DistanceFactor === 0 || this.m_DistanceFactor === Infinity) {
      return this.width;
    }
    return (
      this.width *
      CoordinatesAdapter.WORLD_BAND_RATIO_TO_BANNER *
      this.m_Canvas.height /
      100 /
      this.m_DistanceFactor
    );
  }

  public draw(pos0PX: Vector2D): void {
    let obsScrollPos: Vector2D = CoordinatesAdapter.obsPX(
      CoordinatesAdapter.scrollingPosition(),
      this.m_DistanceFactor
    ); // should be (0, 0)
    let vertParams: ClippingParams = getClippingParams(
      pos0PX.x,
      this.widthPX,
      this.m_Canvas.width,
      this.widthPXToN,
      obsScrollPos.x
    );
    let horizParams: ClippingParams = getClippingParams(
      pos0PX.y,
      this.heightPX,
      this.m_Canvas.height,
      this.heightPXToN,
      obsScrollPos.y
    );

    if (vertParams !== undefined && horizParams !== undefined) {
      this.m_Canvas.context.drawImage(
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

  /**
   * Protected methods
   */
  protected get widthPXToN(): number {
    return this.m_Sprite.naturalWidth / this.widthPX;
  }

  protected get heightPXToN(): number {
    return this.m_Sprite.naturalHeight / this.heightPX;
  }

  /**
   * Private members
   */
}

/**
 * Helper methods
 */
function getClippingParams(
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
