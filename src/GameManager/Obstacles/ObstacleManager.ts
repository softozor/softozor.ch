import { remove, forEach } from 'lodash';
import { VoidSyncEvent } from 'ts-events';

import ObstacleFactory from './ObstacleFactory';
import Vector2D from '../Math/Vector2D';
import Obstacle from './Obstacle';
import Canvas from '../Canvas/Canvas';
import Softozor from '../Softozor/Softozor';
import Collision from '../Collision';
import BadBubble from './BadBubble';
import GoodBubble from './GoodBubble';
import CoordinatesAdapter, {
  setMovingObject
} from '../Math/CoordinatesAdapter';

type GoodScoreHandler = () => void;
type BadScoreHandler = () => void;

// TODO: may need a reference to the Softozor object; this can also be entered as argument to the functions of this class
// TODO: upon setting the gameState to over, disconnect the tick method, i.e. don't trigger it any more!
// TODO: upon setting the gameState to on, connect the Softozor::tick method
export default class ObstacleManager {
  // TODO: must be called with movingObjectInitialX = softozorData.startPosition
  // TODO: m_BannerHeight is not really banner height (see bandProto::refreshSize); we need band[0].spriteRenderer.heightW
  constructor(
    private readonly m_Canvas: Canvas,
    private readonly m_BannerHeight: number
  ) {}

  /**
   * Public methods
   */
  public clear(): void {
    this.m_Obstacles.length = 0;
  }

  public setMovingObject(movingObject: Softozor): void {
    this.m_MovingObject = movingObject;
    this.m_LastFilledSquareXW =
      ObstacleManager.FIRST_FILLED_SQUARE_DISTANCE +
      CoordinatesAdapter.scrollingPosition().x;
  }

  public attachGoodScoreHandler(callback: GoodScoreHandler): void {
    this.m_GoodScoreEvent.attach(callback);
  }

  public attachBadScoreHandler(callback: BadScoreHandler): void {
    this.m_BadScoreEvent.attach(callback);
  }

  public tick(): void {
    this.cleanup();
    this.fillWorldSquare();
    this.tickObstacles();
    // TODO: it would probably make more sense to call cleanup() here
  }

  /**
   *  fill image of bubbles
   */
  public fillWorldSquare(): void {
    while (this.mustFill()) {
      this.fillSquareWithBadBubbles();
      this.fillSquareWithGoodBubbles();
      this.m_LastFilledSquareXW += this.m_BannerHeight;
    }
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
    let collision: Collision | undefined = this.m_MovingObject.collide(
      obstacle
    );
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
    this.m_MovingObject.handleBadCollision(collision);
    this.m_BadScoreEvent.post();
  }

  private handleCollisionWithGoodBubble(collision: Collision): void {
    this.m_GoodScoreEvent.post();
  }

  private fillSquareWithBadBubbles(): void {
    for (
      let fillIndex: number = 0;
      fillIndex < ObstacleManager.BAD_BUBBLE_PER_SQUARE;
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
      fillIndex < ObstacleManager.GOOD_BUBBLE_PER_SQUARE;
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
      Math.random() * this.m_BannerHeight + this.m_LastFilledSquareXW;
    let y: number = approachCenter(approachCenter(Math.random())) * 90 - 5;
    return new Vector2D(x, y);
  }

  private badBubblePosition(): Vector2D {
    let x: number =
      Math.random() * this.m_BannerHeight + this.m_LastFilledSquareXW;
    let y: number =
      approachExtrema01(approachExtrema01(Math.random())) * 90 - 5;
    return new Vector2D(x, y);
  }

  private cleanup(): void {
    let scrollX: number = CoordinatesAdapter.scrollingPosition().x;
    remove(
      this.m_Obstacles,
      (element: Obstacle): Boolean =>
        element.isOutOfBounds(scrollX) || element.hasCollided
    );
  }

  private bubbleDiameter(): number {
    return 10 + Math.random() * 20;
  }

  private mustFill(): Boolean {
    let scrollX: number = CoordinatesAdapter.scrollingPosition().x;
    return (
      this.m_LastFilledSquareXW <
      scrollX +
        this.m_Canvas.width / CoordinatesAdapter.WORLD_BAND_RATIO_TO_BANNER
    );
  }

  /**
   * Private members
   */
  private static readonly BAD_BUBBLE_PER_SQUARE: number = 3; // TODO: put these numbers in a config file!
  private static readonly GOOD_BUBBLE_PER_SQUARE: number = 3;
  private static readonly FIRST_FILLED_SQUARE_DISTANCE: number = 300;

  private m_BadScoreEvent: VoidSyncEvent = new VoidSyncEvent(); // TODO: maybe not necessary; maybe just storing the callback is enough
  private m_GoodScoreEvent: VoidSyncEvent = new VoidSyncEvent();

  private m_MovingObject: Softozor;

  private m_LastFilledSquareXW: number;
  private m_Obstacles: Obstacle[];
}

// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
function approachExtrema01(value: number): number {
  return (3 - 2 * value) * value * value;
}

function approachCenter(value: number): number {
  return ((2 * value - 3) * value + 2) * value;
}
