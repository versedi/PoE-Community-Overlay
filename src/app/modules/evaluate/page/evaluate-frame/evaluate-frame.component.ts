import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FrameData, FrameService } from '@app/service';
import { EvaluateResult } from '@modules/evaluate/type/evaluate.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-evaluate-frame',
  templateUrl: './evaluate-frame.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class EvaluateFrameComponent implements OnInit {
  public data$: Observable<FrameData>;

  constructor(private readonly frame: FrameService) { }

  public ngOnInit(): void {
    this.data$ = this.frame.get();
  }

  public onClose(result: EvaluateResult): void {
    this.frame.close(result);
  }
}
