import { isUndefined } from 'util';

type LoadCallback = () => void;

export default class MainNavigationManager {
  constructor() {
    this.animateMenuLine();
    this.setupMenu();
  }

  /**
   * Public methods
   */
  public set LineAnimationDuration(value: number) {
    this.m_LineAnimationDuration = value;
  }

  public get LineAnimationDuration(): number {
    return this.m_LineAnimationDuration;
  }

  /**
   * Private methods
   */
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
    $('nav#navigation a, footer a').click(e => {
      e.preventDefault();
      this.onClick(e.target);
    });
  }

  /**
   * Private members
   */
  private m_LineAnimationDuration: number = 4000; // in [ms]
}
