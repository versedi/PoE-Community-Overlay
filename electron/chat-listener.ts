import { IpcMain } from 'electron';
import { watchFile, FSWatcher, stat, open, read, openSync } from 'fs';
import { debounce } from 'lodash'
import { EOL } from 'os';

const regTradeOfferWhisper = /@From .+:* Hi, I would like to buy your .+ listed for [0-9\.]+ .+ in .+/gi;
const regBuyerJoined = /.+ has joined the area/gi;
const regTradeAccepted = /Trade accepted/gi;
const regTradeCancelled = /Trade cancelled/gi;
const regGuild = /<.+> .+/gi;
const regTwoDots = /: Hi, /gi;

const currencyNameToImage = {
    alt: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollMagic.png?v=6d9520174f6643e502da336e76b730d3',
    fuse: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollSocketLinks.png?v=0ad7134a62e5c45e4f8bc8a44b95540f',
    alch: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyUpgradeToRare.png?v=89c110be97333995522c7b2c29cae728',
    chaos: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?v=c60aa876dd6bab31174df91b1da1b4f9',
    gcp: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyGemQuality.png?v=f11792b6dbd2f5f869351151bc3a4539',
    exalted: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?v=1745ebafbd533b6f91bccf588ab5efc5',
    chrome: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollSocketColours.png?v=9d377f2cf04a16a39aac7b14abc9d7c3',
    jewellers: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollSocketNumbers.png?v=2946b0825af70f796b8f15051d75164d',
    chance: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyUpgradeRandomly.png?v=e4049939b9cd61291562f94364ee0f00',
    chisel: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyMapQuality.png?v=f46e0a1af7223e2d4cae52bc3f9f7a1f',
    vaal: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyVaal.png?v=64114709d67069cd665f8f1a918cd12a',
    blessed: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyImplicitMod.png?v=472eeef04846d8a25d65b3d4f9ceecc8',
    p: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyCoin.png?v=b971d7d9ea1ad32f16cce8ee99c897cf',
    mirror: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyDuplicate.png?v=6fd68c1a5c4292c05b97770e83aa22bc',
    transmute: 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyUpgradeToMagic.png?v=333b8b5e28b73c62972fc66e7634c5c8',
    silver: 'https://web.poecdn.com/image/Art/2DItems/Currency/SilverObol.png?v=93c1b204ec2736a2fe5aabbb99510bcf'
};

export class ChatListener {
    private ipcMain: IpcMain;
    private webContents: Electron.WebContents;

    private clientFileLocation: string = null;
    private lastFilePostion: number = 0;
    private debounced_readLastLines: any;

    private started: boolean = false;

    constructor(ipcMain: IpcMain, webContents: Electron.WebContents) {
        this.ipcMain = ipcMain;
        this.webContents = webContents;

        this.debounced_readLastLines = debounce(this.readLastLines, 500);
    }

    public setLogFilePath(filePath: string): void {
        this.clientFileLocation = filePath;

        stat(this.clientFileLocation, (err, infos) => {
            if (err) {
                console.info('Cannot get Client.txt stats.');
                return;
            }

            this.lastFilePostion = infos.size;
        });
    }

    public isStarted(): boolean {
        return this.started;
    }

    private parse(line: string): void {
        if (line) {
            if (line.match(regTradeOfferWhisper)) {
                this.parseOfferLine(line);
            } else if (line.match(regBuyerJoined)) {
                this.parseBuyerJoinedLine(line);
            } else if (line.match(regTradeAccepted)) {
                this.webContents.send('trade-accepted');
            } else if (line.match(regTradeCancelled)) {
                this.webContents.send('trade-cancelled');
            }
        }
    }

    public start(): void {
        this.started = true;

        watchFile(this.clientFileLocation, (current, previous) => {
            this.debounced_readLastLines();
        });
    }

    private readLastLines(): void {
        stat(this.clientFileLocation, (err, fileInfos) => {
            open(this.clientFileLocation, 'r', (err, fd) => {
                const buffer: Buffer = Buffer.alloc(fileInfos.size - this.lastFilePostion);

                read(fd, buffer, 0, buffer.length, this.lastFilePostion, (err, bytesRead, buffer) => {
                    const lines: string = buffer.toString();
                    this.lastFilePostion = fileInfos.size;

                    lines.split(EOL).forEach(l => this.parse(l));
                });
            });
        });
    }

    private parseOfferLine(line: string): void {
        var buyerName = line.match(regGuild) ? line.substring(line.indexOf('> ') + 2, line.lastIndexOf(' Hi, ')) : line.substring(line.indexOf('@From ') + 6, line.match(regTwoDots) ? line.lastIndexOf(': Hi, ') : line.lastIndexOf(' Hi, '));

        if (buyerName.lastIndexOf(':') == buyerName.length) {
            buyerName = buyerName.substring(0, buyerName.length - 1);
        }

        var item = line.substring(line.lastIndexOf('buy your ') + 9, line.lastIndexOf(' listed for'));

        var price = line.substring(line.lastIndexOf('listed for ') + 11, line.lastIndexOf(' in '));
        const priceSplit = price.split(' ');

        var currency = "";
        var priceValue = "";

        if (priceSplit.length >= 2) {
            currency = priceSplit[1];
            priceValue = priceSplit[0];
        }

        var time = line.substring(0, 19);

        this.webContents.send('new-trade-offer', {
            buyerName,
            itemName: item,
            time,
            price: {
                currency,
                value: priceValue,
                image: currencyNameToImage[currency]
            }
        });
    }

    private parseBuyerJoinedLine(line: string): void {
        var buyerName = line.substring(line.lastIndexOf(': ') + 2, line.indexOf(' has joined the area.'));
        this.webContents.send('buyer-joined', buyerName);
    }
}

export function register(ipcMain: IpcMain, webContents: Electron.WebContents): void {
    const chatListener = new ChatListener(ipcMain, webContents);

    ipcMain.on('logs-file-found', (filePath) => {
        if (!chatListener.isStarted() && filePath) {
            chatListener.setLogFilePath(String(filePath));
            chatListener.start();
        }
    });
}