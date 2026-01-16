import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { clientsServicesComponent } from 'src/app/pages/clients/clientsServices';
import { Constants } from 'src/app/tools/Constants';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { Service } from 'src/app/tools/Service';
import { AuthService } from '../side-login/auth.service';
import { RoleAlert } from 'src/app/tools/RoleAlert/loading.component';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MatTableModule,
    LoadingComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RoleAlert,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class ClientsComponent implements OnInit {
  constructor(
    private myService: clientsServicesComponent,
    private router: Router,
    private service: AuthService
  ) {}

  isLoading = false;
  clients: any = [];

  client: any = {
    name: '',
    tel: '',
    date: new Date().toISOString(),
  };

  reset() {
    this.client = {
      name: '',
      tel: '',
      date: new Date().toISOString().split('T')[0],
    };
  }

  goBack() {
    this.router.navigate(['/admin/clients']);
  }

  onSubmit() {
    this.isLoading = true;

    // التحقق من الحقول المطلوبة
    if (!this.client.name || !this.client.tel) {
      Swal.fire({
        title: 'خطأ!',
        text: 'يرجى ملء جميع الحقول المطلوبة.',
        icon: 'error',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'swal2-popup-arabic',
        },
      });
      this.isLoading = false;
      return;
    }

    // التحقق من صحة رقم الهاتف
    if (!this.isValidPhone(this.client.tel)) {
      Swal.fire({
        title: 'رقم هاتف غير صالح!',
        text: 'يرجى إدخال رقم هاتف صحيح.',
        icon: 'warning',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#f39c12',
        customClass: {
          popup: 'swal2-popup-arabic',
        },
      });
      this.isLoading = false;
      return;
    }

    this.myService.addclient(this.client).subscribe({
      next: async (res) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          confirmButtonColor: '#5a86aa',
          title: 'تمت العملية بنجاح',
          text: 'تمت إضافة الزبون بنجاح!',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'swal2-popup-arabic',
          },
        });

        this.reset();
        this.loadData();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'خطأ!',
          text:
            err?.error?.message || 'حدث خطأ أثناء إضافة الزبون. حاول مرة أخرى.',
          icon: 'error',
          confirmButtonText: 'موافق',
          confirmButtonColor: '#d33',
          customClass: {
            popup: 'swal2-popup-arabic',
          },
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // في ملف TypeScript
  showAddClientForm() {
    Swal.fire({
      title: 'إضافة عميل جديد',
      html: `
      <div dir="rtl" class="swal2-form">
        <div class="form-group">
          <label for="clientName">الاسم</label>
          <input 
            type="text" 
            id="clientName" 
            class="swal2-input" 
            placeholder="أدخل اسم الزبون"
            required
          >
        </div>
        <div class="form-group">
          <label for="clientTel">رقم الهاتف</label>
          <input 
            type="tel" 
            id="clientTel" 
            class="swal2-input" 
            placeholder="أدخل رقم الهاتف"
            required
          >
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'حفظ',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#5a86aa',
      cancelButtonColor: '#d33',
      reverseButtons: true,
      preConfirm: () => {
        const name = (document.getElementById('clientName') as HTMLInputElement)
          .value;
        const tel = (document.getElementById('clientTel') as HTMLInputElement)
          .value;

        if (!name || !tel) {
          Swal.showValidationMessage('يرجى ملء جميع الحقول المطلوبة');
          return false;
        }

        if (!this.isValidPhone(tel)) {
          Swal.showValidationMessage('يرجى إدخال رقم هاتف صحيح');
          return false;
        }

        return { name, tel };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.addClient(result.value);
      }
    });
  }

  addClient(clientData: any) {
    this.isLoading = true;
    const client = {
      ...clientData,
      date: new Date().toISOString().split('T')[0],
    };

    this.myService.addclient(client).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'تمت العملية',
          text: 'تمت إضافة الزبون بنجاح',
          confirmButtonColor: '#5a86aa',
          timer: 1500,
          showConfirmButton: false,
        });
        this.loadData();
        this.isLoading = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: err?.error?.message || 'حدث خطأ أثناء الإضافة',
          confirmButtonColor: '#d33',
        });
        this.isLoading = false;
      },
    });
  }

  // دالة للتحقق من صحة رقم الهاتف
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{8}$/;
    return phoneRegex.test(phone);
  }

  userId = Service.getUserId() ?? null;
  userRoles: any = [];
  UserHaveRole = false;
  isAdmin = false;

  loadData() {
    this.isLoading = true;
    this.myService.getclientsData().subscribe((data) => {
      this.clients = data.data;
      console.log('قائمة العملاء: ', this.clients);
      this.isLoading = false;
    });
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
    console.log('معلومات المسؤول: ', Constants.admin);
  }

  goToAddPage() {
    this.router.navigate(['admin/add-clients']);
  }

  goToEditPage(id: number) {
    this.router.navigate(['/admin/edit-clients', id]);
  }

  deleteClient(id: number) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استعادة الزبون بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#5a86aa',
      confirmButtonText: 'نعم، احذف الزبون',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup-arabic',
        confirmButton: 'swal2-confirm-arabic',
        cancelButton: 'swal2-cancel-arabic',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.myService.deleteClient(id).subscribe({
          next: () => {
            this.clients = this.clients.filter((item: any) => item.id !== id);
            Swal.fire({
              title: 'تم الحذف!',
              text: 'تم حذف الزبون بنجاح.',
              icon: 'success',
              confirmButtonColor: '#5a86aa',
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: 'swal2-popup-arabic',
              },
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'خطأ!',
              text: 'حدث خطأ أثناء محاولة حذف الزبون.',
              icon: 'error',
              confirmButtonText: 'موافق',
              confirmButtonColor: '#d33',
              customClass: {
                popup: 'swal2-popup-arabic',
              },
            });
          },
        });
      }
    });
  }

  // دالة لعرض تفاصيل الزبون
  showClientDetails(client: any) {
    Swal.fire({
      title: 'تفاصيل الزبون',
      html: `
        <div dir="rtl" class="text-right">
          <p><strong>الاسم:</strong> ${client.name || 'غير محدد'}</p>
          <p><strong>رقم الهاتف:</strong> ${client.tel || 'غير محدد'}</p>
          <p><strong>تاريخ التسجيل:</strong> ${client.date || 'غير محدد'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'إغلاق',
      confirmButtonColor: '#5a86aa',
      customClass: {
        popup: 'swal2-popup-arabic',
      },
    });
  }

  trackById(index: number, client: any): string {
    return client.id;
  }
}
