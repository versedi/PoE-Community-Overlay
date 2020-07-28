export default class Price {
  public value: string
  public currency: string
  public image: string

  constructor(value: string, currency: string, image: string = null) {
    this.value = value
    this.currency = currency
    this.image = image
  }
}
