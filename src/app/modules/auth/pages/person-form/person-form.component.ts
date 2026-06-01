import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
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
import { Person } from './../../../../core/models/person.model';
import { InPerson } from './../../../../core/models/dialog-data.model';
import { MSG } from '../../../../core/constants/messages.constants';
import { Confirm } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Component({
  selector: 'app-person-form.component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.scss',
})
export class PersonFormComponent {
  private fb = inject(FormBuilder);
  formPerson: FormGroup;
  dialogRef = inject(MatDialogRef<PersonFormComponent>);
  data = inject<InPerson>(MAT_DIALOG_DATA);
  person!: Person | null;

  constructor() {
    this.person = this.data.person
    this.formPerson = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      ci: ['', Validators.required],
      email: ['', Validators.required],
    });
    if (this.person) {
      this.formPerson.patchValue(this.person);
    }
  }

  onConfirmSave() {
    if (this.formPerson.valid) {
      Confirm.show(
        MSG.TITLE.CONFIRM,
        this.person
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
      person: this.formPerson.value,
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
