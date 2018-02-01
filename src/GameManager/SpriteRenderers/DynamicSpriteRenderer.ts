import Sprite from './Sprite';
import SpriteRenderer from './SpriteRenderer';
import Canvas from '../Canvas/Canvas';
import Vector2D from '../Math/Vector2D';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';

type ClippingParams = {
  pos: number;
  sPos: number;
  length: number;
  sLength: number;
};

export default class DynamicSpriteRenderer extends SpriteRenderer {
  constructor(
    canvas: Canvas,
    private readonly m_Width: number,
    private readonly m_Height: number,
    protected m_Sprite: Sprite,
    protected readonly m_DistanceFactor: number
  ) {
    super(canvas);
  }

  /**
   * Public methods
   */
  public get distanceFactor(): number {
    return this.m_DistanceFactor;
  }

  public get heightPX(): number {
    return MovingCoordinateSystem.obsLengthPX(
      this.height,
      this.m_DistanceFactor
    );
  }

  public get widthPX(): number {
    return MovingCoordinateSystem.obsLengthPX(
      this.width,
      this.m_DistanceFactor
    );
  }

  public draw(alpha: number, pos0PX: Vector2D): void {
    let obsScrollPos: Vector2D = MovingCoordinateSystem.obsPX(
      MovingCoordinateSystem.scrollingPosition(),
      this.m_DistanceFactor
    ); // should be (0, 0)
    let vertParams: ClippingParams | undefined = getClippingParams(
      pos0PX.x,
      this.widthPX,
      this.m_Canvas.width,
      this.widthPXToN,
      obsScrollPos.x
    );
    let horizParams: ClippingParams | undefined = getClippingParams(
      pos0PX.y,
      this.heightPX,
      this.m_Canvas.height,
      this.heightPXToN,
      obsScrollPos.y
    );

    if (vertParams !== undefined && horizParams !== undefined) {
      this.m_Canvas.context.globalAlpha = alpha;
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
  protected get width(): number {
    return this.m_Width;
  }

  protected get height(): number {
    return this.m_Height;
  }

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
 * Non-member methods
 */
function getClippingParams(
  pos0PX: number,
  lengthPX: number,
  bannerLengthPX: number,
  lengthPXToN: number,
  scrollPX: number
): ClippingParams | undefined {
  if (pos0PX <= -lengthPX) {
    return undefined;
  } else if (pos0PX <= 0) {
    let l: number = Math.min(bannerLengthPX, lengthPX + pos0PX);
    let result: ClippingParams = {
      pos: 0,
      length: l,
      sPos: -pos0PX * lengthPXToN,
      sLength: l * lengthPXToN
    };
    return result;
  } else if (pos0PX <= scrollPX + bannerLengthPX - lengthPX) {
    let l: number = Math.min(bannerLengthPX - pos0PX, lengthPX);
    let result: ClippingParams = {
      pos: pos0PX,
      length: l,
      sPos: 0,
      sLength: l * lengthPXToN
    };
    return result;
  } else if (pos0PX < scrollPX + bannerLengthPX) {
    let l: number = bannerLengthPX - pos0PX;
    let result: ClippingParams = {
      pos: pos0PX,
      length: l,
      sPos: 0,
      sLength: l * lengthPXToN
    };
    return result;
  } else {
    return undefined;
  }
}
