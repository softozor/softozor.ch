import axios from 'axios';
import { VoidSyncEvent } from 'ts-events';

import * as SERVER from '../../config/server/api.json';

import { objectifyForm } from '../Helpers';
import ScoreManager from './ScoreManager/ScoreManager';

type PublishHandler = () => void;

export default class HighScoresDialog {
  constructor(private readonly m_ScoreMgr: ScoreManager) {
    this.connectHandlers();
  }

  /**
   * Public methods
   */
  public reset(): void {
    this.m_WasOpened = false;
  }

  public open(): void {
    if (!this.m_WasOpened) {
      $('#scoreForm').show();
      this.m_WasOpened = true;
    }
  }

  public attachPublishHandler(callback: PublishHandler): void {
    this.m_PublishHandler.attach(callback);
  }

  /**
   * Private methods
   */
  private connectHandlers(): void {
    $('#scoreForm .close').click(this.onClose.bind(this));
    $('#scoreForm form').submit(this.publishScore.bind(this));
  }

  private onClose(): void {
    $('#scoreForm').hide();
  }

  private publishScore(): Boolean {
    console.log('Publishing score...');
    let formObject: { [key: string]: string } = objectifyForm(
      $('#scoreForm form').serializeArray()
    );
    formObject.score = String(this.m_ScoreMgr.score);
    axios
      .post(`${this.SERVER}/${this.PUBLISH_API}/`, formObject)
      .then(this.onFormSubmitSuccess.bind(this))
      .catch((err: string): void => this.onFormSubmitFailure(err));
    return false;
  }

  private onFormSubmitSuccess(): void {
    console.log('Score successfully published');
    this.onClose();
    this.m_PublishHandler.post();
  }

  private onFormSubmitFailure(err: string): void {
    console.log('Failed submitting the scores: ' + err);
  }

  /**
   * Private members
   */
  private readonly SERVER: string = (<any>SERVER).server;
  private readonly PUBLISH_API: string = (<any>SERVER).api.publishScore;

  private readonly m_PublishHandler: VoidSyncEvent = new VoidSyncEvent();
  private m_WasOpened: Boolean = false;
}
