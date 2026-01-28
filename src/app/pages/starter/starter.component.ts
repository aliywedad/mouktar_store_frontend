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
import { facteursServicesComponent } from '../facteurs/facteursServices';
import { Phone } from 'angular-feather/icons';
import { AutocompleteComponent } from 'src/app/tools/auto-complete/auto-complete.component';
import { prodsServicesComponent } from '../prods/prodsServices';
@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    FacteurCardComponent,
    CommonModule,
    AutocompleteComponent,
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
    private myService: prodsServicesComponent,

    private service: facteursServicesComponent,

    private myservice: StarterServicesComponent,
    private http: HttpClient,
  ) {
    if (Constants.admin?.roles?.indexOf('admin') !== -1) {
      this.userHasTheRole = true;
    }
  }
  prods: any = [];

  loadProductsDATA() {
    this.myService
      .getprodsData(undefined, undefined, this.tel)
      .subscribe((data) => {
        this.prods = data.data;
        console.log('prods  ta is ================= ', this.prods);
        this.isLoading = false;
      });
  }
  onProductSelect(product: any, item: any) {
    // console.log('Selected product:', product);
    // console.log('Item before update:', item);
    item.Designation=product
    // item = product;
    // item.price = product.sale_price;
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
    this.facture = {
      data: [],
      transporter: '',
      payed_price: '',
      garage: '',
      note: '',
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
    this.facture.total = this.getTotal;
  }
  today = new Date().toLocaleDateString();
  addItem() {
    this.item.prixTotal =
      this.item.Quantity * this.item.prixUnitaire * this.item.package;

    if (
      this.item.Designation === '' ||
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
    this.facture.total = this.getTotal;
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
    transporter: '',
    payed_price: 0,
    garage: '',
    note: '',
    total: 0,
  };
  tel = '';
  name = '';
  debts: any[] = [];
  getDebtsByPhone(tel: number) {
    this.debts = [];
    this.facture.TotaleDebts = 0;
    console.warn('fetching debts for phone number : ', tel);
    const str_tel = tel.toString();
    if (!str_tel || str_tel.trim() === '' || str_tel.length < 8) {
      this.debts = [];
      this.facture.TotaleDebts = 0;

      // alert that the tel has to be 8 digits
      Swal.fire({
        title: 'تحذير',
        text: 'رقم الهاتف يجب أن يكون مكون من 8 أرقام على الأقل.',
        icon: 'warning',
        confirmButtonColor: '#4A90E2',
        confirmButtonText: 'موافق',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    } else {
      const Phone = Number(tel);
      this.service.getDebtsByPhone(Phone).subscribe((data) => {
        this.debts = data.data;
        this.facture.TotaleDebts = this.getTotaleDebts;
        if(this.debts.length==0 || this.debts.length==undefined){
          // alert that there is no debts for this phone number
          Swal.fire({
            position: "top-end",
            title: 'معلومات',
            text: 'لا توجد ديون لهذا الرقم.',
            icon: 'info',
            confirmButtonColor: '#4A90E2',
            confirmButtonText: 'موافق',
            timer: 1500,
            showConfirmButton: false,
          });
        }

        console.warn('debts data is ============= ', this.debts);
      });
    }
  }
  get getTotaleDebts(): number {
    let total = 0;
    if (!this.debts || this.debts.length === 0) {
      return total;
    }
    this.debts.forEach((debt) => {
      total += Number(debt.debt) ?? 0;
    });
    return total;
  }

  async creatFacteur() {
    if (this.facture['tel'] == '' || this.facture['tel'] == 0) {
      Swal.fire({
        title: 'تحذير',
        text: 'رقم الهاتف يجب أن يكون مكون من 8 أرقام على الأقل.',
        icon: 'warning',
        confirmButtonColor: '#4A90E2',
        confirmButtonText: 'موافق',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    if (this.facture['data'].length == 0) {
      //  alert that at least one item is required
      Swal.fire({
        title: 'تحذير',
        text: 'يجب إضافة منتج واحد على الأقل.',
        icon: 'warning',
        confirmButtonColor: '#4A90E2',
        confirmButtonText: 'موافق',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    this.isLoading = true;

    this.facture['total'] = this.getTotal;
    this.facture['timestamp'] = new Date().getTime();
    this.facture['date'] = this.date;
    this.facture['tel'] = Number(this.facture['tel'] ?? 0);
    this.facture['payed_price'] = Number(this.facture['payed_price'] ?? 0);
    await this.myservice.createFacteur(this.facture).subscribe({
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

  ngOnInit(): void {
    this.loadProductsDATA();
  }
}
