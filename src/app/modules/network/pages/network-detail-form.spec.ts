import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDetailForm } from './network-detail-form';

describe('NetworkDetailForm', () => {
  let component: NetworkDetailForm;
  let fixture: ComponentFixture<NetworkDetailForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkDetailForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkDetailForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
