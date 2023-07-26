import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaClienteComponent } from './visita-cliente.component';

describe('VisitaClienteComponent', () => {
  let component: VisitaClienteComponent;
  let fixture: ComponentFixture<VisitaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitaClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
