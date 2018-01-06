import Position from './Position';

export default class World {
  constructor(startPos: number, maxYW: number) {
    this.m_ScrollingPosition = new Position(
      startPos,
      (this.WORLD_BAND_RATIO_TO_BANNER - 1) *
        maxYW /
        this.WORLD_BAND_RATIO_TO_BANNER
    );
  }

  /**
   * Getters / setters
   */
  get scrollingPos(): Position {
    return this.m_ScrollingPosition;
  }

  /**
   * Private members
   */
  private readonly WORLD_DISTANCE_FACTOR = 1;
  private readonly WORLD_BAND_RATIO_TO_BANNER = 2;
  private readonly WORLD_BAND_INDEX = 0;

  private m_ScrollingPosition: Position;
}
