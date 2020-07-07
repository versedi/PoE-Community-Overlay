import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Input,
} from '@angular/core'
import ItemLocation from '@modules/trade/class/ItemLocation'

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

  constructor() {
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
  }

  public ngOnDestroy(): void { }
}
