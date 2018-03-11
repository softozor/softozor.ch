import axios from 'axios';

import * as SERVER from '../config/server/api.json';
import * as scoresTemplate from './templates/ScoresTable.pug';

type ScoreData = { username: string; score: string }[];

export default class HighScoresRenderer {
  constructor() {
    this.bindMouseClick();

    $(`${this.ELEMENT} table`).hide();
    this.refreshScores();
  }

  /**
   * Public methods
   */
  public refreshScores(): void {
    console.log('Refresh scores!');
    axios
      .get(`${this.SERVER}/${this.GET_API}/`)
      .then(res => this.fillScores(res.data))
      .catch(error => console.log('Connection to server failed: ' + error));
  }

  /**
   * Private methods
   */
  private bindMouseClick(): void {
    $(`${this.ELEMENT} a`).click(this.onMouseClick.bind(this));
    $(document).on('click touchstart', this.onMouseClickOutside.bind(this));
  }

  private unbindMouseClick(): void {
    $(`${this.ELEMENT} a`).unbind('click');
    $(document).unbind('click touchstart');
  }

  private onMouseClickOutside(event): void {
    if (!$(event.target).closest(this.ELEMENT).length) {
      if ($(this.ELEMENT).is(':visible')) {
        if (!this.m_Collapsed) {
          this.unbindMouseClick();
          this.collapse(event);
        }
      }
    }
  }

  private onMouseClick(event): void {
    this.unbindMouseClick();
    this.m_Collapsed ? this.expand(event) : this.collapse(event);
  }

  private fillScores(data: ScoreData): void {
    let html: string = '<tr><td colspan=2 align=center>Empty scores</td></tr>';
    if (data.length > 0) {
      html = scoresTemplate({
        Scores: data
      });
    }
    $(`${this.ELEMENT} table`).html(html);
  }

  private computeDH(): string {
    let offset: JQuery.Coordinates | undefined = $(this.ELEMENT).offset();
    let y: number | undefined = offset !== undefined ? offset.top : undefined;
    let h: number | undefined = $(this.ELEMENT).height();
    let wh: number | undefined = $(window).height();
    return h !== undefined && y !== undefined && wh !== undefined
      ? `${wh - (y + h)}px`
      : '0px';
  }

  private expand(event): void {
    if (!this.m_Collapsed) {
      return;
    }
    this.m_Dh = this.computeDH();
    $(this.ELEMENT).addClass('active');
    $(`${this.ELEMENT} table`).show();
    this.onExpand();
  }

  private collapse(event): void {
    if (this.m_Collapsed) {
      return;
    }
    $(this.ELEMENT).removeClass('active');
    this.onCollapse();
  }

  private onExpand(): void {
    this.bindMouseClick();
    this.m_Collapsed = false;
  }

  private onCollapse(): void {
    $(`${this.ELEMENT} table`).slideUp(2000);
    this.bindMouseClick();
    this.m_Collapsed = true;
  }

  /**
   * Private members
   */
  private readonly SERVER: string = (<any>SERVER).server;
  private readonly SET_API: string = (<any>SERVER).api.publishScore;
  private readonly GET_API: string = (<any>SERVER).api.getScores;

  private readonly ELEMENT: string = 'li.highScores';
  private m_Collapsed: Boolean = true;
  private m_Dh: string = '0px';
}
