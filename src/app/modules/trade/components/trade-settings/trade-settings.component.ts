import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  Input,
} from '@angular/core'
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type'
import { BehaviorSubject } from 'rxjs'
import { SelectListItem } from '@shared/module/material/component/select-list/select-list.component'

export interface TradeUserSettings extends UserSettings {
  tradeThanksWhisper: string
  tradeBusyWhisper: string
  tradeSoldWhisper: string
  tradeStillInterestedWhisper: string
  tradeAutoKick: boolean
  tradeAutoWhisper: boolean
}

@Component({
  selector: 'app-trade-settings',
  templateUrl: './trade-settings.component.html',
  styleUrls: ['./trade-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeSettingsComponent implements UserSettingsComponent {
  public settings: TradeUserSettings
  public $stats = new BehaviorSubject<SelectListItem[]>([])

  public load(): void {
    const options: SelectListItem[] = [
      {
        key: 'autoKick',
        text: 'Auto-Kick',
        selected: true,
      },
    ]

    this.$stats.next(options)
  }

  public onStatsChange(stats: SelectListItem[]): void {
    stats.forEach((stat) => {
      switch (stat.key) {
        case 'autoKick':
          this.settings.tradeAutoKick = stat.selected
      }
    })
  }

  public addToWhisper(settingName: string, value: string): void {
    this.settings[settingName] += value
  }
}
