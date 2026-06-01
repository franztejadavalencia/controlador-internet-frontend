import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PlanService } from '../../../../core/services/plan.service';
import { DataSourcePlan } from './data-source-plan';
import { debounceTime, firstValueFrom } from 'rxjs';
import { OutPlan } from '../../../../core/models/dialog-data.model';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { MSG } from '../../../../core/constants/messages.constants';
import { CreatePlanDto, Plan } from '../../../../core/models/plan.model';
import { PlanFormComponent } from '../../pages/plan-form/plan-form.component';
import { Confirm } from 'notiflix';
import { notifyApiError } from '../../../../shared/utils/error.util';

@Component({
  selector: 'app-plan.component',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatPaginator,
  ],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
})
export class PlanComponent {
  private planService = inject(PlanService);
  readonly dialog = inject(MatDialog);
  dsPlan = new DataSourcePlan();
  inputSearch = new FormControl('', { nonNullable: true });
  columns: string[] = ['name', 'downloadSpeed', 'uploadSpeed', 'price', 'isActive', 'actions'];

  ngOnInit() {
    this.getAllPlan();
    this.inputSearch.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.dsPlan.find(value);
    });
  }

  getAllPlan() {
    this.planService.getAll().subscribe({
      next: (res) => {
        this.dsPlan.init(res);
      },
      error: () => {},
    });
  }

  async handlePlanDialog(result: OutPlan, plan: Plan | null) {
    Loading.circle(plan ? MSG.LOAD.UPDATING : MSG.LOAD.SAVING);
    const payload: CreatePlanDto = {
      ...result.plan,
    };
    try {
      if (!plan) {
        await firstValueFrom(this.planService.create(payload));
      } else {
        await firstValueFrom(this.planService.update(plan.idPlan, payload));
      }
      Notify.success(plan ? MSG.SUCCESS.UPDATE : MSG.SUCCESS.ADD);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllPlan();
    }
  }

  openPlanDialog(plan: Plan | null) {
    const dialogRef = this.dialog.open(PlanFormComponent, {
      disableClose: true,
      data: {
        plan,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handlePlanDialog(result as OutPlan, plan);
      }
    });
  }

  onConfirmDeletePlan(id: Plan['idPlan']) {
    Confirm.show(
      MSG.TITLE.CONFIRM,
      MSG.CONFIRM.DELETE,
      MSG.ACCEPT,
      MSG.CANCEL,
      () => this.deletePlan(id),
      () => {},
      {
        okButtonBackground: '#1d4ed8',
        titleColor: '#1e3a8a'
      }
    );
  }

  async deletePlan(id: Plan['idPlan']) {
    Loading.circle(MSG.LOAD.DELETING);
    try {
      await firstValueFrom(this.planService.delete(id));
      Notify.success(MSG.SUCCESS.DELETE);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllPlan();
    }
  }

  clearSearch() {
    this.inputSearch.setValue('');
  }
}
