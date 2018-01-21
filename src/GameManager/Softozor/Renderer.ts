import DynamicSpriteRenderer from '../SpriteRenderers/DynamicSpriteRenderer';
import Sprite from '../SpriteRenderers/Sprite';
import Canvas from '../Canvas/Canvas';
import RendererState from './RendererStates/RendererState';
import IdleState from './RendererStates/IdleState';
import Flap1State from './RendererStates/Flap1State';
import Flap2State from './RendererStates/Flap2State';
import Vector2D from '../Math/Vector2D';

export default class Renderer extends DynamicSpriteRenderer {
  constructor(
    canvas: Canvas,
    widthW: number,
    heightW: number,
    distanceFactor: number
  ) {
    super(canvas, widthW, heightW, undefined, distanceFactor);
  }

  /**
   * Public methods
   */
  public set sprite(value: Sprite) {
    this.m_Sprite = value;
  }

  public setIdleState(): void {
    this.switchState(this.m_States.idle);
  }

  public setFlap1State(): void {
    this.switchState(this.m_States.flap1);
  }

  public setFlap2State(): void {
    this.switchState(this.m_States.flap2);
  }

  /**
   * Private methods
   */
  private switchState(target: RendererState): void {
    this.m_CurrentState.exit();
    this.m_CurrentState = target;
    this.m_CurrentState.enter();
  }

  /**
   * Private members
   */
  private m_States: { [key: string]: RendererState } = {
    idle: new IdleState(this),
    flap1: new Flap1State(this),
    flap2: new Flap2State(this)
  };
  private m_CurrentState: RendererState = this.m_States.idle;
}
