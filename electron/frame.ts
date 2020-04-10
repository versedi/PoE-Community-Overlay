import { BrowserWindow, IpcMain } from 'electron';

let frames: {
    [counter: number]: BrowserWindow
} = {};

export function register(ipcMain: IpcMain, onLoad: (frame: BrowserWindow, route: string) => void): void {
    ipcMain.on('frame-open', (event, counter: number, data) => {
        try {
            if (!frames[counter]) {
                const frame = frames[counter] = new BrowserWindow({
                    width: data.width,
                    height: data.height,
                    frame: false,
                    closable: false,
                    resizable: false,
                    movable: true,
                    webPreferences: {
                        nodeIntegration: true,
                        allowRunningInsecureContent: true,
                        webSecurity: false
                    },
                    center: true,
                    transparent: true,
                    show: false
                });
                frame.removeMenu();

                frame.once('close', () => {
                    frames[counter] = null;
                    event.sender.send(`frame-result-${counter}`, 'error');
                });

                frame.on('hide', () => {
                    event.sender.send(`frame-result-${counter}`, 'close');
                });

                ipcMain.once(`frame-ready-${counter}`, () => {
                    frame.webContents.send('frame-show', data);
                });

                ipcMain.on(`frame-result-post-${counter}`, (_, code, result) => {
                    event.sender.send(`frame-result-${counter}`, code, result);
                });

                onLoad(frame, `#/frame/${counter}/${data.name}`);
            } else {
                const frame = frames[counter];
                frame.setSize(data.width, data.height);
                frame.webContents.send('frame-show', data);
            }

            frames[counter].setAlwaysOnTop(true, 'pop-up-menu', 1);
            frames[counter].setVisibleOnAllWorkspaces(true);

        } catch (error) {
            console.log(error);
            event.sender.send(`frame-result-${counter}`, 'error', error);
        }
    });
}