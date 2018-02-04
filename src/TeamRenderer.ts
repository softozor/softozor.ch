import * as team from '../assets/team/team.json';
import * as memberTemplate from './templates/TeamMember.pug';

export default class TeamRenderer {
  constructor() {
    this.showTeam('div#teamContent');
  }

  public showTeam(elementId): void {
    var html = memberTemplate({ Members: team });
    $('div#teamContent').html(html);
  }

  public onDocumentReady(): void {
    $('button.accordion').click(e => this.toggle(e.target));
  }

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

  private m_DisabledPanelCss: {} = {
    maxHeight: '0',
    borderWidth: '0',
    borderColor: 'white'
  };
}
