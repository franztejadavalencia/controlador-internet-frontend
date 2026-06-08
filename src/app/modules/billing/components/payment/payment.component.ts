import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { PaymentService } from '../../../../core/services/payment.service';
import { Subscription } from '../../../../core/models/subscription.model';
import { CreatePaymentDto } from '../../../../core/models/payment.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Confirm } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { notifyApiError } from '../../../../shared/utils/error.util';
import { AutocompleteObjectComponent } from '../../../../shared/components/autocomplete-object/autocomplete-object.component';
import { MSG } from '../../../../core/constants/messages.constants';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-payment.component',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatToolbarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    AutocompleteObjectComponent,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  private fb = inject(FormBuilder);
  formPayment: FormGroup;
  subscriptionSelect = new FormControl('', { nonNullable: true });
  private subscriptionService = inject(SubscriptionService);
  private paymentService = inject(PaymentService);
  subscriptions: Subscription[] = [];
  selectedSubscription: Subscription | null = null;
  private planUnitPrice = 0;

  displaySubscription = (s: Subscription): string =>
    s?.code ?? '';
  getIdSubscription = (s: Subscription): any =>
    s.idSubscription;
  get controlIdSubscription() {
    return this.subscriptionSelect.value;
  }

  constructor() {
    this.formPayment = this.fb.group({
      expirationDate: [{ value: '', disabled: true }],
      planName: [{ value: '', disabled: true }],
      downloadSpeed: [{ value: null as number | null, disabled: true }],
      uploadSpeed: [{ value: null as number | null, disabled: true }],
      price: [{ value: '', disabled: true }],
      clientCode: [{ value: '', disabled: true }],
      subscriptionStatusName: [{ value: '', disabled: true }],
      montsPayed: [null, [Validators.required, Validators.min(1)]],
      idSubscription: [null, Validators.required],
      amount: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getAllSubscription();
    this.subscriptionSelect.valueChanges.subscribe((value) => {
      const parsed = parseInt(value, 10);
      if (parsed) {
        this.getOneSubscription(parsed);
      } else {
        this.resetPaymentForm();
      }
    });
    this.formPayment.get('montsPayed')!.valueChanges.subscribe((months) => {
      this.updatePriceByMonths(months);
    });
  }

  getAllSubscription() {
    this.subscriptionService.getAll().subscribe({
      next: (res) => {
        this.subscriptions = res;
      },
      error: () => {},
    });
  }

  getOneSubscription(id: Subscription['idSubscription']) {
    this.subscriptionService.getOne(id).subscribe({
      next: (res) => {
        this.selectedSubscription = res;
        const formattedDate = new Date(this.selectedSubscription.expirationDate)
          .toISOString()
          .slice(0, 16);
        const amount = Number(res.plan?.price ?? 0);
        this.planUnitPrice = amount;
        this.formPayment.patchValue({
          expirationDate: formattedDate ?? '',
          planName: res.plan?.name ?? '',
          downloadSpeed: res.plan?.downloadSpeed ?? null,
          uploadSpeed: res.plan?.uploadSpeed ?? null,
          price: res.plan?.price ?? '',
          clientCode: res.client?.code ?? '',
          subscriptionStatusName: res.subscriptionStatus?.name ?? '',
          montsPayed: null,
          idSubscription: res.idSubscription,
          amount,
        });
      },
      error: (err) => notifyApiError(err),
    });
  }

  private updatePriceByMonths(months: number | null) {
    const parsed = Number(months);
    if (!parsed || parsed < 1) {
      this.formPayment.patchValue(
        { price: this.planUnitPrice, amount: this.planUnitPrice },
        { emitEvent: false },
      );
      return;
    }
    const total = this.planUnitPrice * parsed;
    this.formPayment.patchValue(
      { price: total, amount: total },
      { emitEvent: false },
    );
  }

  resetPaymentForm() {
    this.selectedSubscription = null;
    this.planUnitPrice = 0;
    this.formPayment.reset({
      expirationDate: '',
      planName: '',
      downloadSpeed: null,
      uploadSpeed: null,
      price: '',
      clientCode: '',
      subscriptionStatusName: '',
      montsPayed: null,
      idSubscription: null,
      amount: null,
    });
  }

  onConfirmSave() {
    if (this.formPayment.valid && this.subscriptionSelect.value) {
      Confirm.show(
        MSG.TITLE.CONFIRM,
        MSG.CONFIRM.ADD,
        MSG.ACCEPT,
        MSG.CANCEL,
        () => this.onSave(),
        () => {},
        {
          okButtonBackground: '#1d4ed8',
          titleColor: '#1e3a8a',
        }
      );
    } else {
      Notify.failure(MSG.ERROR.FORM);
    }
  }

  async onSave() {
    const { montsPayed, idSubscription, amount } = this.formPayment.getRawValue();
    const payload: CreatePaymentDto = {
      idSubscription,
      amount,
      montsPayed: montsPayed,
      paymentDate: new Date().toISOString(),
    };
    try {
      await firstValueFrom(this.paymentService.create(payload));
      Notify.success(MSG.SUCCESS.PAYMENT);
      this.subscriptionSelect.reset('');
      this.resetPaymentForm();
    } catch (err) {
      notifyApiError(err);
    }
  }
}
