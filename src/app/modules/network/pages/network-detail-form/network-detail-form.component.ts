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
import { InNetworkDetails, OutNetworkMonitor } from './../../../../core/models/dialog-data.model';
import { MSG } from '../../../../core/constants/messages.constants';
import { Confirm } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { AutocompleteObjectComponent } from './../../../../shared/components/autocomplete-object/autocomplete-object.component';
import { NetworkDetail } from '../../../../core/models/network-detail.model';
import { Subscription } from '../../../../core/models/subscription.model';
import { DeviceType } from '../../../../core/models/device-type.model';
import { MatDialog } from '@angular/material/dialog';
import { NetworkMonitorComponent } from '../network-monitor/network-monitor.component';

@Component({
  selector: 'app-network-detail-form.component',
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
  templateUrl: './network-detail-form.component.html',
  styleUrl: './network-detail-form.component.scss',
})
export class NetworkDetailFormComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  formNetworkDetail: FormGroup;
  dialogRef = inject(MatDialogRef<NetworkDetailFormComponent>);
  data = inject<InNetworkDetails>(MAT_DIALOG_DATA);
  networkDetail!: NetworkDetail | null;
  subscriptions: Subscription[] = [];
  deviceTypes: DeviceType[] = [];
  displaySubscription = (p: Subscription): string => p?.code ?? '';
  getIdSubscription = (p: Subscription): any => p?.idSubscription;

  displayDeviceType = (p: DeviceType): string => p?.name ?? '';
  getIdDeviceType = (p: DeviceType): any => p?.idDeviceType;

  constructor() {
    this.networkDetail = this.data.networkDetail;
    this.subscriptions = this.data.subscriptions;
    this.deviceTypes = this.data.deviceTypes;
    this.formNetworkDetail = this.fb.group({
      idSubscription: [null, Validators.required],
      deviceHostname: [null, Validators.required],
      macAddress: [null, Validators.required],
      ipAddress: [null, Validators.required],
      idDeviceType: [null, Validators.required],
    });
    if (this.networkDetail) {
      this.formNetworkDetail.patchValue(this.networkDetail);
    }
  }

  get controlIdSubscription(): FormControl {
    return this.formNetworkDetail.get('idSubscription') as FormControl;
  }
  get controlIdDeviceType(): FormControl {
    return this.formNetworkDetail.get('idDeviceType') as FormControl;
  }

  onConfirmSave() {
    if (this.formNetworkDetail.valid) {
      Confirm.show(
        MSG.TITLE.CONFIRM,
        this.networkDetail
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
      networkDetail: this.formNetworkDetail.getRawValue(),
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

  async handleNetworkMonitorDialog(result: OutNetworkMonitor) {
    this.formNetworkDetail.get('deviceHostname')?.setValue(result.device.deviceHostname);
    this.formNetworkDetail.get('ipAddress')?.setValue(result.device.ipAddress);
    this.formNetworkDetail.get('macAddress')?.setValue(result.device.macAddress);
  }

  openSelectDevice() {
    const nmDialogRef = this.dialog.open(NetworkMonitorComponent, {
      data: {},
    });
    nmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handleNetworkMonitorDialog(result as OutNetworkMonitor);
      }
    });
  }
}
