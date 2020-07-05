import { Injectable } from '@angular/core'
import { SnackBarService } from '@shared/module/material/service'
import { ElectronProvider } from '@app/provider';
import { IpcRenderer } from 'electron';
import { BehaviorSubject } from 'rxjs';
import Offer from '../class/Offer';

@Injectable({
    providedIn: 'root',
})
export class TradeService {
    private ipcRenderer: IpcRenderer;

    offers: BehaviorSubject<Offer> = new BehaviorSubject<Offer>(null);
    buyer: BehaviorSubject<string> = new  BehaviorSubject<string>(null);
    tradeAccepted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    tradeCancelled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly snackbar: SnackBarService,
        private electronProvider: ElectronProvider
    ) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();
        this.Init();
    }

    private Init(): void {
        this.ipcRenderer.on('new-trade-offer', (event, offer) => {
            this.offers.next(offer);
        });

        this.ipcRenderer.on('buyer-joined', (event, name)=>{
            this.buyer.next(name);
        });

        this.ipcRenderer.on('trade-accepted', (event)=>{
            this.tradeAccepted.next(true);
        });

        this.ipcRenderer.on('trade-cancelled', (event)=>{
            this.tradeCancelled.next(true);
        });
    }
}
