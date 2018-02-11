import axios from 'axios';

import * as SERVER from '../config/server/api.json';

import { objectifyForm } from './Helpers';

export default class ContactFormManager {
  constructor() {
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
    let currentHtml: string = $(this.m_AnchorId).html();
    $(this.m_AnchorId).html(currentHtml + formText);
    $('#contactForm').submit(this.onFormSubmit.bind(this));
  }

  private onFormSubmit(): Boolean {
    console.log('Submitting contact data');
    $('#contactForm').hide();
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
  }

  private onFormSubmitFailure(err: string): void {
    $('#contactForm').show();
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

  private m_AnchorId: string = '#contactForm';
}

/**
 * Non-member methods
 */
