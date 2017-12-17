import 'jQuery'
import {isUndefined} from 'util'

import { AccordionLoader } from './AccordionLoader.js'
import { ContactLoader } from './ContactLoader.js'

type LoadCallback = () => void;

export class MainNavigationManager {

  private m_LineAnimationDuration: number = 4000; // in [ms] 

  constructor() { }

  set LineAnimationDuration(value: number) {
    this.m_LineAnimationDuration = value;
  }

  get LineAnimationDuration() {
    return this.m_LineAnimationDuration;
  }

  public onDocumentReady(): void {
    this.animateMenuLine();
    this.setupMenu();
  }

  private load(file: string, callback?: LoadCallback): void {
    if (!isUndefined(callback)) {
      $("#content").load(file, callback);
    } else {
      $("#content").load(file);
    }
  }

  private menuWidth(): number {
    let width: number = 0;
    $("#navigation > ul").children().each(function (index: number, element: HTMLElement): void {
      let outerWidth: number | undefined = $(element).outerWidth(true);
      if (typeof outerWidth !== 'undefined') {
        width += outerWidth;
      }
    });
    return width;
  }

  /**
   * draws a line from right to left below the horizontal menu entries
   */
  private animateMenuLine(): void {
    let menuWidth: number = this.menuWidth();
    let animDuration: number = this.LineAnimationDuration;
    $('#bottomLine').animate({
      width: menuWidth + "px"
    }, animDuration);
  }

  private menuName(elem : HTMLElement) : string | undefined {
    const href: string | undefined = $(elem).attr("href");
    if (typeof href !== 'undefined') {
      return href.split("#")[1];
    }
    return undefined;
  }

  private onClick(elem: HTMLElement): void {
    let menuName: string | undefined = this.menuName(elem);

    if (menuName === "team") {
      this.load(`${menuName}.html`, function () {
        AccordionLoader.showTeam("teamContent");
      });
    } else if (menuName === "contact") {
      this.load(`${menuName}.html`, function () {
        ContactLoader.showForm("contactForm");
      });
    } else if (typeof menuName !== 'undefined') {
      this.load(`${menuName}.html`);
    }
  }

  private setupMenu(): void {
    $("nav#navigation a, footer a").click(e => this.onClick(e.target));
  }

}