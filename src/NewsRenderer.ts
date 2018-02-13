import * as data from '../assets/news/news.json';
import * as template from './templates/NewsElement.pug';

export default class TeamRenderer {
  constructor() {
    this.show('div#newsContent');
  }

  /**
   * Public methods
   */
  public show(elementId: string): void {
    let html: string = template({ News: data });
    $(elementId).html(html);
  }

  /**
   * Private methods
   */

  /**
   * Private members
   */
}
