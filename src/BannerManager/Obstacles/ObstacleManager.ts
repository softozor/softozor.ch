import ObstacleFactory from './ObstacleFactory';
import Position from '../Position';
import Obstacle from './Obstacle';
import Canvas from '../Canvas';

import { remove } from 'lodash';

// TODO: may need a reference to the Softozor object; this can also be entered as argument to the functions of this class
export default class ObstacleManager {
  // TODO: must be called with movingObjectInitialX = softozorData.startPosition
  // TODO: m_BannerHeight is not really banner height (see bandProto::refreshSize); we need band[0].spriteRenderer.heightW
  constructor(
    private m_Canvas: Canvas,
    movingObjectInitialX: number,
    private readonly m_BannerHeight: number
  ) {
    this.m_LastFilledSquareXW =
      ObstacleManager.FIRST_FILLED_SQUARE_DISTANCE + movingObjectInitialX;
  }

  /**
   * Public methods
   */

  public reinitialize(): void {
    // TODO: see the Banner::reinitialize method
    console.log('To be implemented');
  }

  public restart(): void {
    // TODO: see the Banner::restart method
    console.log('To be implemented');
  }

  public update(): void {
    this.cleanup();
    this.fillWorldSquare();
  }

  /**
   *  fill image of bubbles
   */
  public fillWorldSquare(): void {
    while (banner.gameState === 'on' && this.mustFill()) {
      this.fillSquareWithBadBubbles();
      this.fillSquareWithGoodBubbles();
      this.m_LastFilledSquareXW += this.m_BannerHeight;
    }
  }

  /**
   * Private methods
   */
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

  private goodBubblePosition(): Position {
    let x: number =
      Math.random() * this.m_BannerHeight + this.m_LastFilledSquareXW;
    let y: number = approachCenter(approachCenter(Math.random())) * 90 - 5;
    return new Position(x, y);
  }

  private badBubblePosition(): Position {
    let x: number =
      Math.random() * this.m_BannerHeight + this.m_LastFilledSquareXW;
    let y: number =
      approachExtrema01(approachExtrema01(Math.random())) * 90 - 5;
    return new Position(x, y);
  }

  private cleanup(): void {
    remove(
      this.m_Obstacles,
      (element: Obstacle): Boolean =>
        element.isOutOfBounds(scrollingPosition.xW) || element.hasCollided
    );
  }

  private bubbleDiameter(): number {
    return 10 + Math.random() * 20;
  }

  private mustFill(): Boolean {
    return (
      this.m_LastFilledSquareXW <
      scrollingPosition.xW + this.m_Canvas.widthPX / worldBandRatioToBanner
    );
  }

  /**
   * Private members
   */
  private static readonly BAD_BUBBLE_PER_SQUARE: number = 3;
  private static readonly GOOD_BUBBLE_PER_SQUARE: number = 3;
  private static readonly FIRST_FILLED_SQUARE_DISTANCE: number = 300;

  private m_LastFilledSquareXW: number;
  private m_Obstacles: Obstacle[] = [];
}

// stretches a value between 0 and 1 to 0 or 1, symetric relative to 0.5
function approachExtrema01(value: number): number {
  return (3 - 2 * value) * value * value;
}

function approachCenter(value: number): number {
  return ((2 * value - 3) * value + 2) * value;
}
