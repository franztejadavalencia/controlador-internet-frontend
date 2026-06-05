import { Injectable, signal, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root',
})
export class NetworkDiscoveryService {
  private socket!: Socket;

  private _devices = signal<Device[]>([]);
  private _isConnected = signal<boolean>(false);

  public devices = this._devices.asReadonly();
  public idConnected = this._isConnected.asReadonly();

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    const socketUrl = environment.apiUrl.replace('/api', ''); 

    this.socket = io(socketUrl, {
      transports: ['websocket'],
      path: '/socket.io',
      autoConnect: false,
    });

    this.socket.on('connect', () => {
      this._isConnected.set(true);
      console.log('Conectado exitosamente al canal de WebSockets');
    });

    this.socket.on('disconnect', () => {
      this._isConnected.set(false);
    });

    this.socket.on('new_device_detected', (devices: Device[]) => {
      this._devices.set(devices);
    });
  }

  startDiscovery() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
    this.socket.emit('start_discovery');
  }

  stopDiscovery() {
    this.socket.emit('stop_discovery');
    this.socket.disconnect();
  }

  ngOnDestroy() {
    this.stopDiscovery();
  }
}
