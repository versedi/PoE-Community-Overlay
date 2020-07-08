import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core'
import ItemLocation from '@modules/trade/class/ItemLocation'
import { UserSettingsService } from 'src/app/layout/service';
import { TradeUserSettings } from '../trade-settings/trade-settings.component';
import { WindowService } from '@app/service';

/**
 * Define the grid movement unit when in demo mode
 */
const GRID_SIZE_UNIT: number = 0.5;
const GRID_POSITION_UNIT: number = 0.5 * 12; // GRID_SIZE_UNIT is per cell and we have 12

/**
 * Define the grid X,Y location, based on the CSS position attribute
 */
export interface GridLocation {
  top: number,
  left: number;
}

@Component({
  selector: 'app-trade-stash-grid',
  templateUrl: './trade-stash-grid.component.html',
  styleUrls: ['./trade-stash-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeStashGridComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Item location and size
   */
  @Input() public location: ItemLocation;

  /**
   * Grid settings
   * dropShadow = does the overlay add a shadow on top of the stash
   * darkerShadow = makes the overlay darker
   * demo = define if the grid is displayed in demo mode
   */
  @Input() public dropShadow: boolean;
  @Input() public darkerShadow: boolean;
  @Input() public demo: boolean;

  /**
   * Grid Resizing
   */
  width: number = 0;
  pxWidth = () => `${this.width}px`;
  height: number = 0;
  pxHeight = () => `${this.height}px`;
  @Input() gridLocation: GridLocation;
  top: number;
  @Output() evTop = new EventEmitter<number>();
  left: number;
  @Output() evLeft = new EventEmitter<number>();

  constructor(private cd: ChangeDetectorRef, private settingsService: UserSettingsService) {
    this.setGridSize();
  }

  /**
   * Init the grid size with the settings values
   */
  private setGridSize(): void {
    this.settingsService.get()
      .subscribe(settings => {
        const tradeSettings = <TradeUserSettings>settings;

        let changes: boolean = false;

        if (tradeSettings.tradeOverlayHighlightWidth) {
          changes = true;
          this.width = tradeSettings.tradeOverlayHighlightWidth;
        }

        if (tradeSettings.tradeOverlayHighlightHeight) {
          changes = true;
          this.height = tradeSettings.tradeOverlayHighlightHeight;
        }

        if (changes) {
          this.cd.detectChanges();
        }
      });
  }

  public ngOnInit(): void {
    this.top = this.gridLocation.top;
    this.left = this.gridLocation.left;
  }

  public ngAfterViewInit(): void { }

  public ngOnDestroy(): void { }

  /**
   * Update the grid size and position
   * @param side right, left, top, bottom
   * @param increment 1 or -1. Positive or negative
   */
  resize(side: string, increment: number = 1): void {
    switch (side) {
      case 'right':
        this.settingsService.get()
          .subscribe(settings => {
            const tradeSettings = <TradeUserSettings>settings;

            this.width += (GRID_SIZE_UNIT * increment);

            tradeSettings.tradeOverlayHighlightWidth = this.width;
            this.settingsService.save(tradeSettings);

            this.cd.detectChanges();
          });
        break;

      case 'bottom':
        this.settingsService.get()
          .subscribe(settings => {
            const tradeSettings = <TradeUserSettings>settings;

            this.height += (GRID_SIZE_UNIT * increment);

            tradeSettings.tradeOverlayHighlightHeight = this.height;
            this.settingsService.save(tradeSettings);

            this.cd.detectChanges();
          });
        break;

      case 'top':
        this.top += (GRID_POSITION_UNIT * increment);
        this.evTop.emit(this.top);
        break;

      case 'left':
        this.left += (GRID_POSITION_UNIT * increment);
        this.evLeft.emit(this.left);
        break;
    }
  }
}
