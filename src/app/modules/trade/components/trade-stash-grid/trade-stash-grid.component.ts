import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    Input,
  } from '@angular/core'
  import Offer from '@modules/trade/class/Offer'
  import FloatingButton from '@modules/trade/class/FloatingButton'
  import { TradeService } from '@modules/trade/services/trade.service'
import ItemLocation from '@modules/trade/class/ItemLocation'
  
  @Component({
    selector: 'app-trade-stash-grid',
    templateUrl: './trade-stash-grid.component.html',
    styleUrls: ['./trade-stash-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class TradeStashGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public location: ItemLocation
  
    constructor(private cd: ChangeDetectorRef) {

    }
  
    public ngOnInit(): void {}
  
    public ngAfterViewInit(): void {}
  
    public ngOnDestroy(): void {}
  }
  