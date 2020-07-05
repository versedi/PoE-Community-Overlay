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
  @Input() public offer: Offer

  @Output() public evIgnoreOffer = new EventEmitter()
  @Output() public evTradeRequest = new EventEmitter()
  @Output() public evPartyInvite = new EventEmitter()
  @Output() public evSoldWhisper = new EventEmitter()
  @Output() public evBusyWhisper = new EventEmitter()
  @Output() public evStillInterestedWhisper = new EventEmitter()
  @Output() public evRemoveOffer = new EventEmitter()
  @Output() public evPartyKick = new EventEmitter()

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

  public buyerInvited = false

  public showFloatingButtons = false
  public buttonTimeoutStarted = false
  public buttonTimeout: any = null

  constructor(private cd: ChangeDetectorRef, private tradeService: TradeService) {
    this.tradeService.buyer.subscribe(this.handleBuyerJoined.bind(this))
  }

  private handleBuyerJoined(name: string): void {
    if (this.offer && this.offer.buyerName === name) {
      this.offer.buyerJoined = true
      this.cd.detectChanges()
    }
  }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {}

  public ngOnDestroy(): void {}

  public sendTradeRequest(): void {
    this.evTradeRequest.emit(this.offer)
  }

  public kickBuyer(): void {
    this.evPartyKick.emit(this.offer)
  }

  public removeOffer(offer: Offer): void {
    this.evRemoveOffer.emit(offer)
  }

  public sendPartyInvite(): void {
    this.evPartyInvite.emit(this.offer)
    this.showFloatingButtons = false
    this.cd.markForCheck()
  }

  public sendSoldWhisper(): void {
    this.evSoldWhisper.emit(this.offer)
  }

  public sendBusyWhisper(): void {
    this.evBusyWhisper.emit(this.offer)
  }

  public ignoreOffer(): void {
    this.evIgnoreOffer.emit(this.offer)
  }

  public sendStillInterestedWhisper(): void {
    this.evStillInterestedWhisper.emit(this.offer)
  }

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
