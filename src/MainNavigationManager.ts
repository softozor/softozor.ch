import { isUndefined } from 'util';

type LoadCallback = () => void;

export default class MainNavigationManager {
  private m_LineAnimationDuration: number = 4000; // in [ms]

  constructor() {}

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
      $('#content').load(file, callback);
    } else {
      $('#content').load(file);
    }
  }

  private menuWidth(): number {
    let width: number = 0;
    $('#navigation > ul')
      .children()
      .each(function(index: number, element: HTMLElement): void {
        let outerWidth: number | undefined = $(element).outerWidth(true);
        if (outerWidth !== undefined) {
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
    $('#bottomLine').animate(
      {
        width: menuWidth + 'px'
      },
      animDuration
    );
  }

  private menuName(elem: HTMLElement): string | undefined {
    const href: string | undefined = $(elem).attr('href');
    if (href !== undefined) {
      return href.split('#')[1];
    }
    return undefined;
  }

  private onClick(elem: HTMLElement): void {
    let menuName: string | undefined = this.menuName(elem);
    $(`section#${menuName}`)
      .show()
      .siblings('section')
      .hide();
  }

  private setupMenu(): void {
    $('nav#navigation a, footer a').click(e => this.onClick(e.target));
  }
}
