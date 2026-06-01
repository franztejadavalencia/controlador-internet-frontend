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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Plan } from './../../../../core/models/plan.model';
import { InPlan } from './../../../../core/models/dialog-data.model';
import { MSG } from '../../../../core/constants/messages.constants';
import { Confirm } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Component({
  selector: 'app-plan-form.component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSlideToggleModule,
  ],
  templateUrl: './plan-form.component.html',
  styleUrl: './plan-form.component.scss',
})
export class PlanFormComponent {
  private fb = inject(FormBuilder);
  formPlan: FormGroup;
  dialogRef = inject(MatDialogRef<PlanFormComponent>);
  data = inject<InPlan>(MAT_DIALOG_DATA);
  plan!: Plan | null;

  constructor() {
    this.plan = this.data.plan
    this.formPlan = this.fb.group({
      name: ['', Validators.required],
      downloadSpeed: [0, Validators.required],
      uploadSpeed: [0, Validators.required],
      price: [0, Validators.required],
      isActive: [false, Validators.required],
    });
    if (this.plan) {
      this.formPlan.patchValue({
        ...this.plan,
        price: +this.plan.price,
      });
    }
  }

  onConfirmSave() {
    if (this.formPlan.valid) {
      Confirm.show(
        MSG.TITLE.CONFIRM,
        this.plan
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
      plan: this.formPlan.getRawValue(),
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
