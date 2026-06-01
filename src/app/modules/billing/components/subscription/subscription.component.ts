import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { DataSourceSubscription } from './data-source-subscription';
import { debounceTime, firstValueFrom } from 'rxjs';
import { OutSubscription } from '../../../../core/models/dialog-data.model';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { MSG } from '../../../../core/constants/messages.constants';
import { CreateSubscriptionDto, Subscription } from '../../../../core/models/subscription.model';
import { SubscriptionFormComponent } from '../../pages/subscription-form/subscription-form.component';
import { Confirm } from 'notiflix';
import { notifyApiError } from '../../../../shared/utils/error.util';
import { PlanService } from '../../../../core/services/plan.service';
import { Plan } from '../../../../core/models/plan.model';
import { SubscriptionStatusService } from '../../../../core/services/subscription-status.service';
import { SubscriptionStatus } from '../../../../core/models/subscription-status.model';
import { ClientService } from '../../../../core/services/client.service';
import { Client } from '../../../../core/models/client.model';

@Component({
  selector: 'app-subscription.component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatPaginator,
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private planService = inject(PlanService);
  private subscriptionStatusService = inject(SubscriptionStatusService);
  private clientService = inject(ClientService);
  readonly dialog = inject(MatDialog);
  plans: Plan[] = [];
  subscriptionStatus: SubscriptionStatus[] = [];
  clients: Client[] = [];
  dsSubscription = new DataSourceSubscription();
  inputSearch = new FormControl('', { nonNullable: true });
  columns: string[] = ['client', 'plan', 'expirationDate', 'subscriptionStatus', 'actions'];

  ngOnInit() {
    this.getAllSubscription();
    this.getAllClient();
    this.getAllPlan();
    this.getAllSubscriptionStatus();
    this.inputSearch.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.dsSubscription.find(value);
    });
  }

  getAllSubscription() {
    this.subscriptionService.getAll().subscribe({
      next: (res) => {
        this.dsSubscription.init(res);
      },
      error: () => {},
    });
  }

  getAllClient() {
    this.clientService.getAll().subscribe({
      next: (res) => {
        this.clients = res;
      },
      error: () => {},
    });
  }

  getAllPlan() {
    this.planService.getAll().subscribe({
      next: (res) => {
        this.plans = res;
      },
      error: () => {},
    });
  }

  getAllSubscriptionStatus() {
    this.subscriptionStatusService.getAll().subscribe({
      next: (res) => {
        this.subscriptionStatus = res;
      },
      error: () => {},
    });
  }

  async handleSubscriptionDialog(result: OutSubscription, subscription: Subscription | null) {
    Loading.circle(subscription ? MSG.LOAD.UPDATING : MSG.LOAD.SAVING);
    const payload: CreateSubscriptionDto = {
      ...result.subscription,
    };
    try {
      if (!subscription) {
        await firstValueFrom(this.subscriptionService.create(payload));
      } else {
        await firstValueFrom(this.subscriptionService.update(subscription.idSubscription, payload));
      }
      Notify.success(subscription ? MSG.SUCCESS.UPDATE : MSG.SUCCESS.ADD);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllSubscription();
    }
  }

  openSubscriptionDialog(subscription: Subscription | null) {
    const dialogRef = this.dialog.open(SubscriptionFormComponent, {
      disableClose: true,
      data: {
        subscription,
        plans: this.plans,
        clients: this.clients,
        subscriptionStatus: this.subscriptionStatus,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handleSubscriptionDialog(result as OutSubscription, subscription);
      }
    });
  }

  onConfirmDeleteSubscription(id: Subscription['idSubscription']) {
    Confirm.show(
      MSG.TITLE.CONFIRM,
      MSG.CONFIRM.DELETE,
      MSG.ACCEPT,
      MSG.CANCEL,
      () => this.deleteSubscription(id),
      () => {},
      {
        okButtonBackground: '#1d4ed8',
        titleColor: '#1e3a8a'
      }
    );
  }

  async deleteSubscription(id: Subscription['idSubscription']) {
    Loading.circle(MSG.LOAD.DELETING);
    try {
      await firstValueFrom(this.subscriptionService.delete(id));
      Notify.success(MSG.SUCCESS.DELETE);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllSubscription();
    }
  }

  clearSearch() {
    this.inputSearch.setValue('');
  }
}
