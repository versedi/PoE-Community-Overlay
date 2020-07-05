import { NgModule } from '@angular/core'
import { FEATURE_MODULES } from '@app/token'
import { SharedModule } from '@shared/shared.module'
import { TradeOffersContainerComponent } from './components/trade-offers-container/trade-offers-container.component'
import { FeatureModule, Feature } from '@app/type'
import { UserSettingsFeature, UserSettings } from 'src/app/layout/type'
import { TradeOfferComponent } from './components/trade-offer/trade-offer.component'

@NgModule({
  providers: [{ provide: FEATURE_MODULES, useClass: TradeModule, multi: true }],
  declarations: [TradeOfferComponent, TradeOffersContainerComponent],
  exports: [TradeOfferComponent, TradeOffersContainerComponent],
  imports: [SharedModule],
})
export class TradeModule implements FeatureModule {
  constructor() {}
  public getSettings(): any {
    return {}
  }
  public getFeatures(settings: UserSettings): Feature[] {
    return []
  }
  public run(feature: string, settings: UserSettings): void {}
}
