import * as CONFIG from '../../../config/game/SoftozorData.json';
import * as CONSTANTS from '../../../config/game/Constants.json';

import Vector2D from '../Math/Vector2D';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import Obstacle from '../Obstacles/Obstacle';
import Collision from '../Collision';
import Renderer from './Renderer';
import Canvas from '../Canvas/Canvas';
import MovingObject from '../MovingObject';

export default class Softozor extends MovingObject {
  constructor(private readonly m_Canvas: Canvas) {
    super();
  }

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
    // console.log(this.m_DeltaXW + ', ' + this.m_DeltaXW + (<any>CONFIG).heightW);
    return this.m_DeltaXW + (<any>CONFIG).heightW <= 0;
  }

  public get deltaXW(): number {
    return this.m_DeltaXW;
  }

  public reset(): void {
    this.m_Alpha = 0;
    this.m_Position = Softozor.initialPosition();
    this.m_DeltaXW = (<any>CONFIG).originalDeltaXW;
    this.m_DeltaXSpeed = 0;
    this.m_Speed = new Vector2D(
      (<any>CONFIG).originalXSpeed,
      (<any>CONFIG).minSpeed
    );
    this.m_FlapWait = 0;
    this.m_DoFlap = false;
    this.m_Hitbox = new CircularHitBox(
      this.m_Position,
      new Vector2D(
        (<any>CONFIG).widthW * (<any>CONFIG).hitbox.relativeCenterWidthFactor,
        (<any>CONFIG).heightW * (<any>CONFIG).hitbox.relativeCenterHeightFactor
      ),
      (<any>CONFIG).heightW * (<any>CONFIG).hitbox.radiusFactor
    );
  }

  public handleBadCollision(collision: Collision): void {
    let diff: Vector2D = Vector2D.minus(collision.hitW, collision.centerW);
    let speedChangeFactor: number
      = 2
      * ((this.m_DeltaXSpeed + this.vx) * diff.x + this.vy * diff.y)
      / (diff.x * diff.x + diff.y * diff.y);
    this.m_DeltaXSpeed -= diff.x * speedChangeFactor;
    this.vy -= diff.y * speedChangeFactor;
  }

  public tick(): void {
    this.fall();
    this.moveForward();
    this.flapUp();
    this.render();
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

  public show(): void {
    this.m_Alpha = 1;
    this.render();
  }

  public hide(): void {
    this.m_Alpha = 0;
    this.render();
  }

  public render(): void {
    if (this.m_FlapWait >= (<any>CONFIG).flapDelay - 3) {
      this.m_Renderer.setFlap1State();
    } else if (this.m_FlapWait >= (<any>CONFIG).flapDelay - 6) {
      this.m_Renderer.setFlap2State();
    } else {
      this.m_Renderer.setIdleState();
    }
    let pos0PX: Vector2D = MovingCoordinateSystem.obsPX(
      this.position,
      this.m_DistanceFactor
    );
    this.m_Renderer.draw(this.m_Alpha, pos0PX);
  }

  /**
   * Private methods
   */
  private static initialPosition(): Vector2D {
    return new Vector2D(
      (<any>CONFIG).startPosition + (<any>CONFIG).originalDeltaXW,
      (<any>CONFIG).originalYW
        - (<any>CONFIG).heightW * (<any>CONSTANTS).WorldBandRatioToBanner
    );
  }

  private get canFlapUp(): Boolean {
    return (
      this.m_DoFlap && this.y > (<any>CONFIG).minYW && this.m_FlapWait <= 0
    );
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
      this.vy -= (<any>CONFIG).flapStrength;
      this.m_FlapWait = (<any>CONFIG).flapDelay;
    }
    if (this.m_FlapWait > 0) {
      --this.m_FlapWait;
    }
  }

  private fall(): void {
    if (
      this.y
      > (<any>CONFIG).maxYW
        - (<any>CONFIG).heightW * (<any>CONSTANTS).WorldBandRatioToBanner
    ) {
      this.vy = Math.min(this.vy, 0);
    } else if (this.y > (<any>CONFIG).minYW) {
      this.vy += (<any>CONFIG).gravity;
    } else {
      this.vy = Math.max(this.vy, (<any>CONFIG).hitDownSpeed);
      this.vy += (<any>CONFIG).gravity;
    }
    this.vy = Math.min(
      Math.max(this.vy, (<any>CONFIG).minSpeed),
      (<any>CONFIG).maxSpeed
    );
    this.y += this.vy;
  }

  private moveForward(): void {
    this.vx = (<any>CONFIG).originalXSpeed + (this.x - this.m_DeltaXW) / 10000;
    this.x += this.vx;
    this.m_DeltaXW += this.m_DeltaXSpeed;
    this.m_DeltaXSpeed *= (<any>CONFIG).moveForward.deltaXSpeedFactor;
  }

  /**
   * Private members
   */
  private m_Alpha: number = 0;
  private m_Position: Vector2D = new Vector2D();
  private m_DeltaXW: number = 0;
  private m_DeltaXSpeed: number = 0;
  private m_Speed: Vector2D = new Vector2D();
  private m_FlapWait: number = 0;
  private m_DoFlap: Boolean = false;
  private readonly m_DistanceFactor: number = (<any>CONSTANTS)
    .WorldDistanceFactor;
  private m_Hitbox: CircularHitBox = new CircularHitBox(
    new Vector2D(),
    new Vector2D(),
    0
  );
  private readonly m_Renderer: Renderer = new Renderer(
    this.m_Canvas,
    (<any>CONFIG).widthW,
    (<any>CONFIG).heightW,
    this.m_DistanceFactor
  );
}
