import Price from './Price'
import ItemLocation from './ItemLocation'

export default class Offer {
  public buyerName: string
  public itemName: string
  public price: Price
  public time: string
  public buyerJoined = false
  public partyInviteSent = false
  public tradeRequestSent = false
  public itemLocation: ItemLocation

  constructor(
    buyerName: string,
    itemName: string,
    price: Price,
    time: string,
    itemLocation: ItemLocation
  ) {
    this.buyerName = buyerName
    this.itemName = itemName
    this.price = price
    this.time = time
    this.itemLocation = itemLocation
  }
}
