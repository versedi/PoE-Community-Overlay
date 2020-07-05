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
import { GameService } from '@app/service'

@Component({
    selector: 'app-trade-offers-container',
    templateUrl: './trade-offers-container.component.html',
    styleUrls: ['./trade-offers-container.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeOffersContainerComponent implements OnInit, AfterViewInit, OnDestroy {
    offers: Offer[] = []

    constructor(
        private cd: ChangeDetectorRef,
        private tradeService: TradeService,
        private gameService: GameService
    ) {
        this.tradeService.offers.subscribe(this.handleNewOffer.bind(this));
        this.tradeService.tradeAccepted.subscribe(this.handleTradeAccepted.bind(this));
        this.tradeService.tradeCancelled.subscribe(this.handleTradeCancelled.bind(this));
    }

    private handleTradeCancelled(): void {
        this.resetOfferTrades();
    }
   
    private handleTradeAccepted(): void {
        const index = this.offers.findIndex(o => o.tradeRequestSent);
        
        if (index != -1) {
            this.sendThanksWhisper(this.offers[index]);
            this.kickBuyer(this.offers[index].buyerName);

            this.offers.splice(index, 1);
            this.cd.detectChanges();
        }
    }

    private handleNewOffer(offer: Offer): void {
        if (offer) {
            this.offers.push(offer);
            this.cd.detectChanges();
        }
    }

    public ngOnInit(): void {

    }

    public ngAfterViewInit(): void {

    }

    public ngOnDestroy(): void {

    }

    ignoreOffer(offer: Offer): void {
        const index: number = this.offers.findIndex(o => o.time == offer.time && o.itemName == offer.itemName && o.buyerName == offer.buyerName);

        if (index != -1) {
            this.offers.splice(index, 1);
            this.cd.detectChanges();
        }
    }

    removeAcceptedTradeOffer(): void {
        const index: number = this.offers.findIndex(o => o.tradeRequestSent);

        if (index != -1) {
            this.offers.splice(index, 1);
            this.cd.detectChanges();
        }
    }

    resetOfferTrades(): void {
        for (let o of this.offers) {
            o.tradeRequestSent = false;
        }

        this.cd.markForCheck();
    }

    removeOffer(offer: Offer): void {
        this.kickBuyer(offer.buyerName);
        this.ignoreOffer(offer);
    }

    kickBuyer(name: string): void {
        this.gameService.focus();
        this.gameService.sendCommand(`/kick ${name}`);
    }

    sendThanksWhisper(offer:Offer):void{
        this.gameService.focus();
        this.gameService.sendCommand(`@${offer.buyerName} Thanks!`);
    }

    sendStillInterestedWhisper(offer: Offer): void {
        this.gameService.focus();
        this.gameService.sendCommand(`@${offer.buyerName} Are you still interested in my ${offer.itemName} listed for ${offer.price.value} ${offer.price.currency}?`);
    }

    sendBusyWhisper(offer: Offer): void {
        this.gameService.focus();
        this.gameService.sendCommand(`@${offer.buyerName} I'm busy right now, I will send you party invite when I'm ready.`);
    }

    sendSoldWhisper(offer: Offer): void {
        this.gameService.focus();
        this.gameService.sendCommand(`@${offer.buyerName} Sorry, my ${offer.itemName} is already sold.`);
        this.ignoreOffer(offer);
    }

    sendTradeRequest(offer: Offer): void {
        this.gameService.focus();
        this.gameService.sendCommand(`/tradewith ${offer.buyerName}`);
        offer.tradeRequestSent = true;
    }

    sendPartyInvite(offer: Offer): void {
        this.gameService.focus();
        this.gameService.sendCommand(`/invite ${offer.buyerName}`);
        offer.partyInviteSent = true;
        this.cd.detectChanges();
    }
}