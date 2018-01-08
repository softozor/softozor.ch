import Canvas from './Canvas';
import BandRenderer from './SpriteRenderers/BandRenderer';
import Sprite from './SpriteRenderers/Sprite';

import { map, forEach } from 'lodash';

import SKY_IMG from '../../assets/banner/sky.png';
import CLOUDS_IMG from '../../assets/banner/clouds.png';
import BACK_IMG from '../../assets/banner/back.png';
import MID_IMG from '../../assets/banner/mid.png';
import FRONT_IMG from '../../assets/banner/front.png';
import WORLD_BAND_IMG from '../../assets/banner/worldBand.png';

export default class ParallaxManager {
  constructor(private readonly m_Canvas: Canvas) {
    this.m_BandRenderers = map(ParallaxManager.BANDS, element => {
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
   * Public members
   */
  public tick(): void {
    // TODO: refactor BandRenderers::tick and put that here
    forEach(this.m_BandRenderers, element => element.tick());
  }

  /**
   * Private members
   */
  private static BANDS: { sprite: Sprite; distanceFactor: number }[] = [
    // The order here is important as this is the order in which the bands are rendered
    { sprite: new Sprite(SKY_IMG), distanceFactor: Infinity },
    { sprite: new Sprite(CLOUDS_IMG), distanceFactor: 16 },
    { sprite: new Sprite(BACK_IMG), distanceFactor: 8 },
    { sprite: new Sprite(MID_IMG), distanceFactor: 4 },
    { sprite: new Sprite(FRONT_IMG), distanceFactor: 2 },
    { sprite: new Sprite(WORLD_BAND_IMG), distanceFactor: 1 }
  ];

  private m_BandRenderers: BandRenderer[];
}
