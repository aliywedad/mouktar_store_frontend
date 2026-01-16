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
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-facteur',
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
  templateUrl: './add-facteur.component.html',
  styleUrl: './add-facteur.component.scss',
})
export class AddfacteurComponent implements OnInit {
  constructor(
    private service: facteursServicesComponent,
    private router: Router,
  ) {}

  supplier: any = [];
  selectedSupplier = 0;
  ngOnInit() {
 
  }
  isLoading = false;
  submitted = false;

  roles = [
    { value: 'Admin', viewValue: 'Admin' },
    { value: 'facteur', viewValue: 'facteur' },
  ];
  statuses = [
    { value: 'Confirmed', viewValue: 'Confirmed' },
    { value: 'Pending', viewValue: 'Pending' },
  ];
  facteurs = [
    {
      name: '',
      description: '',
      purchase_price: null,
      sale_price: null,
      stock_quantity: null,
      created_at: new Date(),
      supplier: null,
    },
  ];

  reset() {
    this.facteurs = [
      {
        name: '',
        description: '',
        purchase_price: null,
        sale_price: null,
        stock_quantity: null,
        created_at: new Date(),
        supplier: null,
      },
    ];
  }

  addSale() {
    this.facteurs.push({
      name: '',
      description: '',
      purchase_price: null,
      sale_price: null,
      stock_quantity: null,
      created_at: new Date(),
      supplier: null,
    });
    console.log(this.facteurs);
  }

  removeSale(index: number) {
    if (this.facteurs.length > 1) {
      // prevent deleting the last one if you want
      this.facteurs.splice(index, 1);
    }
  }

  facteur: any = {
    name: '',
    description: '',
    purchase_price: null,
    sale_price: null,
    stock_quantity: null,
    created_at: new Date(),
    supplier: null,
  };

  updateRoles(role: string) {
    const index = this.facteur.roles.indexOf(role);

    if (index > -1) {
      // Role exists → remove it
      this.facteur.roles.splice(index, 1);
    } else {
      // Role does not exist → add it
      this.facteur.roles.push(role);
    }

    console.log('Updated roles:', this.facteur.roles);
  }
  goBack() {
    this.router.navigate(['/admin/facteurs']);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;

    this.isLoading = true;
    console.log(this.facteurs);
    console.log(this.selectedSupplier);

    this.service.addfacteur(this.facteurs).subscribe({
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

  showInputsdata() {
    console.log(this.facteur);
  }
}
