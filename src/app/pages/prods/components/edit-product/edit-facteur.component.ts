import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { facteursServicesComponent } from 'src/app/pages/facteurs/facteursServices';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit-product',
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
  templateUrl: './edit-facteur.component.html',
  styleUrl: './edit-facteur.component.scss',
})
export class EditFacteurComponent implements OnInit {
  constructor(
    private service: facteursServicesComponent,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  product: any = {};
  isLoading = false;
  submitted = false;

  ngOnInit() {
    this.isLoading = true;

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      // this.service.getProductById(Number(productId)).subscribe({
      //   next: async (res) => {
      //     console.log(res);
      //     this.product = res;
      //     this.product.password = '';
      //     this.isLoading = false;

      //     // Swal.fire({
      //     //   title: 'done!',
      //     //   text: res.message,
      //     //             icon: 'success',
      //     // confirmButtonColor:'#5a86aa',
      //     // });
      //   },
      //   error: (err) => {
      //     console.log(err);
      //     Swal.fire({
      //       title: 'حدث خطأ',
      //       text: err.error.message,
      //       icon: 'error',
      //       confirmButtonText: 'حسناً',
      //     });
      //     this.isLoading = false;
      //   },
      //   complete: () => {
      //     this.isLoading = false;
      //   },
      // });
    }
  }

  checkedRole(role: string) {
    const index = this.product.roles.indexOf(role);

    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  updateRoles(role: string) {
    const index = this.product.roles.indexOf(role);

    if (index > -1) {
      // Role exists → remove it
      this.product.roles.splice(index, 1);
    } else {
      this.product.roles.push(role);
    }

    console.log('Updated roles:', this.product.roles);
  }
  goBack() {
    this.router.navigate(['/admin/products']);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (
      this.product.name &&
      this.product.name.trim() !== '' &&
      this.product.purchase_price &&
      this.product.purchase_price > 0 &&
      this.product.sale_price &&
      this.product.sale_price > 0 &&
      this.product.stock_quantity &&
      this.product.stock_quantity > 0
    ) {
      this.isLoading = true;
      console.log(this.product);
      this.isLoading = true;

      console.log(this.product);
      this.service.editProduct(this.product).subscribe({
        next: async (res) => {
          this.isLoading = false;

          Swal.fire({
            title: 'تم بنجاح!',
            text: 'تم حفظ التغييرات.',
            icon: 'success',
            confirmButtonColor: '#5a86aa',
            confirmButtonText: 'حسناً',
          });
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            title: 'error!',
            text: err.error.message,
            icon: 'error',
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  showInputsdata() {
    console.log(this.product);
  }
}
