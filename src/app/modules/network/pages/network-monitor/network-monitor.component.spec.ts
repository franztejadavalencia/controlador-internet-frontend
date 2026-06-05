import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkMonitorComponent } from './network-monitor.component';

describe('NetworkMonitorComponent', () => {
  let component: NetworkMonitorComponent;
  let fixture: ComponentFixture<NetworkMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkMonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
