import { detect, BrowserName } from 'detect-browser';

export default class BrowserWarningRenderer {
  constructor() {
    let browser: null | {
      name: BrowserName | 'node';
      version: string;
      os: string;
      } = detect();
    if (browser && browser.name === 'ie') {
      $('#browserWarning').show();
    }
    $('#browserWarning .close').click(event => $('#browserWarning').hide());
  }

  /**
   * Public methods
   */

  /**
   * Private methods
   */

  /**
   * Private members
   */
}
