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
      .get<string>(`${this.SERVER}/${this.FORM_API}/?&lang=en`)
      .then(res => this.displayForm(res.data))
      .catch(error =>
        this.displayForm('Connection to server failed: ' + error)
      );
  }

  private displayForm(formText: string): void {
    $(this.m_AnchorId).html(formText);
    $('#contactForm').submit(this.onFormSubmit.bind(this));
  }

  private onFormSubmit(): Boolean {
    console.log('Submitting contact data');
    axios
      .post(
        `${this.SERVER}/${this.MAIL_API}/`,
        objectifyForm($('#contactForm').serializeArray())
      )
      .then(this.onFormSubmitSuccess.bind(this))
      .catch((err: string): void => this.onFormSubmitFailure(err));
    return false;
  }

  private onFormSubmitSuccess(): void {
    $('#emailFeedback')
      .removeClass('failure')
      .html('Email successfully sent');
    $('#contactForm button').hide();
  }

  private onFormSubmitFailure(err: string): void {
    $('#emailFeedback')
      .addClass('failure')
      .html('Email could not be sent: ' + err);
  }

  /**
   * Private members
   */
  private readonly SERVER: string = (<any>SERVER).server;
  private readonly FORM_API: string = (<any>SERVER).api.contactForm;
  private readonly MAIL_API: string = (<any>SERVER).api.sendMail;
}

/**
 * Non-member methods
 */
function objectifyForm(array: JQuery.NameValuePair[]) {
  let returnArray: { [key: string]: string } = {};
  for (var i = 0; i < array.length; i++) {
    returnArray[array[i]['name']] = array[i]['value'];
  }
  return returnArray;
}
