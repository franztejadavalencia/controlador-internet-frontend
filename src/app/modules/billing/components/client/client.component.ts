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
import { ClientService } from '../../../../core/services/client.service';
import { DataSourceClient } from './data-source-client';
import { debounceTime, firstValueFrom } from 'rxjs';
import { OutClient } from '../../../../core/models/dialog-data.model';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { MSG } from '../../../../core/constants/messages.constants';
import { CreateClientDto, Client } from '../../../../core/models/client.model';
import { ClientFormComponent } from '../../pages/client-form/client-form.component';
import { Confirm } from 'notiflix';
import { notifyApiError } from '../../../../shared/utils/error.util';
import { PersonService } from '../../../../core/services/person.service';
import { Person } from '../../../../core/models/person.model';
import { ClientType } from '../../../../core/models/client-type.model';
import { ClientTypeService } from '../../../../core/services/client-type.service';

@Component({
  selector: 'app-client.component',
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
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent implements OnInit {
  private clientService = inject(ClientService);
  private personService = inject(PersonService);
  private clientTypeService = inject(ClientTypeService);
  readonly dialog = inject(MatDialog);
  persons: Person[] = [];
  clientTypes: ClientType[] = [];
  dsClient = new DataSourceClient();
  inputSearch = new FormControl('', { nonNullable: true });
  columns: string[] = ['code', 'name', 'clientType', 'actions'];

  ngOnInit() {
    this.getAllClient();
    this.getAllPerson();
    this.getAllClientType();
    this.inputSearch.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.dsClient.find(value);
    });
  }

  getAllClient() {
    this.clientService.getAll().subscribe({
      next: (res) => {
        this.dsClient.init(res);
      },
      error: () => {},
    });
  }

  getAllPerson() {
    this.personService.getAll().subscribe({
      next: (res) => {
        this.persons = res;
      },
      error: () => {},
    });
  }

  getAllClientType() {
    this.clientTypeService.getAll().subscribe({
      next: (res) => {
        this.clientTypes = res;
      },
      error: () => {},
    });
  }

  async handleClientDialog(result: OutClient, client: Client | null) {
    Loading.circle(client ? MSG.LOAD.UPDATING : MSG.LOAD.SAVING);
    const payload: CreateClientDto = {
      ...result.client,
    };
    try {
      if (!client) {
        await firstValueFrom(this.clientService.create(payload));
      } else {
        await firstValueFrom(this.clientService.update(client.idClient, payload));
      }
      Notify.success(client ? MSG.SUCCESS.UPDATE : MSG.SUCCESS.ADD);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllClient();
    }
  }

  openClientDialog(client: Client | null) {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      disableClose: true,
      data: {
        client,
        persons: this.persons,
        clientTypes: this.clientTypes,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handleClientDialog(result as OutClient, client);
      }
    });
  }

  onConfirmDeleteClient(id: Client['idClient']) {
    Confirm.show(
      MSG.TITLE.CONFIRM,
      MSG.CONFIRM.DELETE,
      MSG.ACCEPT,
      MSG.CANCEL,
      () => this.deleteClient(id),
      () => {},
      {
        okButtonBackground: '#1d4ed8',
        titleColor: '#1e3a8a'
      }
    );
  }

  async deleteClient(id: Client['idClient']) {
    Loading.circle(MSG.LOAD.DELETING);
    try {
      await firstValueFrom(this.clientService.delete(id));
      Notify.success(MSG.SUCCESS.DELETE);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllClient();
    }
  }

  clearSearch() {
    this.inputSearch.setValue('');
  }
}
