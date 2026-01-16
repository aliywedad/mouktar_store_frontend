import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';

import { CommonModule } from '@angular/common';
import { Constants, URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../side-login/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleAlert } from 'src/app/tools/RoleAlert/loading.component';
import { StarterServicesComponent } from './starterServices';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material/table';
import jsPDF from 'jspdf';

// import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { notoNaskhArabic, notoNaskhArabicBold } from 'src/app/tools/arabicFont';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    RoleAlert,
    LoadingComponent,
  ],
  templateUrl: './starter.component.html',
  styleUrl: './starter.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit {
  userHasTheRole = false;
  userCanSee = false;
  isLoading = false;

  date = new Date().toISOString().split('T')[0];
  // day: any = {};
  transactions: any[] = [];
  constructor(
    private router: Router,
    private service: AuthService,

    private myservice: StarterServicesComponent,
    private http: HttpClient
  ) {
    if (Constants.admin?.roles?.indexOf('admin') !== -1) {
      this.userHasTheRole = true;
    }
  }
  resetItem() {
    this.item = {
      prixTotal: 0,
      Quantity: 0,
      Designation: '',
      prixUnitaire: 0,
      package: 0,
      done: false,
    };
  }
  resetAll() {
    this.client = {};
    this.transporter = '';
    this.payed_price = '';
    this.garage = '';
    this.note = '';
    this.resetItem();
  }

  item: any = {
    prixTotal: '',
    Quantity: '',
    Designation: '',
    package: '',
    prixUnitaire: '',
    done: false,
  };

  client: any = {};
  transporter = '';
  payed_price = '';
  garage = '';
  note = '';
  deleteItem(index: number) {
    this.facture.splice(index, 1);
  }
  today = new Date().toLocaleDateString();
  addItem() {
    this.item.prixTotal =
      this.item.Quantity * this.item.prixUnitaire * this.item.package;
    this.facture.push(this.item);
    this.resetItem();
  }

  get getTotal() {
    let total = 0;
    this.facture.forEach((el) => {
      total += Number(el.prixTotal) ?? 0;
    });
    return total;
  }

  facture: any[] = [];
  tel = '';
  name = '';

  async creatFacteur() {
    this.isLoading = true;
    await this.myservice
      .createFacteur(
        this.facture,
        this.date,
        Number(this.getTotal),
        this.transporter,
        Number(this.payed_price),
        this.note,
        this.garage,
        new Date().getTime(),
        this.tel,
        this.name
      )
      .subscribe({
        next: async (res) => {
          console.log('user got the roles : ', res);
          this.isLoading = false;
          Swal.fire({
            text: 'تم إنشاء الفاتورة بنجاح.',
            icon: 'success',
            confirmButtonColor: '#5a86aa',
            timer: 1500,
            showConfirmButton: false,
          });
          this.facture = [];
          this.resetAll();
        },
        error: (err) => {
          console.error('Elorror:', err);
          Swal.fire({
            title: 'حدث خطأ أثناء إنشاء الفاتورة.',
            text: err.message || 'يرجى المحاولة مرة أخرى.',
            icon: 'error',
            confirmButtonColor: '#5a86aa',
          });
          this.isLoading = false;
        },
        complete: () => {
          console.log('Request completed!');
        },
      });
  }

  ngOnInit(): void {}
}
