import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestsComponent } from './pending-requests.component';

describe('PendingRequestsComponent', () => {
  let component: PendingRequestsComponent;
  let fixture: ComponentFixture<PendingRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
