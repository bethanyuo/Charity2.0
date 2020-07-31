import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityRequestsComponent } from './charity-requests.component';

describe('CharityRequestsComponent', () => {
  let component: CharityRequestsComponent;
  let fixture: ComponentFixture<CharityRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
