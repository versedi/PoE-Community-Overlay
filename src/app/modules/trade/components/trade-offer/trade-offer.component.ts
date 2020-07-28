import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core'
import Offer from '@modules/trade/class/Offer'
import FloatingButton from '@modules/trade/class/FloatingButton'
import { TradeService } from '@modules/trade/services/trade.service'

@Component({
  selector: 'app-trade-offer',
  templateUrl: './trade-offer.component.html',
  styleUrls: ['./trade-offer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeOfferComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Offer to display
   */
  @Input() public offer: Offer

  /**
   * Events related to chat commands and whispers
   */
  @Output() public evIgnoreOffer = new EventEmitter()
  @Output() public evTradeRequest = new EventEmitter()
  @Output() public evPartyInvite = new EventEmitter()
  @Output() public evSoldWhisper = new EventEmitter()
  @Output() public evBusyWhisper = new EventEmitter()
  @Output() public evStillInterestedWhisper = new EventEmitter()
  @Output() public evRemoveOffer = new EventEmitter()
  @Output() public evPartyKick = new EventEmitter()

  /**
   * Floating buttons above the offer tile
   * The buyer haven't been invited yet.
   */
  public preInviteFloatingButtons: FloatingButton[] = [
    new FloatingButton(
      'Invite to party',
      'green',
      'person_add',
      this.sendPartyInvite.bind(this),
      () => null
    ),
    new FloatingButton(
      'Item is sold',
      'orange',
      'money_off',
      this.sendSoldWhisper.bind(this),
      () => null
    ),
    new FloatingButton(
      "I'm busy",
      'blue',
      'event_busy',
      this.sendBusyWhisper.bind(this),
      () => null
    ),
    new FloatingButton(
      'Still interested?',
      'purple',
      'live_help',
      this.sendStillInterestedWhisper.bind(this),
      () => null
    ),
    new FloatingButton('Ignore offer', 'red', 'delete', this.ignoreOffer.bind(this), () => null),
  ]

  /**
   * Floating buttons above the offer tile
   * The buyer have been invited yet.
   */
  public postInviteFloatingButtons: FloatingButton[] = [
    new FloatingButton(
      'Send trade request',
      'green',
      'attach_money',
      this.sendTradeRequest.bind(this),
      () => null
    ),
    new FloatingButton(
      'Invite to party',
      'blue',
      'person_add',
      this.sendPartyInvite.bind(this),
      () => null
    ),
    new FloatingButton(
      'Kick buyer',
      'orange',
      'person_remove',
      this.kickBuyer.bind(this),
      () => null
    ),
    new FloatingButton('Remove offer', 'red', 'delete', this.removeOffer.bind(this), () => null),
  ]

  /**
   * Related to floating buttons show/hide process
   */
  public showFloatingButtons = false
  public buttonTimeoutStarted = false
  public buttonTimeout: any = null

  constructor(private cd: ChangeDetectorRef, private tradeService: TradeService) {
    this.tradeService.buyer.subscribe(this.handleBuyerJoined.bind(this))
  }

  /**
   * Check if the name of player that has joined to area is the same as the buyer of the offer
   * @param name Name of the player that has joined the area
   */
  private handleBuyerJoined(name: string): void {
    if (this.offer && this.offer.buyerName === name) {
      this.offer.buyerJoined = true
      this.cd.detectChanges()
    }
  }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {}

  public ngOnDestroy(): void {}

  /**
   * Ask to send a trade request to the buyer
   */
  public sendTradeRequest(): void {
    this.evTradeRequest.emit(this.offer)
  }

  /**
   * Ask to kick the buyer out of the party
   */
  public kickBuyer(): void {
    this.evPartyKick.emit(this.offer)
  }

  /**
   * Ask to remove the offer from the list of offers available
   * @param offer The offer to remove
   */
  public removeOffer(offer: Offer): void {
    this.evRemoveOffer.emit(offer)
  }

  /**
   * Ask to send a party invite to the buyer
   */
  public sendPartyInvite(): void {
    this.evPartyInvite.emit(this.offer)
    this.showFloatingButtons = false
    this.cd.markForCheck()
  }

  /**
   * Ask to send a "Sold" whisper to the buyer
   */
  public sendSoldWhisper(): void {
    this.evSoldWhisper.emit(this.offer)
  }

  /**
   * Ask to send a "I'm busy" whisper to the buyer
   */
  public sendBusyWhisper(): void {
    this.evBusyWhisper.emit(this.offer)
  }

  /**
   * Ask to ignore the offer
   */
  public ignoreOffer(): void {
    this.evIgnoreOffer.emit(this.offer)
  }

  /**
   * Ask to send a "Are you still interested?" whisper to the buyer
   */
  public sendStillInterestedWhisper(): void {
    this.evStillInterestedWhisper.emit(this.offer)
  }

  /**
   * Handles the show/hide process of floating buttons
   * There's a delay while the floating buttons stay visible
   * @param value Show / Hide the floating buttons
   */
  public showFloatingButtonsContainer(value: boolean): void {
    if (value) {
      this.showFloatingButtons = true
      this.cd.detectChanges()

      if (this.buttonTimeout) {
        this.buttonTimeoutStarted = false
        clearTimeout(this.buttonTimeout)
      }
    } else {
      if (!this.buttonTimeoutStarted) {
        this.buttonTimeoutStarted = true

        this.buttonTimeout = setTimeout(() => {
          this.showFloatingButtons = false
          this.cd.detectChanges()
          this.buttonTimeoutStarted = false
        }, 500)
      }
    }
  }
}
