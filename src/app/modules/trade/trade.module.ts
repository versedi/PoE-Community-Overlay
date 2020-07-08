import { NgModule } from '@angular/core'
import { FEATURE_MODULES } from '@app/token'
import { SharedModule } from '@shared/shared.module'
import { TradeOffersContainerComponent } from './components/trade-offers-container/trade-offers-container.component'
import { FeatureModule, Feature } from '@app/type'
import { UserSettingsFeature, UserSettings } from 'src/app/layout/type'
import { TradeOfferComponent } from './components/trade-offer/trade-offer.component'
import {
  TradeSettingsComponent,
  TradeUserSettings,
} from './components/trade-settings/trade-settings.component'
import { TradeStashGridComponent } from './components/trade-stash-grid/trade-stash-grid.component'

@NgModule({
  providers: [{ provide: FEATURE_MODULES, useClass: TradeModule, multi: true }],
  declarations: [
    TradeOfferComponent,
    TradeOffersContainerComponent,
    TradeSettingsComponent,
    TradeStashGridComponent
  ],
  exports: [
    TradeOfferComponent,
    TradeOffersContainerComponent,
    TradeStashGridComponent
  ],
  imports: [SharedModule],
})
export class TradeModule implements FeatureModule {
  constructor() { }

  public getSettings(): UserSettingsFeature {
    const defaultSettings: TradeUserSettings = {
      tradeThanksWhisper: 'Thanks!',
      tradeBusyWhisper: "I'm busy right now, but I will send you a party invite when I'm ready",
      tradeSoldWhisper: 'Sorry, my {item} is sold',
      tradeStillInterestedWhisper: 'Are you still interested in my {item} listed for {price}?',
      tradeAutoKick: true,
      tradeAutoWhisper: true,
      tradeOverlayHighlight: true,
      tradeInGameHighlight: true,
      tradeOverlayHighlightDropShadow: true,
      tradeOverlayHighlightLeft: 15,
      tradeOverlayHighlightTop: 161,
      tradeOverlayHighlightWidth: 53,
      tradeOverlayHighlightHeight: 53
    }

    return {
      name: 'Trade manager',
      component: TradeSettingsComponent,
      defaultSettings,
    }
  }

  public getFeatures(settings: TradeUserSettings): Feature[] {
    const features: Feature[] = []

    return features
  }

  public run(feature: string, settings: TradeUserSettings): void {
    switch (feature) {
      default:
        break
    }
  }
}
