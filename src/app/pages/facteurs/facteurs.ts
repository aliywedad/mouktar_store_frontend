import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { facteursServicesComponent } from 'src/app/pages/facteurs/facteursServices';
import { Constants } from 'src/app/tools/Constants';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { Service } from 'src/app/tools/Service';
import { AuthService } from '../side-login/auth.service';
import { RoleAlert } from 'src/app/tools/RoleAlert/loading.component';
import { clientsServicesComponent } from '../clients/clientsServices';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facteurs',
  standalone: true,
  imports: [
    MatTableModule,
    LoadingComponent,
    FormsModule,
    CommonModule,
    RoleAlert,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './facteurs.html',
  styleUrl: './facteurs.scss',
})
export class FacteurComponent implements OnInit {
  constructor(
    private clientsService: clientsServicesComponent,

    private myService: facteursServicesComponent,
    private router: Router,
    private service: AuthService
  ) {}
  isLoading = false;
  facteurs: any = [];
  tel = '';
  userId = Service.getUserId() ?? null;
  userRoles: any = [];
  UserHaveRole = false;
  isAdmin = false;
  getFromTimestamp(): number {
    return new Date(this.fromDate + 'T00:00:00').getTime();
  }

  getToTimestamp(): number {
    return new Date(this.toDate + 'T23:59:59').getTime();
  }

  fromDate!: string; // yyyy-MM-dd
  toDate!: string; // yyyy-MM-dd
   formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  showNotes=false

  loadDATA() {
    this.isLoading = true;
    const fromTs = this.getFromTimestamp();
    const toTs = this.getToTimestamp();
 
    this.myService.getfacteursData(fromTs,toTs,this.tel).subscribe((data) => {
      this.facteurs = data.data;
      console.log('facteurs  ta is ', this.facteurs);
      this.isLoading = false;
    });
  }
  async ngOnInit(): Promise<void> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.toDate = this.formatDate(now);
    this.fromDate = this.formatDate(yesterday);

     console.log('item info : ', Constants.admin);
    this.loadDATA();
  }
 
  goToAddPage() {
    this.router.navigate(['admin']);
  }

  goToEditPage(id: number) {
    this.router.navigate(['/admin/edit-facteurs', id]);
  }
  goToDetails(id: number) {
    this.router.navigate(['/admin/facteur-details', id]);
  }

  deleteFacteur(id: number) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استعادة الفاتورة بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذف الفاتورة',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm-arabic',
        cancelButton: 'swal2-cancel-arabic',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.myService.detelefacteur(id).subscribe({
          next: () => {
            this.facteurs = this.facteurs.filter((item: any) => item.id !== id);
            Swal.fire({
              title: 'تم الحذف!',
              text: 'تم حذف الفاتورة بنجاح.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'حسناً',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
              customClass: {
                popup: 'swal2-popup-arabic',
              },
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'خطأ!',
              text: 'حدث خطأ أثناء محاولة حذف الفاتورة. الرجاء المحاولة مرة أخرى.',
              icon: 'error',
              confirmButtonColor: '#d33',
              confirmButtonText: 'حسناً',
              customClass: {
                popup: 'swal2-popup-arabic',
              },
            });
            console.error('Error deleting facture:', error);
          },
        });
      }
    });
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      title: 'تم بنجاح!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'حسناً',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        popup: 'swal2-popup-arabic',
      },
    });
  }

  showErrorAlert(message: string) {
    Swal.fire({
      title: 'خطأ!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'حسناً',
      customClass: {
        popup: 'swal2-popup-arabic',
      },
    });
  }

  showWarningAlert(message: string) {
    Swal.fire({
      title: 'تحذير!',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f39c12',
      confirmButtonText: 'حسناً',
      customClass: {
        popup: 'swal2-popup-arabic',
      },
    });
  }

  showInfoAlert(message: string) {
    Swal.fire({
      title: 'معلومة',
      text: message,
      icon: 'info',
      confirmButtonColor: '#3498db',
      confirmButtonText: 'حسناً',
      customClass: {
        popup: 'swal2-popup-arabic',
      },
    });
  }

  showConfirmAlert(title: string, text: string): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم',
      cancelButtonText: 'لا',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm-arabic',
        cancelButton: 'swal2-cancel-arabic',
        popup: 'swal2-popup-arabic',
      },
    });
  }

  trackById(index: number, item: any): string {
    return item.id;
  }
}
