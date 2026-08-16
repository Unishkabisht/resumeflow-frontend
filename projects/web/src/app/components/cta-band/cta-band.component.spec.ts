import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaBandComponent } from './cta-band.component';

describe('CtaBandComponent', () => {
  let component: CtaBandComponent;
  let fixture: ComponentFixture<CtaBandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtaBandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtaBandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
