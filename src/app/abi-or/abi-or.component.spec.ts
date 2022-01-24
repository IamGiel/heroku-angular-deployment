import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbiOrComponent } from './abi-or.component';

describe('AbiOrComponent', () => {
  let component: AbiOrComponent;
  let fixture: ComponentFixture<AbiOrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbiOrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbiOrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
