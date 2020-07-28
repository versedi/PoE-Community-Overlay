export default class ItemLocation {
  public left: number
  public top: number
  public width: number
  public height: number
  public stashTabName: string

  constructor(
    stashTabName: string = '',
    left: number = -1,
    top: number = -1,
    width: number = -1,
    height: number = -1
  ) {
    this.left = left
    this.top = top
    this.width = width
    this.height = height
    this.stashTabName = stashTabName
  }
}
