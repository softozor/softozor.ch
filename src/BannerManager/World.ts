import Vector2D from './Vector2D';

export default class World {
  constructor(startPos: number, maxYW: number) {
    this.m_ScrollingPosition = new Vector2D(
      startPos,
      (this.WORLD_BAND_RATIO_TO_BANNER - 1) *
        maxYW /
        this.WORLD_BAND_RATIO_TO_BANNER
    );
  }

  /**
   * Public methods
   */
  public get scrollingPos(): Vector2D {
    return this.m_ScrollingPosition;
  }

  /**
   * Private members
   */
  private readonly WORLD_DISTANCE_FACTOR = 1;
  private readonly WORLD_BAND_RATIO_TO_BANNER = 2;
  private readonly WORLD_BAND_INDEX = 0;

  private m_ScrollingPosition: Vector2D;
}
