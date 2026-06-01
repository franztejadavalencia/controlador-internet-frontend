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
import { Client } from './../../../../core/models/client.model';
import { InClient } from './../../../../core/models/dialog-data.model';
import { MSG } from '../../../../core/constants/messages.constants';
import { Confirm } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { AutocompleteObjectComponent } from './../../../../shared/components/autocomplete-object/autocomplete-object.component';
import { Person } from '../../../../core/models/person.model';
import { ClientType } from '../../../../core/models/client-type.model';

@Component({
  selector: 'app-client-form.component',
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
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent {
  private fb = inject(FormBuilder);
  formClient: FormGroup;
  dialogRef = inject(MatDialogRef<ClientFormComponent>);
  data = inject<InClient>(MAT_DIALOG_DATA);
  client!: Client | null;
  persons: Person[] = [];
  clientTypes: ClientType[] = [];
  displayPerson = (p: Person): string => p ? `${p?.firstName} ${p?.lastName}` : '';
  getIdPerson = (p: Person): any => p.idPerson;

  displayClientType = (p: ClientType): string => p ? p.name : '';
  getIdClientType = (p: ClientType): any => p.idClientType;

  constructor() {
    this.client = this.data.client;
    this.persons = this.data.persons;
    this.clientTypes = this.data.clientTypes;
    this.formClient = this.fb.group({
      idPerson: [null, Validators.required],
      idClientType: [null, Validators.required],
    });
    if (this.client) {
      this.formClient.patchValue({
        idPerson: this.client.idPerson,
        idClientType: this.client.idClientType,
      });
    }
  }

  get controlIdPerson(): FormControl {
    return this.formClient.get('idPerson') as FormControl;
  }
  get controlIdClientType(): FormControl {
    return this.formClient.get('idClientType') as FormControl;
  }

  onConfirmSave() {
    if (this.formClient.valid) {
      Confirm.show(
        MSG.TITLE.CONFIRM,
        this.client
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
      client: this.formClient.getRawValue(),
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
