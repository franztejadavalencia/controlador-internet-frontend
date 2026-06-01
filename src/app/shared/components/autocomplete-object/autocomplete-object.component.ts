import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { map, debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-object',
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './autocomplete-object.component.html',
  styleUrl: './autocomplete-object.component.scss',
})
export class AutocompleteObjectComponent <T>
implements OnInit, OnChanges, AfterViewInit
{
  @Input() label = 'Seleccione una opción';
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) options: T[] = [];
  @Input({ required: true }) displayWithFn!: (item: T) => string;
  @Input({ required: true }) getIdFn: (item: T) => any = (item: any) => item.id;
  @Input() idRequired = false;
  @Input() hideSubText = false;

  objectControl = new FormControl<T | null>(null);
  filteredOptions: T[] = [];

  displayFn = (item: T): string => this.displayWithFn(item);
  cleanText = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  ngOnInit(): void {
    if (this.idRequired) {
      this.objectControl.addValidators(Validators.required);
      this.objectControl.updateValueAndValidity();
    }

    this.objectControl.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => {
          const id =
            value && typeof value === 'object' ? this.getIdFn(value) : null;
          this.control.setValue(id);
        }),
        map((value) => {
          const serchValue =
            typeof value === 'string'
              ? this.cleanText(value)
              : value != null
                ? this.cleanText(this.displayWithFn(value))
                : '';
          return this.options.filter((opt) =>
            this.cleanText(this.displayWithFn(opt)).includes(serchValue)
          );
        }),
      )
      .subscribe((filtered) => (this.filteredOptions = filtered));

    this.control.valueChanges.subscribe((value) => {
      const found = this.options.find((opt) => this.getIdFn(opt) === value);
      const current = this.objectControl.value;
      const currentId =
        current && typeof current === 'object' ? this.getIdFn(current) : null;

      if (value !== currentId && found) {
        this.objectControl.setValue(found, { emitEvent: false });
        this.filtrarYActualizar(found);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.control) {
      this.control.statusChanges.subscribe(() => {
        if (this.control.touched) {
          this.objectControl.markAsTouched();
        }
      });
    }

    if (changes['options']) {
      this.filtrarYActualizar(this.objectControl.value);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const value = this.control.value;
      const found = this.options.find((item) => this.getIdFn(item) === value);
      if (found) {
        this.objectControl.setValue(found, { emitEvent: false });
        this.control.setValue(this.getIdFn(found), { emitEvent: false });
        this.filtrarYActualizar(found);
      }
    });
  }

  private filtrar(valor: string | T | null): T[] {
    const search =
      typeof valor === 'string'
        ? valor.toLowerCase()
        : valor != null
          ? this.displayWithFn(valor).toLowerCase()
          : '';

    return this.options.filter((opt) =>
      this.displayWithFn(opt).toLowerCase().includes(search),
    );
  }

  private filtrarYActualizar(valor: T | string | null) {
    this.filteredOptions = this.filtrar(valor);
  }

  onBlur(): void {
    const value = this.objectControl.value;

    if (typeof value === 'string') {
      const match = this.options.find(
        (opt) => this.displayWithFn(opt).toLowerCase() === value.toLowerCase(),
      );

      if (!match) {
        this.objectControl.setValue(null);
        this.control.setValue(null);
      } else {
        this.objectControl.setValue(match);
        this.control.setValue(this.getIdFn(match));
      }
    }
  }

  clearObjectControl() {
    this.objectControl.setValue(null);
    this.control.setValue(null);
  }
}
