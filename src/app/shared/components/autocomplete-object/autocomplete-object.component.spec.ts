import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteObjectComponent } from './autocomplete-object.component';

describe('AutocompleteObjectComponent', () => {
  let component: AutocompleteObjectComponent;
  let fixture: ComponentFixture<AutocompleteObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteObjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
