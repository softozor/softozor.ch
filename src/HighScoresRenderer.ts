import axios from 'axios';

import * as SERVER from '../config/server/api.json';
import * as scoresTemplate from './templates/ScoresTable.pug';

type ScoreData = { username: string; score: string }[];

export default class HighScoresRenderer {
  constructor() {
    $('#highScores').click(this.onMouseClick.bind(this));
    $('#highScores table').hide();

    axios
      .get(`${this.SERVER}/${this.GET_API}/`)
      .then(res => this.fillScores(res.data))
      .catch(error => console.log('Connection to server failed: ' + error));
  }

  /**
   * Public methods
   */

  /**
   * Private methods
   */
  private fillScores(data: ScoreData): void {
    let html: string = scoresTemplate({
      Scores: data
    });
    $('#highScores table').html(html);
  }

  private expand(event): void {
    let dh: number | undefined = $('#highScores table').height();
    if (dh !== undefined) {
      $(event.currentTarget).animate(
        {
          height: `+=${dh}px`,
          bottom: `-=${dh}px`
        },
        'slow'
      );
    }
    $('#highScores table').show();
    this.m_Collapsed = false;
  }

  private collapse(event): void {
    let dh: number | undefined = $('#highScores table').height();
    if (dh !== undefined) {
      $(event.currentTarget).animate(
        {
          height: `-=${dh}px`,
          bottom: `+=${dh}px`
        },
        'slow'
      );
    }
    $('#highScores table').hide();
    this.m_Collapsed = true;
  }

  private onMouseClick(event): void {
    this.m_Collapsed ? this.expand(event) : this.collapse(event);
  }

  /**
   * Private members
   */
  private readonly SERVER: string = (<any>SERVER).server;
  private readonly SET_API: string = (<any>SERVER).api.publishScore;
  private readonly GET_API: string = (<any>SERVER).api.getScores;

  private m_Collapsed: Boolean = true;
}
