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
  public offers: Offer[] = []

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

  private handleTradeCancelled(): void {
    this.resetOfferTrades()
  }

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

  private handleNewOffer(offer: Offer): void {
    if (offer) {
      this.offers.push(offer)
      this.cd.detectChanges()
    }
  }

  public ngOnInit(): void { }

  public ngAfterViewInit(): void { }

  public ngOnDestroy(): void { }

  public ignoreOffer(offer: Offer): void {
    const index: number = this.offers.findIndex(
      (o) =>
        o.time === offer.time && o.itemName === offer.itemName && o.buyerName === offer.buyerName
    )

    if (index !== -1) {
      this.offers.splice(index, 1)
      this.cd.detectChanges()
    }
  }

  public removeAcceptedTradeOffer(): void {
    const index: number = this.offers.findIndex((o) => o.tradeRequestSent)

    if (index !== -1) {
      this.offers.splice(index, 1)
      this.cd.detectChanges()
    }
  }

  public resetOfferTrades(): void {
    for (const o of this.offers) {
      o.tradeRequestSent = false
    }

    this.cd.markForCheck()
  }

  public removeOffer(offer: Offer): void {
    this.kickBuyer(offer.buyerName)
    this.ignoreOffer(offer)
  }

  public kickBuyer(name: string): void {
    this.commandService.command(`/kick ${name}`)
  }

  private insertWhisperVars(text: string, offer: Offer): string {
    return text
      .replace('{item}', offer.itemName)
      .replace('{price}', `${offer.price.value} ${offer.price.currency}`)
  }

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

  public sendTradeRequest(offer: Offer): void {
    this.commandService.command(`/tradewith ${offer.buyerName}`)
    offer.tradeRequestSent = true
  }

  public sendPartyInvite(offer: Offer): void {
    this.commandService.command(`/invite ${offer.buyerName}`)
    offer.partyInviteSent = true
    this.cd.detectChanges()
  }
}
