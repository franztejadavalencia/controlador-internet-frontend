import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subscription } from './../../../../core/models/subscription.model';
import { InSubscription } from './../../../../core/models/dialog-data.model';
import { MSG } from '../../../../core/constants/messages.constants';
import { Confirm } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Client } from '../../../../core/models/client.model';
import { Plan } from '../../../../core/models/plan.model';
import { SubscriptionStatus } from '../../../../core/models/subscription-status.model';
import { AutocompleteObjectComponent } from './../../../../shared/components/autocomplete-object/autocomplete-object.component';

@Component({
  selector: 'app-subscription-form.component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSlideToggleModule,
    AutocompleteObjectComponent,
  ],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss',
})
export class SubscriptionFormComponent {
  private fb = inject(FormBuilder);
  formSubscription: FormGroup;
  dialogRef = inject(MatDialogRef<SubscriptionFormComponent>);
  data = inject<InSubscription>(MAT_DIALOG_DATA);
  subscription!: Subscription | null;
  clients: Client[] = [];
  plans: Plan[] = [];
  subscriptionStatus: SubscriptionStatus[] = [];

  displayPlan = (p: Plan): string => p ? p?.name : '';
  getIdPlan = (p: Plan): any => p.idPlan;

  displayClient = (p: Client): string => p ? `${p?.person?.firstName} ${p?.person?.lastName}` : '';
  getIdClient = (p: Client): any => p.idClient;

  displaySubscriptionStatus = (p: SubscriptionStatus): string => p ? p.name : '';
  getIdSubscriptionStatus = (p: SubscriptionStatus): any => p.idSubscriptionStatus;

  constructor() {
    this.subscription = this.data.subscription;
    this.clients = this.data.clients;
    this.plans = this.data.plans;
    this.subscriptionStatus = this.data.subscriptionStatus;
    this.formSubscription = this.fb.group({
      idClient: [null, Validators.required],
      idPlan: [null, Validators.required],
      idSubscriptionStatus: [null, Validators.required],
      expirationDate: [null],
    });
    if (this.subscription) {
      this.formSubscription.patchValue({
        idClient: +this.subscription.idClient,
        idPlan: +this.subscription.idPlan,
        idSubscriptionStatus: +this.subscription.idSubscriptionStatus,
        expirationDate: this.subscription.expirationDate,
      });
    }
  }

  get controlIdClient(): FormControl {
    return this.formSubscription.get('idClient') as FormControl;
  }
  get controlIdPlan(): FormControl {
    return this.formSubscription.get('idPlan') as FormControl;
  }
  get controlIdSubscriptionStatus(): FormControl {
    return this.formSubscription.get('idSubscriptionStatus') as FormControl;
  }

  onConfirmSave() {
    if (this.formSubscription.valid) {
      Confirm.show(
        MSG.TITLE.CONFIRM,
        this.subscription
          ? MSG.CONFIRM.UPDATE
          : MSG.CONFIRM.ADD,
        MSG.ACCEPT,
        MSG.CANCEL,
        () => this.onSave(),
        () => {},
        {
          okButtonBackground: '#1d4ed8',
          titleColor: '#1e3a8a'
        }
      );
    } else {
      Notify.failure(MSG.ERROR.FORM);
    }
  }

  onSave() {
    this.dialogRef.close({
      subscription: this.formSubscription.getRawValue(),
    });
  }

  onConfirmClose() {
    Confirm.show(
      MSG.TITLE.CONFIRM,
      MSG.CONFIRM.CLOSE,
      MSG.ACCEPT,
      MSG.CANCEL,
      () => this.onClose(),
      () => {},
      {
        okButtonBackground: '#1d4ed8',
        titleColor: '#1e3a8a'
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }
}
