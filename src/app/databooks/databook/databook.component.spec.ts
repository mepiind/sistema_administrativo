import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabookComponent } from './databook.component';

describe('DatabookComponent', () => {
  let component: DatabookComponent;
  let fixture: ComponentFixture<DatabookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
