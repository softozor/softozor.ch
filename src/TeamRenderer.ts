import * as team from '../assets/team/team.json';
import * as memberTemplate from './templates/TeamMembers.pug';

export default class TeamRenderer {
  constructor() {
    this.showTeam('div#teamContent');
    $('.vignette .tab-image').click(e => {
      e.preventDefault();
      this.toggle(e.target);
    });
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
  private reduceAll(): void {
    $('.career').slideUp(1000);
    $('.education').slideUp(1000);
    $('.achievements').slideUp(1000);
  }

  private toggle(elem: HTMLElement): void {
    let parentVignette: JQuery<HTMLElement> = $(elem).closest('.vignette');
    let tab: JQuery<HTMLElement> | undefined;

    switch (elem.className) {
    case 'career-image':
      {
        tab = parentVignette.next('.career');
      }
      break;
    case 'education-image':
      {
        tab = parentVignette.next('.education');
      }
      break;
    case 'achievements-image':
      {
        tab = parentVignette.next('.achievements');
      }
      break;
    default:
      console.log('Unsupported element');
      return;
    }

    this.reduceAll();

    if (tab !== undefined) {
      if (tab.is(':visible')) {
        tab.slideUp(1000);
        parentVignette.siblings('.vignette').slideDown(500);
      } else {
        tab.slideDown(1000);
        parentVignette.siblings('.vignette').slideUp(500);
      }
    }
  }

  /**
   * Private members
   */
}
