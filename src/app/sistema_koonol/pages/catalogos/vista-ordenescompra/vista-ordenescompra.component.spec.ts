import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaOrdenescompraComponent } from './vista-ordenescompra.component';

describe('VistaOrdenescompraComponent', () => {
  let component: VistaOrdenescompraComponent;
  let fixture: ComponentFixture<VistaOrdenescompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaOrdenescompraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaOrdenescompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
