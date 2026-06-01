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
import { PersonService } from '../../../../core/services/person.service';
import { DataSourcePerson } from './data-source-person';
import { debounceTime, firstValueFrom } from 'rxjs';
import { OutPerson } from '../../../../core/models/dialog-data.model';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { MSG } from '../../../../core/constants/messages.constants';
import { CreatePersonDto, Person } from '../../../../core/models/person.model';
import { PersonFormComponent } from '../../pages/person-form/person-form.component';
import { Confirm } from 'notiflix';
import { notifyApiError } from '../../../../shared/utils/error.util';

@Component({
  selector: 'app-person.component',
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
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss',
})
export class PersonComponent {
  private personService = inject(PersonService);
  readonly dialog = inject(MatDialog);
  dsPerson = new DataSourcePerson();
  inputSearch = new FormControl('', { nonNullable: true });
  columns: string[] = ['firstName', 'lastName', 'ci', 'email', 'actions'];

  ngOnInit() {
    this.getAllPerson();
    this.inputSearch.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.dsPerson.find(value);
    });
  }

  getAllPerson() {
    this.personService.getAll().subscribe({
      next: (res) => {
        this.dsPerson.init(res);
      },
      error: () => {},
    });
  }

  async handlePersonaDialog(result: OutPerson, person: Person | null) {
    Loading.circle(person ? MSG.LOAD.UPDATING : MSG.LOAD.SAVING);
    const payload: CreatePersonDto = {
      ...result.person,
    };
    try {
      if (!person) {
        await firstValueFrom(this.personService.create(payload));
      } else {
        await firstValueFrom(this.personService.update(person.idPerson, payload));
      }
      Notify.success(person ? MSG.SUCCESS.UPDATE : MSG.SUCCESS.ADD);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllPerson();
    }
  }

  openPersonaDialog(person: Person | null) {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      disableClose: true,
      data: {
        person,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handlePersonaDialog(result as OutPerson, person);
      }
    });
  }

  onConfirmDeletePersona(id: Person['idPerson']) {
    Confirm.show(
      MSG.TITLE.CONFIRM,
      MSG.CONFIRM.DELETE,
      MSG.ACCEPT,
      MSG.CANCEL,
      () => this.deletePerson(id),
      () => {},
      {
        okButtonBackground: '#1d4ed8',
        titleColor: '#1e3a8a'
      }
    );
  }

  async deletePerson(id: Person['idPerson']) {
    Loading.circle(MSG.LOAD.DELETING);
    try {
      await firstValueFrom(this.personService.delete(id));
      Notify.success(MSG.SUCCESS.DELETE);
    } catch (error) {
      notifyApiError(error);
    } finally {
      Loading.remove();
      this.getAllPerson();
    }
  }

  clearSearch() {
    this.inputSearch.setValue('');
  }
}
