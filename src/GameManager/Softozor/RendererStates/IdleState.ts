import * as IMG from '../../../../assets/banner/softozor.png';

import Renderer from '../Renderer';
import Sprite from '../../SpriteRenderers/Sprite';
import RendererState from './RendererState';

export default class IdleState extends RendererState {
  constructor(renderer: Renderer) {
    super(renderer);
    this.m_Sprite.load(IMG, onImgLoaded);
  }
}

/**
 * Non-member methods
 */
function onImgLoaded(): void {
  console.log(`Loaded sprite ${IMG}.`);
}
