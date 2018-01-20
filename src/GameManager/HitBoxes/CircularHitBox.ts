import HitBox from './HitBox';

import Vector2D from '../Vector2D';
import Collision from '../Collision';

export default class CircularHitBox extends HitBox {
  constructor(
    private readonly m_PositionW: Vector2D,
    private readonly m_RelativeCenterW: Vector2D,
    private readonly m_RadiusW: number
  ) {
    super();
  }

  /**
   * Public methods
   */
  get positionW(): Vector2D {
    return this.m_PositionW;
  }

  get relativeCenterW(): Vector2D {
    return this.m_RelativeCenterW;
  }

  get radiusW(): number {
    return this.m_RadiusW;
  }

  get centerW(): Vector2D {
    return Vector2D.plus(this.relativeCenterW, this.positionW);
  }

  public collide(other: HitBox): Collision | undefined {
    if (other instanceof CircularHitBox) {
      return this.collideWithCircularHitBox(other);
    }
    console.log('Collision with unknown HitBox shape.');
    return undefined;
  }

  /**
   * Private methods
   */
  private collideWithCircularHitBox(
    other: CircularHitBox
  ): Collision | undefined {
    let dW: Vector2D = Vector2D.minus(other.centerW, this.centerW); // actual distance vector between the two hitboxes
    let dMinW: number = other.radiusW + this.radiusW; // minimal distance between two hitboxes
    let distSqW: number = dW.x * dW.x + dW.y * dW.y;
    let dMinSqW: number = dMinW * dMinW;
    return distSqW < dMinSqW
      ? this.createCollision(other, dW, dMinW)
      : undefined;
  }

  private createCollision(
    other: CircularHitBox,
    dW: Vector2D,
    dMinW: number
  ): Collision {
    let hitW: Vector2D = Vector2D.plus(
      other.centerW,
      dW.times(other.radiusW / dMinW)
    );
    return new Collision(other.centerW, hitW);
  }

  /**
   * Private members
   */
}
