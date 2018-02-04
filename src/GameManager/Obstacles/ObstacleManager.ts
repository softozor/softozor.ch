import { remove, forEach } from 'lodash';
import { VoidSyncEvent } from 'ts-events';

import * as SoftozorData from '../../../config/game/SoftozorData.json';
import * as CONSTANTS from '../../../config/game/Constants.json';
import * as CONFIG from '../../../config/game/Obstacles.json';

import ObstacleFactory from './ObstacleFactory';
import Vector2D from '../Math/Vector2D';
import Obstacle from './Obstacle';
import Canvas from '../Canvas/Canvas';
import Collision from '../Collision';
import BadBubble from './BadBubble';
import GoodBubble from './GoodBubble';
import * as MovingCoordinateSystem from '../Math/MovingCoordinateSystem';
import MovingObject from '../MovingObject';
import ManagerState from './ManagerStates/ManagerState';
import GameOnState from './ManagerStates/GameOnState';
import GameOverState from './ManagerStates/GameOverState';

type GoodScoreHandler = () => void;
type BadScoreHandler = () => void;

export default class ObstacleManager {
  constructor(private readonly m_Canvas: Canvas) {}

  /**
   * Public methods
   */
  public attachGoodScoreHandler(callback: GoodScoreHandler): void {
    this.m_GoodScoreEvent.attach(callback);
  }

  public attachBadScoreHandler(callback: BadScoreHandler): void {
    this.m_BadScoreEvent.attach(callback);
  }

  public tick(): void {
    this.m_CurrentState.tick();
  }

  public doTick(): void {
    this.fillWorldSquare();
    this.tickObstacles();
    this.cleanup();
  }

  public clear(): void {
    if (this.m_Obstacles !== undefined) {
      this.m_Obstacles.length = 0;
    }
    this.m_LastFilledSquareXW = initLastFilledSquare();
  }

  /**
   *  fill image of bubbles
   */
  public fillWorldSquare(): void {
    while (this.mustFill()) {
      this.fillSquareWithBadBubbles();
      this.fillSquareWithGoodBubbles();
      this.m_LastFilledSquareXW += (<any>CONSTANTS).BannerUnit;
    }
  }

  public render(): void {
    forEach(this.m_Obstacles, (element: Obstacle): void => {
      element.render();
    });
  }

  public setGameOverState(): void {
    this.switchState(this.m_States.gameOver);
  }

  public setGameOnState(): void {
    this.switchState(this.m_States.gameOn);
  }

  /**
   * Private methods
   */
  private tickObstacles(): void {
    forEach(this.m_Obstacles, (element: Obstacle): void => {
      element.tick();
      this.handleCollision(element);
    });
  }

  private handleCollision(obstacle: Obstacle): void {
    let collision: Collision | undefined = movingObject().collide(obstacle);
    if (collision != undefined) {
      if (obstacle instanceof BadBubble) {
        this.handleCollisionWithBadBubble(collision);
      } else if (obstacle instanceof GoodBubble) {
        this.handleCollisionWithGoodBubble(collision);
      } else {
        console.log('Collision not supported.');
      }
    }
  }

  private handleCollisionWithBadBubble(collision: Collision): void {
    movingObject().handleBadCollision(collision);
    this.m_BadScoreEvent.post();
  }

  private handleCollisionWithGoodBubble(collision: Collision): void {
    this.m_GoodScoreEvent.post();
  }

  private fillSquareWithBadBubbles(): void {
    for (
      let fillIndex: number = 0;
      fillIndex < (<any>CONFIG).badBubblePerSquare;
      ++fillIndex
    ) {
      let bubble: Obstacle = ObstacleFactory.createBadBubble(
        this.m_Canvas,
        this.badBubblePosition(),
        this.bubbleDiameter()
      );
      this.m_Obstacles.push(bubble);
    }
  }

  private fillSquareWithGoodBubbles(): void {
    for (
      let fillIndex: number = 0;
      fillIndex < (<any>CONFIG).goodBubblePerSquare;
      ++fillIndex
    ) {
      let bubble: Obstacle = ObstacleFactory.createGoodBubble(
        this.m_Canvas,
        this.goodBubblePosition(),
        this.bubbleDiameter()
      );
      this.m_Obstacles.push(bubble);
    }
  }

  private goodBubblePosition(): Vector2D {
    let x: number =
      Math.random() * (<any>CONSTANTS).BannerUnit + this.m_LastFilledSquareXW;
    let param1: number = (<any>CONFIG).bubblePosition.param1;
    let param2: number = (<any>CONFIG).bubblePosition.param2;
    let y: number =
      approachCenter(approachCenter(Math.random())) * param1 - param2;
    return new Vector2D(x, y);
  }

  private badBubblePosition(): Vector2D {
    let x: number =
      Math.random() * (<any>CONSTANTS).BannerUnit + this.m_LastFilledSquareXW;
    let param1: number = (<any>CONFIG).bubblePosition.param1;
    let param2: number = (<any>CONFIG).bubblePosition.param2;
    let y: number =
      approachExtrema01(approachExtrema01(Math.random())) * param1 - param2;
    return new Vector2D(x, y);
  }

  private cleanup(): void {
    remove(
      this.m_Obstacles,
      (element: Obstacle): Boolean =>
        element.isOutOfBounds || element.hasCollided
    );
  }

  private bubbleDiameter(): number {
    let param1: number = (<any>CONFIG).bubbleDiameter.param1;
    let param2: number = (<any>CONFIG).bubbleDiameter.param2;
    return param1 + Math.random() * param2;
  }

  private mustFill(): Boolean {
    let scrollX: number = MovingCoordinateSystem.scrollingPosition().x;
    let ratio: number = (<any>CONSTANTS).WorldBandRatioToBanner;
    return this.m_LastFilledSquareXW < scrollX + this.m_Canvas.width / ratio;
  }

  private switchState(target: ManagerState): void {
    if (target === this.m_CurrentState) {
      return;
    }
    this.m_CurrentState.exit();
    this.m_CurrentState = target;
    this.m_CurrentState.enter();
  }

  /**
   * Private members
   */
  private m_States: { [key: string]: ManagerState } = {
    gameOn: new GameOnState(this),
    gameOver: new GameOverState(this)
  };
  private m_CurrentState: ManagerState = this.m_States.gameOver;
  private m_BadScoreEvent: VoidSyncEvent = new VoidSyncEvent(); // TODO: maybe not necessary; maybe just storing the callback is enough
  private m_GoodScoreEvent: VoidSyncEvent = new VoidSyncEvent();

  private m_LastFilledSquareXW: number = initLastFilledSquare();
  private m_Obstacles: Obstacle[] = new Array<Obstacle>();
}

/**
 * Non-member methods
 */
function initLastFilledSquare(): number {
  return (
    (<any>CONFIG).firstFilledSquareDistance + (<any>SoftozorData).startPosition
  );
}

// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
function approachExtrema01(value: number): number {
  return (3 - 2 * value) * value * value;
}

function approachCenter(value: number): number {
  return ((2 * value - 3) * value + 2) * value;
}

function movingObject(): MovingObject {
  return MovingCoordinateSystem.movingObject();
}
