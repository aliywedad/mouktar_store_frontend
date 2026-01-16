import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DebtsServicesComponent } from '../../debtsServices';

@Component({
  selector: 'app-add-debt',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatButtonModule,
    LoadingComponent,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-debt.component.html',
  styleUrl: './add-debt.component.scss',
})
export class AddDebtComponent implements OnInit {
  constructor(
    private service: DebtsServicesComponent,
    private router: Router
  ) {}

  ngOnInit() {}
  isLoading = false;
  submitted = false;

  debt: any = {
    name: '',
    description: '',
    phone: '',
    balance: 0,
    initAmount: 0,
  };

  goBack() {
    this.router.navigate(['/admin/debts']);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (
      this.debt.name &&
      this.debt.name.trim() !== '' &&
      this.debt.description &&
      this.debt.description.trim() !== '' &&
      this.debt.phone &&
      this.debt.phone.trim() !== '' &&
      this.debt.initAmount &&
      this.debt.initAmount > 0
    ) {
      this.isLoading = true;
      console.log(this.debt);
      this.debt['balance'] = this.debt['initAmount'];

      this.service.addDebt(this.debt).subscribe({
        next: async (res) => {
          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            confirmButtonColor: '#5a86aa',
            title: 'نجاح',
            text: ' تمت إضافة المنتج بنجاح!',
            showConfirmButton: false,
            timer: 2000,
          });
          this.submitted = false;
          this.debt = {
            name: '',
            description: '',
            purchase_price: null,
            sale_price: null,
            stock_quantity: null,
            created_at: new Date(),
            supplier: null,
          };
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            title: 'خطأ!',
            text:
              err?.error?.message ||
              'حدث خطأ أثناء إضافة المنتج. حاول مرة أخرى.',
            icon: 'error',
            confirmButtonText: 'موافق',
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.submitted = true;
    }
  }

  showInputsdata() {
    console.log(this.debt);
  }
}
