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
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DebtsServicesComponent } from '../../debtsServices';
import { bancks, Constants } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';

@Component({
  selector: 'app-edit-payments',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    LoadingComponent,
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './debt-details.html',
  styleUrl: './debt-details.scss',
})
export class DebtDetailsComponent implements OnInit {
  constructor(
    private service: DebtsServicesComponent,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  debt_id = this.route.snapshot.paramMap.get('id');
  type = 'cash';
  bancks = bancks.filter((item) => item.label !== 'debt');
  payments: any[] = [];
  debt: any = {};
  isLoading = false;
  submitted = false;
  debtPaymentObject = {
    userName: Service.getUserName(),
    balance: 0,
    debt: this.debt_id,
    user: Service.getUserId(),
        type:"cash"

  };

  sendAmount() {
    this.submitted = true;
    if (this.debtPaymentObject.balance > this.debt.balance) {
      // Swal.fire({
      //   title: 'تنبيه',
      //   text: `المبلغ المُدخل أكبر من المبلغ المتبقي (${this.debt.balance}). الرجاء إدخال مبلغ صحيح.`,
      //   icon: 'warning',
      //   confirmButtonText: 'حسناً',
      // });
      return;
    }

    if (this.debtPaymentObject.balance < 1) {
      // Swal.fire({
      //   title: 'تنبيه',
      //   text: 'لا يمكن إدخال مبلغ فارغ أو أقل من الصفر. الرجاء إدخال مبلغ صحيح.',
      //   icon: 'warning',
      //   confirmButtonText: 'حسناً',
      // });
      return;
    }

    this.isLoading = true;
    this.debtPaymentObject['type']=this.type
    this.service.payDebt(this.debtPaymentObject).subscribe({
      next: async (res) => {
        this.loadData();
        this.submitted = false;
        this.debtPaymentObject.balance = 0;

        Swal.fire({
          title: 'نجاح',
          text: 'تمت عملية التسديد بنجاح.',
                    icon: 'success',
          confirmButtonColor:'#5a86aa',
          confirmButtonText: 'حسناً',
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'حدث خطأ',
          text: err.error?.message || 'تعذر إتمام العملية. حاول مرة أخرى.',
          icon: 'error',
          confirmButtonText: 'حسناً',
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  loadData() {
    const debtId = this.route.snapshot.paramMap.get('id');
    if (debtId) {
      console.log();
      this.service.getPayments(Number(debtId)).subscribe({
        next: async (res) => {
          console.log(res);
          this.payments = res.payments;
          this.debt = res.debt;
          this.isLoading = false;
          console.log(this.payments);

          // Swal.fire({
          //   title: 'done!',
          //   text: res.message,
          //             icon: 'success',
          confirmButtonColor:'#5a86aa',
          // });
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            title: 'حدث خطأ',
            text: err.error.message,
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
  ngOnInit() {
    this.isLoading = true;
    this.loadData();
  }

  goBack() {
    this.router.navigate(['/admin/debts']);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
  }

  showInputsdata() {
    console.log(this.payments);
  }


    // sales = PRODUCT_DATA;
  trackById(index: number, product: any): string {
    return product.id; // Use a unique identifier like `product.id` or `product.name`
  }

  
}
