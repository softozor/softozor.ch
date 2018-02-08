import * as focus from '../assets/focus/focus.json';
import * as focusTemplate from './templates/FocusElements.pug';

export default class FocusRenderer {
  constructor() {
    this.show('div#focusContent');
  }

  /**
   * Public methods
   */
  public show(elementId: string): void {
    let html: string = focusTemplate({ FocusElements: focus });
    $(elementId).html(html);
  }

  /**
   * Private methods
   */

  /**
   * Private members
   */
}
