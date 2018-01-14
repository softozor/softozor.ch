export default class Vector2D {
  constructor(private m_X: number = 0, private m_Y: number = 0) {}
  /**
   * Public methods
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

  times(factor: number): Vector2D {
    return new Vector2D(this.x * factor, this.y * factor);
  }

  /**
   * Global operations on the class
   */
  static plus(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  }

  static minus(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
  }
}
