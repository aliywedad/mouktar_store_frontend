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

import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { FacteurCardComponent } from '../factcteur-card/factcteur-card';
@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    FacteurCardComponent,
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
    private http: HttpClient,
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
  this.facture = { data: [] ,
  transporter : '',
  payed_price : '',
  garage : '',
  note :'',
  };
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


  deleteItem(index: number) {
    this.facture.splice(index, 1);
  }
  today = new Date().toLocaleDateString();
  addItem() {
        this.item.prixTotal =
      this.item.Quantity * this.item.prixUnitaire * this.item.package;

    if (
      this.item.Designation === "" ||
      this.item.prixTotal <= 0 ||
      this.item.Quantity <= 0 ||
      this.item.prixUnitaire <= 0 ||
      this.item.package <= 0
    ) {
      Swal.fire({
        title: 'تحذير',
        text: 'يجب ملء جميع الخانات.',
        icon: 'warning',
        confirmButtonColor: '#4A90E2',
        confirmButtonText: 'موافق',
        timer: 1500,
        showConfirmButton: false,
          
      });
      return;
    }

    this.facture.data.push(this.item);
    this.resetItem();
  }

  get getTotal() {
    let total = 0;
    this.facture.data.forEach((el: any) => {
      total += Number(el.prixTotal) ?? 0;
    });
    return total;
  }
 
  facture: any = {
    data: [],
  transporter : '',
  payed_price : '',
  garage : '',
  note :'',
  };
  tel = '';
  name = '';

  async creatFacteur() {
    this.isLoading = true;
    this.facture['total'] = this.getTotal;
    this.facture['timestamp']=new Date().getTime();
    this.facture['date']=this.date;
    await this.myservice
      .createFacteur(
        this.facture,
        // this.date,
        // Number(this.getTotal),
        // this.transporter,
        // Number(this.payed_price),
        // this.note,
        // this.garage,
        // new Date().getTime(),
        // this.tel,
        // this.name,
      )
      .subscribe({
        next: async (res) => {
          console.log('user got the roles : ', res);
          this.isLoading = false;
          Swal.fire({
            title: 'نجح',
            text: 'تم إنشاء الفاتورة بنجاح.',
            icon: 'success',
            confirmButtonColor: '#4A90E2',
            confirmButtonText: 'موافق',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'swal2-popup-arabic' },
          });
          this.facture = [];
          this.resetAll();
        },
        error: (err) => {
          console.error('Elorror:', err);
          Swal.fire({
            title: 'خطأ',
            text:
              err.message ||
              'حدث خطأ أثناء إنشاء الفاتورة. يرجى المحاولة مرة أخرى.',
            icon: 'error',
            confirmButtonColor: '#E74C3C',
            confirmButtonText: 'موافق',
            customClass: { popup: 'swal2-popup-arabic' },
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
