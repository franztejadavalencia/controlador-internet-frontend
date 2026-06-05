import { Component,inject, OnInit, OnDestroy, computed } from '@angular/core';
import { NetworkDiscoveryService } from '../../../../core/services/network-discovery.service';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Device } from '../../../../core/models/device.model';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Confirm } from 'notiflix';
import { MSG } from '../../../../core/constants/messages.constants';

@Component({
  selector: 'app-network-monitor.component',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatTableModule,
  ],
  templateUrl: './network-monitor.component.html',
  styleUrl: './network-monitor.component.scss',
})
export class NetworkMonitorComponent implements OnInit, OnDestroy {
  private networkDiscoveryService = inject(NetworkDiscoveryService);
  dialogRef = inject(MatDialogRef<NetworkMonitorComponent>);
  devices = this.networkDiscoveryService.devices;
  isConnected = this.networkDiscoveryService.idConnected;
  totalDevices = computed(() => this.devices().length);
  columns: string[] = [
    'deviceHostname',
    'macAddress',
    'ipAddress',
    'actions',
  ];

  ngOnInit() {
    this.networkDiscoveryService.startDiscovery();
  }

  ngOnDestroy() {
    this.networkDiscoveryService.stopDiscovery();
  }

  onConfirmSelectedDevice(device: Device) {
    Confirm.show(
      MSG.TITLE.CONFIRM,
      MSG.CONFIRM.SELECT_DEVICE,
      MSG.ACCEPT,
      MSG.CANCEL,
      () => this.onSelectedDevice(device),
      () => {},
      {
        okButtonBackground: '#1d4ed8',
        titleColor: '#1e3a8a'
      }
    );
  }

  onSelectedDevice(device: Device) {
    this.networkDiscoveryService.stopDiscovery();
    this.dialogRef.close({
      device,
    });
  }

  onConfirmClose() {
    Confirm.show(
      MSG.TITLE.CONFIRM,
      MSG.CONFIRM.NOT_SELECT_DEVICE,
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
    this.networkDiscoveryService.stopDiscovery();
    this.dialogRef.close();
  }
}
