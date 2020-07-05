export default class FloatingButton {
  public label: string
  public onMouseClick: any
  public onMouseHover: any
  public color: string
  public icon: string

  constructor(
    label: string,
    color: string,
    icon: string,
    onMouseClick: any,
    onMouseHover: any = () => null
  ) {
    this.label = label
    this.onMouseClick = onMouseClick
    this.onMouseHover = onMouseHover
    this.color = color
    this.icon = icon
  }
}
