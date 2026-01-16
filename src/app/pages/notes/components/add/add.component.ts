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
import { clientsServicesComponent } from '../../notesServices';

@Component({
  selector: 'app-add-client',
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
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddClientComponent {
  constructor(
    private service: clientsServicesComponent,
    private router: Router
  ) {}

  isLoading = false;
  submitted = false;

  client: any = {
    name: '',
    tel: '',
  };

  reset() {
    this.client = {
      name: '',
      tel: '',
    };
  }

  goBack() {
    this.router.navigate(['/admin/clients']);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;

    this.isLoading = true;

    this.service.addclient(this.client).subscribe({
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
        this.reset();
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
}
