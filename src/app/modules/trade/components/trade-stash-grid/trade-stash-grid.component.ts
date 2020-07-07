import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Input,
  ViewChild,
  Renderer2,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core'
import ItemLocation from '@modules/trade/class/ItemLocation'

const GRID_SIZE_UNIT: number = 0.5;
const GRID_POSITION_UNIT: number = 0.5 * 12; // GRID_SIZE_UNIT is per cell and we have 12

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
  @Input() public dropShadow: boolean;
  @Input() public darkerShadow: boolean;

  @Input() public demo: boolean;

  /**
   * Grid Resizing
   */
  width: number = 53;
  pxWidth = () => `${this.width}px`;
  height: number = 53;
  pxHeight = () => `${this.height}px`;
  @Input() gridLocation: GridLocation;
  top: number;
  @Output() evTop = new EventEmitter<number>();
  left: number;
  @Output() evLeft = new EventEmitter<number>();

  constructor(private cd: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    this.top = this.gridLocation.top;
    this.left = this.gridLocation.left;
  }

  public ngAfterViewInit(): void {
  }

  public ngOnDestroy(): void { }

  resize(side: string, increment: number = 1): void {
    switch (side) {
      case 'right':
        this.width += (GRID_SIZE_UNIT * increment);
        this.cd.detectChanges();
        break;

      case 'bottom':
        this.height += (GRID_SIZE_UNIT * increment);
        this.cd.detectChanges();
        break;

      case 'top':
        this.top += (GRID_POSITION_UNIT * increment);
        this.evTop.emit(this.top);
        console.log(this.top)
        break;

      case 'left':
        this.left += (GRID_POSITION_UNIT * increment);
        this.evLeft.emit(this.left);
        break;
    }
  }
}
