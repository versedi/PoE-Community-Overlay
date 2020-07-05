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
import FloatingButton from '@modules/trade/class/FloatingButton';
import { TradeService } from '@modules/trade/services/trade.service';

@Component({
    selector: 'app-trade-offer',
    templateUrl: './trade-offer.component.html',
    styleUrls: ['./trade-offer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeOfferComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() offer: Offer;

    @Output() onIgnoreOffer = new EventEmitter();
    @Output() onTradeRequest = new EventEmitter();
    @Output() onPartyInvite = new EventEmitter();
    @Output() onSoldWhisper = new EventEmitter();
    @Output() onBusyWhisper = new EventEmitter();
    @Output() onStillInterestedWhisper = new EventEmitter();
    @Output() onRemoveOffer = new EventEmitter();
    @Output() onPartyKick = new EventEmitter();

    preInviteFloatingButtons: FloatingButton[] = [
        new FloatingButton("Invite to party", "green", "person_add", this.sendPartyInvite.bind(this), () => null),
        new FloatingButton("Item is sold", "orange", "money_off", this.sendSoldWhisper.bind(this), () => null),
        new FloatingButton("I'm busy", "blue", "event_busy", this.sendBusyWhisper.bind(this), () => null),
        new FloatingButton("Still interested?", "purple", "live_help", this.sendStillInterestedWhisper.bind(this), () => null),
        new FloatingButton("Ignore offer", "red", "delete", this.ignoreOffer.bind(this), () => null),
    ];

    postInviteFloatingButtons: FloatingButton[] = [
        new FloatingButton("Send trade request", "green", "attach_money", this.sendTradeRequest.bind(this), () => null),
        new FloatingButton("Invite to party", "blue", "person_add", this.sendPartyInvite.bind(this), () => null),
        new FloatingButton("Kick buyer", "orange", "person_remove", this.kickBuyer.bind(this), () => null),
        new FloatingButton("Remove offer", "red", "delete", this.removeOffer.bind(this), () => null),
    ];

    buyerInvited: boolean = false;

    showFloatingButtons: boolean = false;
    buttonTimeoutStarted: boolean = false;
    buttonTimeout: any = null;

    constructor(
        private cd: ChangeDetectorRef,
        private tradeService: TradeService
    ) {
        this.tradeService.buyer.subscribe(this.handleBuyerJoined.bind(this));
    }

    private handleBuyerJoined(name: string): void {
        if (this.offer && this.offer.buyerName == name) {
            this.offer.buyerJoined = true;
            this.cd.detectChanges();
        }
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {

    }

    public ngOnDestroy(): void {

    }

    sendTradeRequest(): void {
        this.onTradeRequest.emit(this.offer);
    }

    kickBuyer(): void {
        this.onPartyKick.emit(this.offer);
    }

    removeOffer(offer: Offer): void {
        this.onRemoveOffer.emit(offer);
    }

    sendPartyInvite(): void {
        this.onPartyInvite.emit(this.offer);
        this.showFloatingButtons = false;
        this.cd.markForCheck();
    }

    sendSoldWhisper(): void {
        this.onSoldWhisper.emit(this.offer);
    }

    sendBusyWhisper(): void {
        this.onBusyWhisper.emit(this.offer);
    }

    ignoreOffer(): void {
        this.onIgnoreOffer.emit(this.offer);
    }

    sendStillInterestedWhisper(): void {
        this.onStillInterestedWhisper.emit(this.offer);
    }

    showFloatingButtonsContainer(value: boolean): void {
        if (value) {
            this.showFloatingButtons = true;
            this.cd.markForCheck();

            if (this.buttonTimeout) {
                this.buttonTimeoutStarted = false;
                clearTimeout(this.buttonTimeout);
            }
        } else {
            if (!this.buttonTimeoutStarted) {
                this.buttonTimeoutStarted = true;

                this.buttonTimeout = setTimeout(() => {
                    this.showFloatingButtons = false;
                    this.cd.markForCheck();
                    this.buttonTimeoutStarted = false;
                }, 500);
            }
        }
    }
}