import * as team from '../assets/team/team.json';
import * as memberTemplate from './templates/TeamMembers.pug';

export default class TeamRenderer {
  constructor() {
    this.showTeam('div#teamContent');
    $('button.accordion').click(e => this.toggle(e.target));
  }

  /**
   * Public methods
   */
  public showTeam(elementId: string): void {
    let html: string = memberTemplate({ Members: team });
    $(elementId).html(html);
  }

  /**
   * Private methods
   */
  private toggle(elem: HTMLElement): void {
    if ($(elem).hasClass('active')) {
      $(elem)
        .removeClass('active')
        .next('.portfolio')
        .css(this.m_DisabledPanelCss);
    } else {
      $('button.accordion')
        .removeClass('active')
        .next('.portfolio')
        .css(this.m_DisabledPanelCss);
      let scrollHeight: number = $(elem)
        .next('.portfolio')
        .prop('scrollHeight');
      $(elem)
        .addClass('active')
        .next('.portfolio')
        .css({
          maxHeight: scrollHeight + 'px',
          borderStyle: 'solid',
          borderWidth: '2px'
        });
    }
  }

  /**
   * Private members
   */
  private m_DisabledPanelCss: { [key: string]: string } = {
    maxHeight: '0',
    borderWidth: '0',
    borderColor: 'white'
  };
}
