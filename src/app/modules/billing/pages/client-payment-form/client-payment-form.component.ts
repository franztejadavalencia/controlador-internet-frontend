import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Client } from './../../../../core/models/client.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InClientPayment } from './../../../../core/models/dialog-data.model';
import { ClientPaymentRow } from '../../../../core/models/client-payment-row.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-client-payment-form.component',
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatTableModule,
  ],
  templateUrl: './client-payment-form.component.html',
  styleUrl: './client-payment-form.component.scss',
})
export class ClientPaymentFormComponent {
  private fb = inject(FormBuilder);
  formClient: FormGroup;
  dialogRef = inject(MatDialogRef<ClientPaymentFormComponent>);
  data = inject<InClientPayment>(MAT_DIALOG_DATA);
  client: Client;
  clientPayments: ClientPaymentRow[] = [];
  columns: string[] = ['subscriptionCode', 'expirationDate', 'paymentDate', 'monthsPayed', 'amount'];

  constructor() {
    this.client = this.data.client;
    this.clientPayments = this.getHistorial(this.client);
    this.formClient = this.fb.group({
    });
  }

  getHistorial(clientData: Client): ClientPaymentRow[] {
    if (!clientData || !clientData.subscriptions) {
      return [];
    }
  
    return clientData.subscriptions.flatMap((sub: any) => {
      if (!sub.payments) return [];
  
      return sub.payments.map((pay: any): ClientPaymentRow => ({
        subscriptionCode: sub.code,
        expirationDate: sub.expirationDate,
        paymentDate: pay.paymentDate,
        monthsPayed: pay.montsPayed,
        amount: pay.amount
      }));
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
