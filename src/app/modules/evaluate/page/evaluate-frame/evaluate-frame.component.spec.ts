import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateFrameComponent } from './evaluate-frame.component';

describe('EvaluateFrameComponent', () => {
  let component: EvaluateFrameComponent;
  let fixture: ComponentFixture<EvaluateFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
