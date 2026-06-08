import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPaymentFormComponent } from './client-payment-form.component';

describe('ClientPaymentFormComponent', () => {
  let component: ClientPaymentFormComponent;
  let fixture: ComponentFixture<ClientPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPaymentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
