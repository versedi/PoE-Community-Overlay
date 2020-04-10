import { Injectable, NgZone } from '@angular/core';
import { ElectronProvider } from '@app/provider';
import { IpcRenderer } from 'electron';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { WindowService } from './window.service';

export interface FrameData {
    name: string;
    width: number;
    height: number;
}

@Injectable({
    providedIn: 'root'
})
export class FrameService {
    private readonly data$ = new BehaviorSubject<FrameData>(undefined);
    private counter = 0;

    private readonly ipcRenderer: IpcRenderer;
    private frameCounter = 0;

    constructor(
        private readonly ngZone: NgZone,
        private readonly window: WindowService,
        electronProvider: ElectronProvider) {
        this.ipcRenderer = electronProvider.provideIpcRenderer();
    }

    public get(): Observable<FrameData> {
        return this.data$;
    }

    public ready(counter: number): void {
        this.ipcRenderer.on(`frame-show`, (_, data) => {
            this.ngZone.run(() => {
                this.data$.next(data);
                this.window.show();
            });
        });
        this.counter = counter;
        this.ipcRenderer.send(`frame-ready-${counter}`);
    }

    public open<TResult>(data: FrameData): Observable<TResult> {
        // todo add multiple frames support
        if (this.frameCounter === 1) {
            return throwError('to much frames open.');
        }

        const counter = ++this.frameCounter;
        const promise = new Promise<TResult>((resolve, reject) => {
            this.ipcRenderer.once(`frame-result-${counter}`, (_, code, result) => {
                this.ngZone.run(() => {                    
                    --this.frameCounter;
                    if (code === 'close') {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                });
            });
            this.ipcRenderer.send('frame-open', counter, data);
        });
        return from(promise);
    }

    public close<TResult>(result?: TResult): void {
        this.ipcRenderer.send(`frame-result-post-${this.counter}`, 'close', result);
        this.window.hide();
    }
}