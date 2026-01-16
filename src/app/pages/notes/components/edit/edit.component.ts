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
import { clientsServicesComponent } from '../../notesServices';

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
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditClientComponent implements OnInit {
  constructor(
    private service: clientsServicesComponent,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  isLoading = false;
  submitted = false;

  client: any = {};

  reset() {
    this.client = {
      name: '',
      tel: '',
    };
  }

  loadData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log();
      this.service.getclientsById(id).subscribe({
        next: async (res) => {
          console.log(res);
          this.client = res.data;
          this.isLoading = false;
          console.log(this.client);
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

  goBack() {
    this.router.navigate(['/admin/clients']);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;

    this.isLoading = true;

    this.service.editClient(this.client).subscribe({
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
        this.goBack();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'خطأ!',
          text:
            err?.error?.message || 'حدث خطأ أثناء إضافة المنتج. حاول مرة أخرى.',
          icon: 'error',
          confirmButtonText: 'موافق',
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.loadData();
  }
}
