import { Position } from './Position';

export class Collision {
  constructor(
    private readonly m_CenterW: Position = new Position(0, 0),
    private readonly m_HitW: Position = new Position(0, 0)
  ) {}

  get centerW(): Position {
    return this.m_CenterW;
  }

  get hitW(): Position {
    return this.m_HitW;
  }
}
