import Price from './Price'

export default class Offer {
  public buyerName: string
  public itemName: string
  public price: Price
  public time: string
  public buyerJoined = false
  public partyInviteSent = false
  public tradeRequestSent = false

  constructor(buyerName: string, itemName: string, price: Price, time: string) {
    this.buyerName = buyerName
    this.itemName = itemName
    this.price = price
    this.time = time
  }
}
