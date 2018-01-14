import Vector2D from './Vector2D';
import CircularHitBox from './HitBoxes/CircularHitBox';
import Obstacle from './Obstacles/Obstacle';
import Collision from './Collision';

// TODO: softozorData must be a json file that we import here
// TODO: upon setting the gameState to over, disconnect the tick method, i.e. don't trigger it any more!
// TODO: upon setting the gameState to on, connect the Softozor::tick method
// TODO: write renderer

export default class Softozor {
  constructor() {
    // TODO: define the SoftozorSpriteRenderer!
    // spriteRenderer: undefined,
    // this.spriteRenderer = new spriteRendererProto(
    //   spriteList.softozorIdle,
    //   softozorData.widthW,
    //   softozorData.heightW,
    //   worldDistanceFactor
    // );
  }

  // TODO: belongs to the spriteRenderer
  // graphicUpdate: function() {
  //   if (banner.gameState === 'on' || banner.gameState === 'restarting') {
  //     if (this.flapWait >= softozorData.flapDelay - 3) {
  //       this.spriteRenderer.sprite = spriteList.softozorFlap1;
  //     } else if (this.flapWait >= softozorData.flapDelay - 6) {
  //       this.spriteRenderer.sprite = spriteList.softozorFlap2;
  //     } else {
  //       this.spriteRenderer.sprite = spriteList.softozorIdle;
  //     }
  //     this.spriteRenderer.draw(this.position.xObsPX(), this.position.yObsPX());
  //   }
  // }

  /**
   * Public methods
   */
  public get position(): Vector2D {
    return this.m_Position;
  }

  public get speed(): Vector2D {
    return this.m_Speed;
  }

  public get isOutOfBounds(): Boolean {
    return this.m_DeltaXW + softozorData.heightW <= 0;
  }

  public handleBadCollision(collision: Collision): void {
    let diff: Vector2D = Vector2D.minus(collision.hitW, collision.centerW);
    let speedChangeFactor: number =
      2 *
      ((this.m_DeltaXSpeed + this.vx) * diff.x + this.vy * diff.y) /
      (diff.x * diff.x + diff.y * diff.y);
    this.m_DeltaXSpeed -= diff.x * speedChangeFactor;
    this.vy -= diff.y * speedChangeFactor;
  }

  public restart(): void {
    // TODO: implement
  }

  public reinit(): void {
    // TODO: implement
  }

  public tick(): void {
    this.fall();
    this.moveForward();
    this.flapUp();
    // TODO: call renderer.draw();
  }

  public startFlap(): void {
    this.m_DoFlap = true;
  }

  public stopFlap(): void {
    this.m_DoFlap = false;
  }

  public collide(obstacle: Obstacle): Collision | undefined {
    return obstacle.collide(this.m_Hitbox);
  }

  // TODO: shouldn't be necessary
  // refreshSize: function() {
  //   this.spriteRenderer.refreshSize();
  // }

  /**
   * Private methods
   */
  private static initialPosition(): Vector2D {
    return new Vector2D(
      softozorData.startPosition + softozorData.originalDeltaXW,
      softozorData.originalYW - softozorData.heightW * worldBandRatioToBanner
    );
  }

  private get canFlapUp(): Boolean {
    return this.m_DoFlap && this.y > softozorData.minYW && this.m_FlapWait <= 0;
  }

  private get x(): number {
    return this.m_Position.x;
  }

  private get y(): number {
    return this.m_Position.y;
  }

  private set x(value: number) {
    this.m_Position.x = value;
  }

  private set y(value: number) {
    this.m_Position.y = value;
  }

  private get vx(): number {
    return this.m_Speed.x;
  }

  private set vx(value: number) {
    this.m_Speed.x = value;
  }

  private get vy(): number {
    return this.m_Speed.y;
  }

  private set vy(value: number) {
    this.m_Speed.y = value;
  }

  private flapUp(): void {
    if (this.canFlapUp) {
      this.vy -= softozorData.flapStrength;
      this.flapWait = softozorData.flapDelay;
    }
    if (this.m_FlapWait > 0) {
      --this.m_FlapWait;
    }
  }

  private fall(): void {
    if (
      this.y >
      softozorData.maxYW - softozorData.heightW * worldBandRatioToBanner
    ) {
      this.vy = Math.min(this.vy, 0);
    } else if (this.y > softozorData.minYW) {
      // TODO: get rid of state transition
      this.vy += softozorData.gravity;
    } else {
      this.vy = Math.max(this.vy, softozorData.hitDownSpeed);
      this.vy += softozorData.gravity;
    }
    this.vy = Math.min(
      Math.max(this.vy, softozorData.minSpeed),
      softozorData.maxSpeed
    );
    this.y += this.vy;
  }

  private moveForward(): void {
    this.vx = softozorData.originalXSpeed + scrollingPosition.xW / 10000;
    scrollingPosition.xW += this.vx;
    this.deltaXW += this.deltaXSpeed;
    this.deltaXSpeed *= 0.9;
  }

  /**
   * Private members
   */
  // TODO: don't forget that all coordinate transformations are done with worldDistanceFactor here!
  private m_Position: Vector2D = Softozor.initialPosition();
  private m_DeltaXW: number = softozorData.originalDeltaXW;
  private m_DeltaXSpeed: number = 0;
  private m_Speed: Vector2D = new Vector2D(
    softozorData.originalXSpeed,
    softozorData.minSpeed
  );
  private m_FlapWait: number = 0;
  private m_DoFlap: Boolean = false;
  private m_Hitbox: CircularHitBox = new CircularHitBox(
    this.position,
    new Vector2D(softozorData.widthW * 0.5, softozorData.heightW * 0.65),
    softozorData.heightW * 0.3
  );
}
