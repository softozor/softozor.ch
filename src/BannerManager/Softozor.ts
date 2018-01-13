import Position from "./Position";
import CircularHitBox from './HitBoxes/CircularHitBox';

// TODO: softozorData must be a json file that we import here
// TODO: write state pattern with two states: On / Off (--> gameState = 'on' / 'restarted' / gameState = 'over')

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
  public get position(): Position {
    return this.m_Position;
  }

  public set position(value: Position) {
    this.m_Position = value;
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

    // TODO: only call if gameState = on (i.e. not over and not restarting)
    if (banner.gameState === 'on') {
      this.hitCheck();
      this.checkOut();
    }
  }

  public startFlap(): void {
    this.m_DoFlap = true;
  }

  public stopFlap(): void {
    this.m_DoFlap = false;
  }

  moveForward: function() {
    if (banner.gameState === 'on')
      this.xSpeed = softozorData.originalXSpeed + scrollingPosition.xW / 10000;
    scrollingPosition.xW += this.xSpeed * banner.stateTransition;
    this.deltaXW += this.deltaXSpeed * banner.stateTransition;
    this.deltaXSpeed *= 0.9;
  },

  // hit check
  hitCheck: function() {
    var length = obstacle.length;
    for (var obstacleIndex = 0; obstacleIndex < length; obstacleIndex++) {
      var collision = this.hitbox.testHit(obstacle[obstacleIndex].hitbox);
      if (collision.type === true) {
        if (obstacle[obstacleIndex].type === 'bad') {
          var dx = collision.hitXW - collision.centerXW;
          var dy = collision.hitYW - collision.centerYW;
          var speedChangeFactor =
            2 *
            ((this.deltaXSpeed + this.xSpeed) * dx + this.ySpeed * dy) /
            (dx * dx + dy * dy);
          this.deltaXSpeed -= dx * speedChangeFactor;
          this.ySpeed -= dy * speedChangeFactor;
          scorePop[scorePop.length] = new scorePopProto('xxx');
          scoreIncrement = 1;
        } else if (obstacle[obstacleIndex].type === 'good') {
          scorePop[scorePop.length] = new scorePopProto(scoreIncrement);
          score += scoreIncrement;
          scoreIncrement++;
        }
        obstacle[obstacleIndex].mustBeDestroyed = true;
      }
    }
  }

  // TODO: shouldn't be necessary
  // refreshSize: function() {
  //   this.spriteRenderer.refreshSize();
  // }

  /**
   * Private methods
   */
  static private initialPosition(): Position {
    return new Position(softozorData.startPosition + softozorData.originalDeltaXW, softozorData.originalYW - softozorData.heightW * worldBandRatioToBanner);
  }

  private get canFlapUp(): Boolean {
    return this.m_DoFlap &&
    this.y > softozorData.minYW &&
    this.m_FlapWait <= 0;
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

  private get outOfBounds: Boolean {
    return this.m_DeltaXW + softozorData.heightW <= 0;
  }

  private flapUp(): void {
    if (this.canFlapUp) {
      if (banner.gameState === 'on') {
        this.ySpeed -= softozorData.flapStrength;
        this.flapWait = softozorData.flapDelay;
      } else {
        this.ySpeed -= softozorData.flapStrength / softozorData.flapDelay;
      }
    }
    // TODO: only call this if the game isn't paused
    if (this.m_FlapWait > 0) {
      --this.m_FlapWait;
    }
  }

  private fall(): void {
    if (
      this.y >
      softozorData.maxYW - softozorData.heightW * worldBandRatioToBanner
    ) {
      // TODO: refactor the speeds --> create vector with x / y components and name it Speed
      this.ySpeed = Math.min(this.ySpeed, 0);
    } else if (this.y > softozorData.minYW) {
      // TODO: get rid of state transition
      this.ySpeed += softozorData.gravity * banner.stateTransition;
    } else {
      this.ySpeed = Math.max(this.ySpeed, softozorData.hitDownSpeed);
      this.ySpeed += softozorData.gravity * banner.stateTransition;
    }
    this.ySpeed = Math.min(
      Math.max(this.ySpeed, softozorData.minSpeed),
      softozorData.maxSpeed
    );
    this.y += this.ySpeed * banner.stateTransition;
  }

  private endGame(): void {
      // banner.gameState = 'over';
      // TODO: emit end of game!
  }

  /**
   * Private members
   */
  // TODO: don't forget that all coordinate transformations are done with worldDistanceFactor here!
  private m_Position: Position = Softozor.initialPosition();
  private m_DeltaXW: number = softozorData.originalDeltaXW;
  private m_DeltaXSpeed: number = 0;
  private m_xSpeed: number = softozorData.originalXSpeed;
  private m_ySpeed: number = softozorData.minSpeed;
  private m_FlapWait: number = 0;
  private m_DoFlap: number = false;
  private m_Hitbox: CircularHitBox = new CircularHitBox(this.position, new Position(softozorData.widthW * 0.5,
    softozorData.heightW * 0.65), softozorData.heightW * 0.3);
}