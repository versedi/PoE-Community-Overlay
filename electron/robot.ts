import { IpcMain, clipboard } from 'electron'
import * as robot from 'robotjs'

const keyCodes = {
  ENTER: 13,
  A: 65,
  V: 86
};

function sendCommand(cmd: string): void {
  // Need to use the clipboard to type command in chat, because the typeString method of robotjs is a bit slow and bugged
  clipboard.writeText(cmd);
  robot.keyTap(keyCodes.ENTER);
  robot.keyTap(keyCodes.A, ['control']);
  robot.keyTap(keyCodes.V, ['control']);
  robot.keyTap(keyCodes.ENTER);
}

export function register(ipcMain: IpcMain): void {
  ipcMain.on('click-at', (event, button, position) => {
    if (position) {
      robot.updateScreenMetrics()
      robot.moveMouse(position.x, position.y)
    }
    robot.mouseClick(button, false)
    event.returnValue = true
  })

  ipcMain.on('mouse-pos', (event) => {
    event.returnValue = robot.getMousePos()
  })

  ipcMain.on('key-tap', (event, key, modifier) => {
    robot.keyTap(key, modifier)
    event.returnValue = true
  })

  ipcMain.on('key-toggle', (event, key, down, modifier) => {
    robot.keyToggle(key, down, modifier)
    event.returnValue = true
  })

  ipcMain.on('set-keyboard-delay', (event, delay) => {
    robot.setKeyboardDelay(delay)
    event.returnValue = true
  })

  ipcMain.on('game-send-command', (event, command) => {
    sendCommand(command);
    event.returnValue = true;
  });
}
