import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlVisitasComponent } from './control-visitas.component';

describe('ControlVisitasComponent', () => {
  let component: ControlVisitasComponent;
  let fixture: ComponentFixture<ControlVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlVisitasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
