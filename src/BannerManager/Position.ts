// TODO: maybe rename this Vector2D
export default class Position {
  constructor(private m_X: number = 0, private m_Y: number = 0) {}
  /**
   * getters / setters
   */
  get x(): number {
    return this.m_X;
  }

  set x(value: number) {
    this.m_X = value;
  }

  get y(): number {
    return this.m_Y;
  }

  set y(value: number) {
    this.m_Y = value;
  }

  /**
   * Public methods
   */
  times(factor: number): Position {
    return new Position(this.x * factor, this.y * factor);
  }

  /**
   * Global operations on the class
   */
  static plus(v1: Position, v2: Position): Position {
    return new Position(v1.x + v2.x, v1.y + v2.y);
  }

  static minus(v1: Position, v2: Position): Position {
    return new Position(v1.x - v2.x, v1.y - v2.y);
  }
}
