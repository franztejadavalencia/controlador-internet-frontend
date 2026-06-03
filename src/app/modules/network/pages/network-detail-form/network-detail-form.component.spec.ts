import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDetailFormComponent } from './network-detail-form.component';

describe('NetworkDetailFormComponent', () => {
  let component: NetworkDetailFormComponent;
  let fixture: ComponentFixture<NetworkDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkDetailFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
