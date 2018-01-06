import HitBox from './HitBox';

import Position from '../Position';
import Collision from '../Collision';

export default class CircularHitBox extends HitBox {
  constructor(
    private readonly m_PositionW: Position,
    private readonly m_RelativeCenterW: Position,
    private readonly m_RadiusW: number
  ) {
    super();
  }

  /**
   * Getters / setters
   */
  get positionW(): Position {
    return this.m_PositionW;
  }

  get relativeCenterW(): Position {
    return this.m_RelativeCenterW;
  }

  get radiusW(): number {
    return this.m_RadiusW;
  }

  get centerW(): Position {
    return Position.plus(this.relativeCenterW, this.positionW);
  }

  /**
   * Public methods
   */
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
    let dW: Position = Position.minus(other.centerW, this.centerW); // actual distance vector between the two hitboxes
    let dMinW: number = other.radiusW + this.radiusW; // minimal distance between two hitboxes
    let distSqW: number = dW.x * dW.x + dW.y * dW.y;
    let dMinSqW: number = dMinW * dMinW;
    return distSqW < dMinSqW
      ? this.createCollision(other, dW, dMinW)
      : undefined;
  }

  private createCollision(
    other: CircularHitBox,
    dW: Position,
    dMinW: number
  ): Collision {
    let hitW: Position = Position.plus(
      other.centerW,
      dW.times(other.radiusW / dMinW)
    );
    return new Collision(other.centerW, hitW);
  }

  /**
   * Private members
   */
}
