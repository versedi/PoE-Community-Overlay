import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core'
import Offer from '@modules/trade/class/Offer'
import { TradeService } from '@modules/trade/services/trade.service'
import { UserSettingsService } from 'src/app/layout/service'
import { TradeUserSettings } from '../trade-settings/trade-settings.component'
import { CommandService } from '@modules/command/service/command.service'

@Component({
  selector: 'app-trade-offers-container',
  templateUrl: './trade-offers-container.component.html',
  styleUrls: ['./trade-offers-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeOffersContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * List of the current trade offers received and not ignored, removed or completed yet.
   */
  public offers: Offer[] = [];

  /**
   * Currently selected offer
   */
  currentOffer: Offer = null;

  /**
   * Show/Hide the item highlight grid
   */
  showGrid: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private tradeService: TradeService,
    private settingsService: UserSettingsService,
    private commandService: CommandService
  ) {
    this.tradeService.offers.subscribe(this.handleNewOffer.bind(this))
    this.tradeService.tradeAccepted.subscribe(this.handleTradeAccepted.bind(this))
    this.tradeService.tradeCancelled.subscribe(this.handleTradeCancelled.bind(this))
  }

  /**
   * Handles trade cancelled messages from chatListener
   */
  private handleTradeCancelled(): void {
    this.resetOfferTrades()
  }

  /**
   * Handles trade accepted messages from chatListener
   */
  private handleTradeAccepted(): void {
    const index = this.offers.findIndex((o) => o.tradeRequestSent)

    if (index !== -1) {
      this.settingsService.get().subscribe((settings) => {
        const tradeSettings = settings as TradeUserSettings

        if (tradeSettings.tradeAutoWhisper) {
          this.sendThanksWhisper(this.offers[index])
        }

        if (tradeSettings.tradeAutoKick) {
          this.kickBuyer(this.offers[index].buyerName)
        }

        this.offers.splice(index, 1)
        this.cd.detectChanges()
      })
    }
  }

  /**
   * Handles new offers coming from the chatListener
   * @param offer New offer to add to the overlay
   */
  private handleNewOffer(offer: Offer): void {
    if (offer) {
      this.offers.push(offer)
      this.cd.detectChanges()
    }
  }

  public ngOnInit(): void { }

  public ngAfterViewInit(): void { }

  public ngOnDestroy(): void { }

  /**
   * Remove an offer from the list of trade offers
   * @param offer Offer to remove
   */
  public ignoreOffer(offer: Offer): void {
    const index: number = this.offers.findIndex(
      (o) =>
        o.time === offer.time && o.itemName === offer.itemName && o.buyerName === offer.buyerName
    )

    if (index !== -1) {
      this.offers.splice(index, 1)

      if (this.currentOffer === offer) {
        this.currentOffer = null;
      }

      this.cd.detectChanges()
    }
  }

  /**
   * Remove the offer marked as Trade Accepted
   */
  public removeAcceptedTradeOffer(): void {
    const index: number = this.offers.findIndex((o) => o.tradeRequestSent)

    if (index !== -1) {
      this.offers.splice(index, 1)
      this.currentOffer = null;
      this.cd.detectChanges()
    }
  }

  /**
   * Reset the property tradeRequestSent to false on every offers
   */
  public resetOfferTrades(): void {
    for (const o of this.offers) {
      o.tradeRequestSent = false
    }

    this.cd.markForCheck()
  }

  /**
   * Remove the offer from the list of trade offers AND kick the buyer of the offer out of the party
   * @param offer Offer to remove
   */
  public removeOffer(offer: Offer): void {
    this.kickBuyer(offer.buyerName)
    this.ignoreOffer(offer)
  }

  /**
   * Kick a buyer out of the pary
   * @param name Name of the buyer to kick
   */
  public kickBuyer(name: string): void {
    this.commandService.command(`/kick ${name}`)
  }

  /**
   * Replace the special variables in the whisper to their value
   * {item} => Item name
   * {price} => Price of the item
   * @param text Text of the whisper
   * @param offer Offer related to the whisper
   */
  private insertWhisperVars(text: string, offer: Offer): string {
    return text
      .replace('{item}', offer.itemName)
      .replace('{price}', `${offer.price.value} ${offer.price.currency}`)
  }

  /**
   * Send a "Thanks" whisper to the buyer
   * @param offer Offer related to the whisper
   */
  public sendThanksWhisper(offer: Offer): void {
    this.settingsService.get().subscribe((settings) => {
      const tradeSettings = settings as TradeUserSettings

      this.commandService.command(
        `@${offer.buyerName} ${
        tradeSettings
          ? this.insertWhisperVars(tradeSettings.tradeThanksWhisper, offer)
          : 'Thanks!'
        }`
      )
    })
  }

  /**
   * Send a "Are you still interested in my Item X listed for Price Y?" to the buyer
   * @param offer Offer related to the whisper
   */
  public sendStillInterestedWhisper(offer: Offer): void {
    this.settingsService.get().subscribe((settings) => {
      const tradeSettings = settings as TradeUserSettings

      this.commandService.command(
        `@${offer.buyerName} ${
        tradeSettings
          ? this.insertWhisperVars(tradeSettings.tradeStillInterestedWhisper, offer)
          : `Are you still interested in my ${offer.itemName} listed for ${offer.price.value} ${offer.price.currency}?`
        }`
      )
    })
  }

  /**
   * Send a "I'm busy" whisper to the buyer
   * @param offer Offer related to the whisper
   */
  public sendBusyWhisper(offer: Offer): void {
    this.settingsService.get().subscribe((settings) => {
      const tradeSettings = settings as TradeUserSettings

      this.commandService.command(
        `@${offer.buyerName} ${
        tradeSettings
          ? this.insertWhisperVars(tradeSettings.tradeBusyWhisper, offer)
          : `I'm busy right now, I will send you party invite when I'm ready.`
        }`
      )
    })
  }

  /**
   * Send a "Sold!" whisper to the buyer
   * @param offer Offer related to the whisper
   */
  public sendSoldWhisper(offer: Offer): void {
    this.settingsService.get().subscribe((settings) => {
      const tradeSettings = settings as TradeUserSettings

      this.commandService.command(
        `@${offer.buyerName} ${
        tradeSettings
          ? this.insertWhisperVars(tradeSettings.tradeSoldWhisper, offer)
          : `Sorry, my ${offer.itemName} is already sold.`
        }`
      )
      this.ignoreOffer(offer)
    })
  }

  /**
   * Send a trade request command to the buyer
   * @param offer Offer related to the trade request
   */
  public sendTradeRequest(offer: Offer): void {
    this.commandService.command(`/tradewith ${offer.buyerName}`)
    offer.tradeRequestSent = true
  }

  /**
   * Send a party invite to the buyer
   * @param offer Offer
   */
  public sendPartyInvite(offer: Offer): void {
    this.commandService.command(`/invite ${offer.buyerName}`)
    offer.partyInviteSent = true;
    this.currentOffer = offer;
    this.cd.detectChanges();
  }

  public highlightItem(): void {
    if (this.currentOffer) {
      this.showGrid = !this.showGrid;
    } else if (this.showGrid) {
      this.showGrid = false;
    }
    
    this.cd.detectChanges();
  }
}
