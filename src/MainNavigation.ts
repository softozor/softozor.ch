import 'jQuery'
import {isUndefined} from 'util'

import { AccordionLoader } from './AccordionLoader.js'
import { ContactLoader } from './ContactLoader.js'

type LoadCallback = () => void;

class MainNavigation {

  constructor() {
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

  private animateMenuLine(): void {
    let width: number = 0;
    $("#navigation > ul").children().each(function (index: number, element: HTMLElement): void {
      let outerWidth: number | undefined = $(element).outerWidth(true);
      if (typeof outerWidth !== 'undefined') {
        width += outerWidth;
      }
    });

    $('#bottomLine').animate({
      width: width + "px"
    }, 4000);
  }

  private setupMenu(): void {
    let me: MainNavigation = this;
    $("nav#navigation a, footer a").click(function () {
      const href: string | undefined = $(this).attr("href");
      let addressValue: string | undefined;
      if (typeof href !== 'undefined') {
        addressValue = href.split("#")[1];
      }

      if (addressValue === "team") {
        me.load(`${addressValue}.html`, function () {
          AccordionLoader.showTeam("teamContent");
        });
      } else if (addressValue === "contact") {
        me.load(`${addressValue}.html`, function () {
          ContactLoader.showForm("contactForm");
        });
      } else if (typeof addressValue !== 'undefined') {
        me.load(`${addressValue}.html`);
      }
    });
  }

}

$(document).ready(function () {
  let mainNav: MainNavigation = new MainNavigation();
});