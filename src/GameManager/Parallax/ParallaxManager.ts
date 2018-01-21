import { map, forEach } from 'lodash';

import SKY_IMG from '../../../assets/banner/sky.png';
import CLOUDS_IMG from '../../../assets/banner/clouds.png';
import BACK_IMG from '../../../assets/banner/back.png';
import MID_IMG from '../../../assets/banner/mid.png';
import FRONT_IMG from '../../../assets/banner/front.png';
import WORLD_BAND_IMG from '../../../assets/banner/worldBand.png';

import Canvas from '../Canvas/Canvas';
import BandRenderer from './BandRenderer';
import Sprite from '../SpriteRenderers/Sprite';
import Vector2D from '../Math/Vector2D';
import * as CoordinatesAdapter from '../Math/CoordinatesAdapter';

type SpriteList = { sprite: Sprite; distanceFactor: number }[];

export default class ParallaxManager {
  constructor(private readonly m_Canvas: Canvas) {
    const bands: SpriteList = sprites();
    this.m_BandRenderers = map(bands, element => {
      return new BandRenderer(
        this.m_Canvas,
        2000,
        200,
        element.sprite,
        element.distanceFactor
      );
    });
  }

  /**
   * Public methods
   */
  public tick(): void {
    forEach(this.m_BandRenderers, element => this.renderBand(element));
  }

  /**
   * Private methods
   */
  private renderBand(bandRenderer: BandRenderer): void {
    let distFact: number = bandRenderer.distanceFactor;
    let origin: Vector2D = new Vector2D(0, 0);
    let pos0PX: Vector2D = CoordinatesAdapter.obsPX(origin, distFact);
    while (pos0PX.x <= this.m_Canvas.width) {
      bandRenderer.draw(pos0PX);
      pos0PX.x += bandRenderer.widthPX;
    }
  }

  /**
   * Private members
   */
  private m_BandRenderers: BandRenderer[];
}

/**
 * Helpers
 */
function sprites(): SpriteList {
  return [
    // The order here is important as this is the order in which the bands are rendered
    { sprite: new Sprite(SKY_IMG), distanceFactor: Infinity },
    { sprite: new Sprite(CLOUDS_IMG), distanceFactor: 16 },
    { sprite: new Sprite(BACK_IMG), distanceFactor: 8 },
    { sprite: new Sprite(MID_IMG), distanceFactor: 4 },
    { sprite: new Sprite(FRONT_IMG), distanceFactor: 2 },
    { sprite: new Sprite(WORLD_BAND_IMG), distanceFactor: 1 }
  ];
}
