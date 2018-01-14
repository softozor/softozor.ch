import Vector2D from './Vector2D';

export default class Collision {
  constructor(
    private readonly m_CenterW: Vector2D = new Vector2D(0, 0),
    private readonly m_HitW: Vector2D = new Vector2D(0, 0)
  ) {}

  get centerW(): Vector2D {
    return this.m_CenterW;
  }

  get hitW(): Vector2D {
    return this.m_HitW;
  }
}
