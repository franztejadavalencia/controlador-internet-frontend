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
import { DataSourceNetworkDetail } from './data-source-network-detail';
import { debounceTime, firstValueFrom } from 'rxjs';
import { OutNetworkDetails } from '../../../../core/models/dialog-data.model';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { MSG } from '../../../../core/constants/messages.constants';
import { Subscription } from '../../../../core/models/subscription.model';
import { Confirm } from 'notiflix';
import { notifyApiError } from '../../../../shared/utils/error.util';
import { NetworkDetailService } from '../../../../core/services/network-detail.service';
import { DeviceTypeService } from '../../../../core/services/device-type.service';
import { DeviceType } from '../../../../core/models/device-type.model';
import { CreateNetworkDetailDto, NetworkDetail } from '../../../../core/models/network-detail.model';
import { NetworkDetailFormComponent } from './../../pages/network-detail-form/network-detail-form.component';

@Component({
  selector: 'app-network-detail.component',
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
  templateUrl: './network-detail.component.html',
  styleUrl: './network-detail.component.scss',
})
export class NetworkDetailComponent implements OnInit {
  private networkDetailService = inject(NetworkDetailService);
  private subscriptionService = inject(SubscriptionService);
  private deviceTypeService = inject(DeviceTypeService);
  readonly dialog = inject(MatDialog);
  networkDetail: NetworkDetail[] = [];
  subscriptions: Subscription[] = [];
  deviceTypes: DeviceType[] = [];
  dsNetworkDetail = new DataSourceNetworkDetail();
  inputSearch = new FormControl('', { nonNullable: true });
  columns: string[] = ['deviceHostName', 'deviceType', 'ipAddress', 'macAddress', 'actions'];

  ngOnInit() {
    this.getAllNetworkDetail();
    this.getAllSubscription();
    this.getAllDeviceType();
    this.inputSearch.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.dsNetworkDetail.find(value);
    });
  }

  getAllNetworkDetail() {
    this.networkDetailService.getAll().subscribe({
      next: (res) => {
        this.networkDetail = res;
      },
      error: () => {},
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

  getAllDeviceType() {
    this.deviceTypeService.getAll().subscribe({
      next: (res) => {
        this.deviceTypes = res;
      },
      error: () => {},
    });
  }

  async handleNetworkDetailDialog(result: OutNetworkDetails, networkDetail: NetworkDetail | null) {
    Loading.circle(networkDetail ? MSG.LOAD.UPDATING : MSG.LOAD.SAVING);
    const payload: CreateNetworkDetailDto = {
      ...result.networkDetail,
    };
    try {
      if (!networkDetail) {
        await firstValueFrom(this.networkDetailService.create(payload));
      } else {
        await firstValueFrom(this.networkDetailService.update(networkDetail.idNetworkDetail, payload));
      }
      Notify.success(networkDetail ? MSG.SUCCESS.UPDATE : MSG.SUCCESS.ADD);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllNetworkDetail();
    }
  }

  openNetworkDetailDialog(networkDetail: NetworkDetail | null) {
    const dialogRef = this.dialog.open(NetworkDetailFormComponent, {
      disableClose: true,
      data: {
        networkDetail,
        subscriptions: this.subscriptions,
        deviceTypes: this.deviceTypes,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handleNetworkDetailDialog(result as OutNetworkDetails, networkDetail);
      }
    });
  }

  onConfirmDeleteNetworkDetail(id: NetworkDetail['idNetworkDetail']) {
    Confirm.show(
      MSG.TITLE.CONFIRM,
      MSG.CONFIRM.DELETE,
      MSG.ACCEPT,
      MSG.CANCEL,
      () => this.deleteNetworkDetail(id),
      () => {},
      {
        okButtonBackground: '#1d4ed8',
        titleColor: '#1e3a8a'
      }
    );
  }

  async deleteNetworkDetail(id: NetworkDetail['idNetworkDetail']) {
    Loading.circle(MSG.LOAD.DELETING);
    try {
      await firstValueFrom(this.networkDetailService.delete(id));
      Notify.success(MSG.SUCCESS.DELETE);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllNetworkDetail();
    }
  }

  clearSearch() {
    this.inputSearch.setValue('');
  }
}
