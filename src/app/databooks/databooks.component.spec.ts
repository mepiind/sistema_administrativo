import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabooksComponent } from './databooks.component';

describe('DatabooksComponent', () => {
  let component: DatabooksComponent;
  let fixture: ComponentFixture<DatabooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
