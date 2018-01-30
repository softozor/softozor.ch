export default class Size {
  constructor(private m_Width: number = 0, private m_Height: number = 0) {}

  /**
   * Public methods
   */
  public get width(): number {
    return this.m_Width;
  }

  public set width(value: number) {
    this.m_Width = value;
  }

  public get height(): number {
    return this.m_Height;
  }

  public set height(value: number) {
    this.m_Height = value;
  }

  times(factor: number): Size {
    return new Size(this.width * factor, this.height * factor);
  }
}
