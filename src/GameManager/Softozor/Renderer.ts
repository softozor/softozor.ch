import * as IDLE_IMG from '../../../assets/banner/softozor.png';
import * as FLAP1_IMG from '../../../assets/banner/softozor_flap1.png';
import * as FLAP2_IMG from '../../../assets/banner/softozor_flap2.png';

import DynamicSpriteRenderer from '../Rendering/DynamicSpriteRenderer';
import Sprite from '../Rendering/Sprite';
import Canvas from '../Canvas/Canvas';
import RendererState from './RendererStates/RendererState';
import IdleState from './RendererStates/IdleState';
import Flap1State from './RendererStates/Flap1State';
import Flap2State from './RendererStates/Flap2State';
import Vector2D from '../Math/Vector2D';
import SpriteListLoader, {
  DistantImgList,
  SpriteList,
  DistantSprite,
  getSpriteWithSrc
} from '../Rendering/SpriteListLoader';

export default class Renderer extends DynamicSpriteRenderer {
  constructor(
    canvas: Canvas,
    widthW: number,
    heightW: number,
    distanceFactor: number
  ) {
    super(canvas, widthW, heightW, distanceFactor);
    const loader: SpriteListLoader = new SpriteListLoader(
      images(),
      this.onSpritesLoaded.bind(this)
    );
  }

  /**
   * Public methods
   */
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
   * Protected methods
   */
  protected get sprite(): Sprite | undefined {
    return this.m_CurrentState !== undefined
      ? this.m_CurrentState.sprite
      : undefined;
  }

  /**
   * Private methods
   */
  private switchState(target: RendererState): void {
    if (this.m_CurrentState === target) {
      return;
    }

    this.m_CurrentState.exit();
    this.m_CurrentState = target;
    this.m_CurrentState.enter();
  }

  private onSpritesLoaded(sprites: SpriteList): void {
    console.log('Softozor loaded');
    this.m_States.idle.load(getSpriteWithSrc(sprites, IDLE_IMG));
    this.m_States.flap1.load(getSpriteWithSrc(sprites, FLAP1_IMG));
    this.m_States.flap2.load(getSpriteWithSrc(sprites, FLAP2_IMG));
  }

  /**
   * Private members
   */
  private m_States: {
    idle: RendererState;
    flap1: RendererState;
    flap2: RendererState;
  } = {
    idle: new RendererState(this),
    flap1: new RendererState(this),
    flap2: new RendererState(this)
  };
  private m_CurrentState: RendererState = this.m_States.idle;
}

/**
 * Non-member methods
 */
function images(): DistantImgList {
  return [
    { imgSrc: IDLE_IMG, distanceFactor: 1 },
    { imgSrc: FLAP1_IMG, distanceFactor: 1 },
    { imgSrc: FLAP2_IMG, distanceFactor: 1 }
  ];
}
