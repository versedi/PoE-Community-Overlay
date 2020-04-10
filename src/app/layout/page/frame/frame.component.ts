import { ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppTranslateService, WindowService } from '@app/service';
import { FrameService } from '@app/service/frame.service';
import { FEATURE_MODULES } from '@app/token';
import { FeatureModule } from '@app/type';
import { ContextService } from '@shared/module/poe/service';
import { UserSettingsService } from '../../service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrameComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(FEATURE_MODULES)
    private readonly modules: FeatureModule[],
    private readonly settings: UserSettingsService,
    private readonly window: WindowService,
    private readonly context: ContextService,
    private readonly translate: AppTranslateService,
    private readonly frame: FrameService,
    private readonly route: ActivatedRoute) {
  }

  @HostListener('window:beforeunload', [])
  public onWindowBeforeUnload(): void {
    this.removeAllListeners();
  }

  public ngOnInit(): void {
    this.createTitlebar();
    const counter = +this.route.snapshot.paramMap.get('counter');

    this.settings.init(this.modules).subscribe(settings => {
      this.translate.use(settings.uiLanguage);
      this.window.setZoom(settings.zoom / 100);

      const { language, leagueId } = settings;
      this.context.init({ language, leagueId }).subscribe(() => {
        this.frame.ready(counter);
      });
    });
  }

  public ngOnDestroy(): void {
    this.removeAllListeners();
  }

  private createTitlebar(): void {
    const { Titlebar, Color } = window.require('custom-electron-titlebar');
    new Titlebar({
      backgroundColor: Color.fromHex('#7f7f7f'),
      menu: null,
      hideWhenClickingClose: true,
      maximize: false,
    });
  }

  private removeAllListeners(): void {
    this.window.removeAllListeners();
  }
}
