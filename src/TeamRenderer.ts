export class TeamRenderer {
  constructor() {
    this.showTeam("div#teamContent");
  }

  public showTeam(elementId): void {
    console.log("To be implemented");
    // TODO: write js code that displays the team from the json file

    var xmlhttp;
    if ((<any>window).XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    let me: TeamRenderer = this;
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        $(elementId).html(this.responseText);
        $("button.accordion").click(e => me.toggle(e.target)); // TODO: we will clearly need a refactoring of this
      }
    };

    const lang = "en";
    xmlhttp.open("GET", "scripts/getTeam.php?lang=" + lang, true);
    xmlhttp.send();
  }

  public onDocumentReady(): void {
    //$("button.accordion").click(e => this.toggle(e.target));
  }

  private toggle(elem: HTMLElement): void {
    if ($(elem).hasClass("active")) {
      $(elem).removeClass("active").next(".portfolio").css(this.m_DisabledPanelCss);
    } else {
      $("button.accordion").removeClass("active").next(".portfolio").css(this.m_DisabledPanelCss);
      let scrollHeight: number = $(elem).next(".portfolio").prop('scrollHeight');
      $(elem).addClass("active").next(".portfolio").css({
        'maxHeight': scrollHeight + 'px',
        'borderStyle': 'solid',
        'borderWidth': '2px'
      });
    }
  }

  private m_DisabledPanelCss: {} = {
    'maxHeight': '0',
    'borderWidth': '0',
    'borderColor': 'white'
  }
}