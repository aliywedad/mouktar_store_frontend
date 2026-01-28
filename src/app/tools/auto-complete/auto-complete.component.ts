import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'autocomplete',
  templateUrl: 'auto-complete.component.html',
  styleUrls: ['auto-complete.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class AutocompleteComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  /** ✅ Products list comes from parent */
  @Input() products: any[] = [];

  /** ✅ The current name (binded from parent) */
  @Input() name: string = '';

  /** ✅ Emit selected product back to parent */
  @Output() productSelected = new EventEmitter<any>();

  myControl = new FormControl('');
  filteredOptions: any[] = [];

  ngOnInit() {
    this.filteredOptions = this.products.slice();
    this.myControl.setValue(this.name);
  }

  filter(): void {
    this.name=this.input.nativeElement.value 
    console.log(this.input.nativeElement.value )

    this.productSelected.emit(this.input.nativeElement.value|| '' );
    const filterValue = (this.input.nativeElement.value || '').toLowerCase();
    this.filteredOptions = this.products.filter(p =>
      p.name.toLowerCase().includes(filterValue)
    );
  }

  onSelect(item: any) {
    this.name = item;
    this.myControl.setValue(item);
    this.productSelected.emit(item); // 🔥 send full product to parent
  }
}
