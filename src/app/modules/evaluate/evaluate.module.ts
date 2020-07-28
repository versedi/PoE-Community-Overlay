import { NgModule } from '@angular/core'
import { FEATURE_MODULES } from '@app/token'
import { Feature, FeatureModule } from '@app/type'
import { Language } from '@shared/module/poe/type'
import { ItemSearchIndexed } from '@shared/module/poe/type/search.type'
import { SharedModule } from '@shared/shared.module'
import { UserSettingsFeature } from 'src/app/layout/type'
import { EvaluateDialogComponent } from './component/evaluate-dialog/evaluate-dialog.component'
import { EvaluateExchangeRateChartComponent } from './component/evaluate-exchange-rate-chart/evaluate-exchange-rate-chart.component'
import { EvaluateExchangeRateComponent } from './component/evaluate-exchange-rate/evaluate-exchange-rate.component'
import { EvaluateOptionsComponent } from './component/evaluate-options/evaluate-options.component'
import { EvaluateSearchChartComponent } from './component/evaluate-search-chart/evaluate-search-chart.component'
import { EvaluateSearchTableComponent } from './component/evaluate-search-table/evaluate-search-table.component'
import { EvaluateSearchComponent } from './component/evaluate-search/evaluate-search.component'
import {
  EvaluateResultView,
  EvaluateSettingsComponent,
  EvaluateUserSettings,
  EvaluatePricing,
} from './component/evaluate-settings/evaluate-settings.component'
import { EvaluateService } from './service/evaluate.service'
import { EvaluatePricePredictionComponent } from './component/evaluate-price-prediction/evaluate-price-prediction.component'

@NgModule({
  providers: [{ provide: FEATURE_MODULES, useClass: EvaluateModule, multi: true }],
  declarations: [
    EvaluateDialogComponent,
    EvaluateSettingsComponent,
    EvaluateSearchChartComponent,
    EvaluateExchangeRateChartComponent,
    EvaluateExchangeRateComponent,
    EvaluateSearchComponent,
    EvaluateSearchTableComponent,
    EvaluateOptionsComponent,
    EvaluatePricePredictionComponent,
  ],
  imports: [SharedModule],
})
export class EvaluateModule implements FeatureModule {
  constructor(private readonly evaluateService: EvaluateService) {}

  public getSettings(): UserSettingsFeature {
    const defaultSettings: EvaluateUserSettings = {
      evaluateCurrencyOriginal: true,
      evaluateCurrencyIds: ['chaos', 'exa'],
      evaluateResultView: EvaluateResultView.List,
      evaluateQueryDefaultItemLevel: true,
      evaluateQueryDefaultLinks: 5,
      evaluateQueryDefaultMiscs: true,
      evaluateQueryDefaultType: false,
      evaluateQueryDefaultAttack: true,
      evaluateQueryDefaultDefense: true,
      evaluateQueryNormalizeQuality: true,
      evaluatePropertyMinRange: 10,
      evaluatePropertyMaxRange: 50,
      evaluateQueryDefaultStats: {
        'pseudo.pseudo_total_elemental_resistance': true,
        'pseudo.pseudo_total_resistance': true,
        'pseudo.pseudo_total_strength': true,
        'pseudo.pseudo_total_life': true,
        'pseudo.pseudo_total_energy_shield': true,
        'pseudo.pseudo_increased_energy_shield': true,
        'pseduo.pseudo_increased_movement_speed': true,
        'explicit.stat_1479533453': true, // Sextant Uses
        'enchant.stat_290368246': true, // Sextant Uses
        'implicit.stat_299373046': true, // Blighted
        'implicit.stat_1792283443': true, // Shaper/Elder influences maps
        'implicit.stat_3624393862': true, // Guardian occupied maps
      },
      evaluateQueryDefaultStatsUnique: true,
      evaluateQueryIndexedRange: ItemSearchIndexed.UpTo3DaysAgo,
      evaluateQueryOnline: true,
      evaluateQueryDebounceTime: 10,
      evaluateQueryFetchCount: 30,
      evaluateModifierMinRange: 10,
      evaluateModifierMaxRange: 50,
      evaluateKeybinding: 'CmdOrCtrl + D',
      evaluateTranslatedItemLanguage: Language.English,
      evaluateTranslatedKeybinding: 'Alt + T',
      evaluatePricing: EvaluatePricing.Clipboard,
      evaluateQueryInitialSearch: false,
      evaluateBrowserAlwaysExternal: false,
    }
    return {
      name: 'evaluate.name',
      component: EvaluateSettingsComponent,
      defaultSettings,
    }
  }

  public getFeatures(settings: EvaluateUserSettings): Feature[] {
    return [
      {
        name: 'evaluate',
        accelerator: settings.evaluateKeybinding,
      },
      {
        name: 'evaluate-translate',
        accelerator: settings.evaluateTranslatedKeybinding,
      },
    ]
  }

  public run(feature: string, settings: EvaluateUserSettings): void {
    switch (feature) {
      case 'evaluate':
        this.evaluateService.evaluate(settings).subscribe()
        break
      case 'evaluate-translate':
        this.evaluateService.evaluate(settings, settings.evaluateTranslatedItemLanguage).subscribe()
        break
      default:
        break
    }
  }
}
