import CONFIG from '../../../config/game/SoftozorData.json';
import CONSTANTS from '../../../config/game/Constants.json';

import Vector2D from '../Math/Vector2D';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';
import CircularHitBox from '../HitBoxes/CircularHitBox';
import Obstacle from '../Obstacles/Obstacle';
import Collision from '../Collision';
import Renderer from './Renderer';
import Canvas from '../Canvas/Canvas';
import MovingObject from '../MovingObject';

// TODO: upon setting the gameState to over, disconnect the tick method, i.e. don't trigger it any more!
// TODO: upon setting the gameState to on, connect the Softozor::tick method
// TODO: double-check that the json data are consistent!

export default class Softozor extends MovingObject {
  constructor(private readonly m_Canvas: Canvas) {
    super();
    this.m_Canvas.attachResizeEvent(this.render.bind(this));
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
    return this.m_DeltaXW + CONFIG.heightW <= 0;
  }

  public get deltaXW(): number {
    return this.m_DeltaXW;
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

  /**
   * Private methods
   */
  private static initialPosition(): Vector2D {
    return new Vector2D(
      CONFIG.startPosition + CONFIG.originalDeltaXW,
      CONFIG.originalYW - CONFIG.heightW * CONSTANTS.WorldBandRatioToBanner
    );
  }

  private get canFlapUp(): Boolean {
    return this.m_DoFlap && this.y > CONFIG.minYW && this.m_FlapWait <= 0;
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

  private render(): void {
    if (this.m_FlapWait >= CONFIG.flapDelay - 3) {
      this.m_Renderer.setFlap1State();
    } else if (this.m_FlapWait >= CONFIG.flapDelay - 6) {
      this.m_Renderer.setFlap2State();
    } else {
      this.m_Renderer.setIdleState();
    }
    let pos0PX: Vector2D = MovingCoordinateSystem.obsPX(
      this.position,
      this.m_DistanceFactor
    );
    this.m_Renderer.draw(1, pos0PX);
  }

  private flapUp(): void {
    if (this.canFlapUp) {
      this.vy -= CONFIG.flapStrength;
      this.m_FlapWait = CONFIG.flapDelay;
    }
    if (this.m_FlapWait > 0) {
      --this.m_FlapWait;
    }
  }

  private fall(): void {
    if (
      this.y >
      CONFIG.maxYW - CONFIG.heightW * CONSTANTS.WorldBandRatioToBanner
    ) {
      this.vy = Math.min(this.vy, 0);
    } else if (this.y > CONFIG.minYW) {
      this.vy += CONFIG.gravity;
    } else {
      this.vy = Math.max(this.vy, CONFIG.hitDownSpeed);
      this.vy += CONFIG.gravity;
    }
    this.vy = Math.min(Math.max(this.vy, CONFIG.minSpeed), CONFIG.maxSpeed);
    this.y += this.vy;
  }

  private moveForward(): void {
    this.vx = CONFIG.originalXSpeed + (this.x - this.m_DeltaXW) / 10000;
    this.x += this.vx;
    this.m_DeltaXW += this.m_DeltaXSpeed;
    this.m_DeltaXSpeed *= CONFIG.moveForward.deltaXSpeedFactor;
  }

  /**
   * Private members
   */
  private m_Position: Vector2D = Softozor.initialPosition();
  private m_DeltaXW: number = CONFIG.originalDeltaXW;
  private m_DeltaXSpeed: number = 0;
  private m_Speed: Vector2D = new Vector2D(
    CONFIG.originalXSpeed,
    CONFIG.minSpeed
  );
  private m_FlapWait: number = 0;
  private m_DoFlap: Boolean = false;
  private readonly m_DistanceFactor: number = CONSTANTS.WorldDistanceFactor;
  private readonly m_Hitbox: CircularHitBox = new CircularHitBox(
    this.m_Position,
    new Vector2D(
      CONFIG.widthW * CONFIG.hitbox.relativeCenterWidthFactor,
      CONFIG.heightW * CONFIG.hitbox.relativeCenterHeightFactor
    ),
    CONFIG.heightW * CONFIG.hitbox.radiusFactor
  );
  private m_Renderer: Renderer = new Renderer(
    this.m_Canvas,
    CONFIG.widthW,
    CONFIG.heightW,
    this.m_DistanceFactor
  );
}
