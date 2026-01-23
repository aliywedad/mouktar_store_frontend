import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Constants } from 'src/app/tools/Constants';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { Service } from 'src/app/tools/Service';
import { AuthService } from '../side-login/auth.service';
import { RoleAlert } from 'src/app/tools/RoleAlert/loading.component';
import { clientsServicesComponent } from '../clients/clientsServices';
import { FormsModule } from '@angular/forms';
import { debtsServicesComponent } from './debtsServices';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import html2canvas from 'html2canvas';

import jsPDF from 'jspdf';
@Component({
  selector: 'app-debts',
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
  templateUrl: './debts.html',
  styleUrl: './debts.scss',
})
export class DebtsComponent implements OnInit {
  constructor(
    private myService: debtsServicesComponent,
    private router: Router,
    private service: AuthService,
  ) {}
  fromDate!: string;
  fromDate_payment!: string;
  toDate!: string;
  toDate_payment!: string;
  expandedRowId: string | null = null;
  selectedPaymet: any = [];
  filtredPayments: any[] = [];
  toggleRow(item: any) {
    this.expandedRowId = this.expandedRowId === item.id ? null : item.id;
    this.selectedPaymet = item.payments;
    console.warn("date ",this.getFrom_paymentTimestamp(),this.getTo_paymentTimestamp());
    this.filtredPayments =  this.selectedPaymet.filter(
      (p: any) =>
        p.timestamp >= this.getFrom_paymentTimestamp() &&
        p.timestamp <= this.getTo_paymentTimestamp(),
    );
  }
  isLoading = false;
  debts: any = [];
  tel = '';
  payment: any = {
    type: 'payment',
  };
  resetPayment() {
    this.payment = {
      type: 'payment',
    };
  }
  newDebt: any = {
    tel: '',
    name: '',
    debt: 0,
    payments: [],
  };

  AddPayment(id: string) {
    // 1️⃣ Validate input amount
    if (!this.payment?.amount || this.payment.amount <= 0) {
      this.showWarningAlert('يرجى إدخال مبلغ صالح للدفع.');
      return;
    }

    // 2️⃣ Find the selected debt
    const selectedDebt = this.debts.find((d: any) => d.id === id);
    if (!selectedDebt) {
      this.showErrorAlert('تعذر العثور على الدين المحدد.');
      return;
    }

    // 3️⃣ Initialize payments array if missing
    if (!Array.isArray(selectedDebt.payments)) {
      selectedDebt.payments = [];
    }

    // 4️⃣ If type is 'payment', check that amount does not exceed debt
    if (
      this.payment.type === 'payment' &&
      Number(this.payment.amount) > Number(selectedDebt.debt)
    ) {
      this.showWarningAlert('المبلغ المدفوع أكبر من إجمالي الدين.');
      return;
    }

    // 5️⃣ Create payment note
    const note =
      this.payment.type === 'debt'
        ? `تم إضافة مبلغ ${this.payment.amount} إلى الدين`
        : `تم تسديد مبلغ ${this.payment.amount} من الدين`;

    // 6️⃣ Add payment at the start of payments array
    selectedDebt.payments.unshift({
      amount: this.payment.amount,
      timestamp: Date.now(),
      note,
      type: this.payment.type,
      // facteur:"696a539d55293eb6afa6040d"
    });

    // 7️⃣ Update total debt
    selectedDebt.debt =
      this.payment.type === 'payment'
        ? selectedDebt.debt - this.payment.amount
        : selectedDebt.debt + this.payment.amount;
    selectedDebt.timestamp = Date.now();

    // 8️⃣ Save updated debt to backend
    this.isLoading = true;
    this.myService.editDebt(selectedDebt).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showSuccessAlert('تم تحديث الدين بنجاح.');
        this.resetPayment();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error updating debt:', err);
        this.showErrorAlert(
          'حدث خطأ أثناء تحديث الدين. يرجى المحاولة مرة أخرى.',
        );
      },
    });
  }

  Add() {
    this.isLoading = true;
    ((this.newDebt.timestamp = new Date().getTime()),
      this.myService.addDebt(this.newDebt).subscribe({
        next: (res) => {
          this.isLoading = false;

          Swal.fire({
            title: 'نجح',
            text: 'تم إضافة الدين بنجاح.',
            icon: 'success',
            confirmButtonColor: '#4A90E2',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'swal2-popup-arabic' },
          });

          this.loadDATA();
        },
        error: (err) => {
          this.isLoading = false;

          Swal.fire({
            title: 'خطأ',
            text:
              err?.message ||
              'حدث خطأ أثناء إضافة الدين. يرجى المحاولة مرة أخرى.',
            icon: 'error',
            confirmButtonColor: '#E74C3C',
            confirmButtonText: 'موافق',
            customClass: { popup: 'swal2-popup-arabic' },
          });

          console.error('Add debt error:', err);
        },
      }));
  }

  userId = Service.getUserId() ?? null;
  userRoles: any = [];
  UserHaveRole = false;
  isAdmin = false;
  getFromTimestamp(): number {
    return new Date(this.fromDate + 'T00:00:00').getTime();
  }
  getFrom_paymentTimestamp(): number {
    return new Date(this.fromDate_payment + 'T00:00:00').getTime();
  }
  getTo_paymentTimestamp(): number {
    return new Date(this.toDate_payment + 'T23:59:59').getTime();
  }
  getToTimestamp(): number {
    return new Date(this.toDate + 'T23:59:59').getTime();
  }

  exportPDF() {
    console.log('exportPDF called');
    const element = document.getElementById('expanded-row');
    if (!element) return;
    //  element.style.height="100vh"
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`facture_${Date.now()}.pdf`);
    });
  }


  formatDatehtml(isoString: string): string {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleString('EG', { hour12: false });
  }

  formatDate(date: Date): string {
    console.log('formatting date : ', date);
    return date.toISOString().split('T')[0];
  }
  showNotes = false;

  resetSearch() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    this.toDate = this.formatDate(now);
    this.fromDate = this.formatDate(yesterday);
    this.tel = '';
    this.loadDATA();
  }

  loadDATA() {
    this.isLoading = true;
    const fromTs = this.getFromTimestamp();
    const toTs = this.getToTimestamp();

    this.myService.getdebtsData(fromTs, toTs, this.tel).subscribe((data) => {
      this.debts = data.data;
      console.log('debts  ta is ================= ', this.debts);
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
    this.router.navigate(['/admin/edit-debts', id]);
  }
  goToDetails(id: number) {
    this.router.navigate(['/admin/facteur-details', id]);
  }

  deleteDebt(id: string) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استعادة الدين بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4A90E2',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm-arabic',
        cancelButton: 'swal2-cancel-arabic',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.myService.deleteDebt(id).subscribe({
          next: () => {
            this.debts = this.debts.filter((d: any) => d._id !== id);

            Swal.fire({
              title: 'تم الحذف!',
              text: 'تم حذف الدين بنجاح.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              customClass: { popup: 'swal2-popup-arabic' },
            });
            this.loadDATA();
          },
          error: (err) => {
            Swal.fire({
              title: 'خطأ',
              text: 'فشل حذف الدين.',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
            console.error(err);
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
