import { Component, OnInit } from '@angular/core';
import { SubscriptionStatusService } from '../../../../core/services/subscription-status.service';
import { Subscription } from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-payment.component',
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.getAllSubscription();
  }

  getAllSubscription() {
    this.subscriptionService.getAll().subscribe({
      next: (res) => {
        this.subscriptions = res;
      },
      error: () => {},
    });
  }
}
