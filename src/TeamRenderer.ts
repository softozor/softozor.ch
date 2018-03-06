import * as team from '../assets/team/team.json';
import * as memberTemplate from './templates/TeamMembers.pug';

export default class TeamRenderer {
  constructor() {
    this.showTeam('div#teamContent');
    this.hideTabs();
    $('.vignette .tab-image').click(e => {
      e.preventDefault();
      this.toggle(e.target);
    });
    $('.cv .close').click(e => {
      e.preventDefault();
      this.closeCurrentTab(e.target);
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

  private hideTabs(): void {
    $('.career').hide();
    $('.education').hide();
    $('.achievements').hide();
  }

  private reduceAll(): void {
    $('.career').slideUp(this.m_SlideTimer);
    $('.education').slideUp(this.m_SlideTimer);
    $('.achievements').slideUp(this.m_SlideTimer);
  }

  private closeCurrentTab(elem: HTMLElement): void {
    $(elem)
      .parent()
      .slideUp(this.m_SlideTimer);
    $('.vignette').slideDown(this.m_SlideTimer);
  }

  private toggle(elem: HTMLElement): void {
    let parentVignette: JQuery<HTMLElement> = $(elem).closest('.vignette');
    let tab: JQuery<HTMLElement> | undefined;

    switch (elem.className) {
    case 'career-image':
      {
        tab = parentVignette.next('.cv').children('.career');
      }
      break;
    case 'education-image':
      {
        tab = parentVignette.next('.cv').children('.education');
      }
      break;
    case 'achievements-image':
      {
        tab = parentVignette.next('.cv').children('.achievements');
      }
      break;
    default:
      console.log('Unsupported element');
      return;
    }

    this.reduceAll();

    if (tab !== undefined) {
      if (tab.is(':visible')) {
        tab.slideUp(this.m_SlideTimer);
        parentVignette.siblings('.vignette').slideDown(this.m_SlideTimer);
      } else {
        tab.slideDown(this.m_SlideTimer);
        parentVignette.siblings('.vignette').slideUp(this.m_SlideTimer);
      }
    }
  }

  /**
   * Private members
   */
  private m_SlideTimer: number = 500;
}
