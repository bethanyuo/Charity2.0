import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorHomeComponent } from './contractor-home.component';

describe('ContractorHomeComponent', () => {
  let component: ContractorHomeComponent;
  let fixture: ComponentFixture<ContractorHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
