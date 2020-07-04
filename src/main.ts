import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'
import { environment } from '@env/environment'

const setIgnoreMouseEvents = window.require('electron').remote.getCurrentWindow().setIgnoreMouseEvents

/* Enable mouse events only if the mouse is over something it can interact with. Otherwise pass-through */
window.addEventListener('mousemove', event => {
  if (event.target === document.documentElement) {
    setIgnoreMouseEvents(true, { forward: true });
  } else {
    setIgnoreMouseEvents(false)
  }
});

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
