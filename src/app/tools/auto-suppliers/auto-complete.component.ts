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
export class AutocompleteSuppliers {
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
    const filterValue = (this.input.nativeElement.value || '').toLowerCase();
    this.filteredOptions = this.products.filter(p =>
      p.name.toLowerCase().includes(filterValue)
    );
  }

  onSelect(product: any) {
    this.name = product.name;
    this.myControl.setValue(product.name);
    this.productSelected.emit(product); // 🔥 send full product to parent
  }
}
