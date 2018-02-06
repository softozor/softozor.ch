import axios from 'axios';

import * as SERVER from '../config/server/api.json';

export default class ContactFormManager {
  constructor(private readonly m_AnchorId: string) {
    this.showForm();
  }

  /**
   * Public methods
   */

  /**
   * Private methods
   */
  private showForm(): void {
    axios
      .get<string>(`${this.m_ServerAddr}/getContactForm.php?&lang=en`)
      .then(res => this.displayForm(res.data))
      .catch(error => console.log('Connection to server failed: ' + error));
  }

  private displayForm(formText: string): void {
    $(this.m_AnchorId).html(formText);
    $('.contactForm button').click(() =>
      console.log('click: ' + $('.contactForm').serializeArray())
    );
    // TODO: jsonify the form and send the json data to the server
    // TODO: on the server, parse the json file and send the e-mail (or not ...)
    // TODO: on the server, send the response (either fail or success)
  }

  /**
   * Private members
   */
  private m_ServerAddr: string = (<any>SERVER).server;
}
