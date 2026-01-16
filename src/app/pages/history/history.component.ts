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
import { HistoryServicesComponent } from './historyServices';
import { FormsModule, NgForm } from '@angular/forms';
import jsPDF from 'jspdf';

// import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { notoNaskhArabic, notoNaskhArabicBold } from 'src/app/tools/arabicFont';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    RoleAlert,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class historyComponent implements OnInit {
  userHasTheRole = false;
  userCanSee = false;
  isLoading = false;
  agency = Service.getAgency();

  day: any = {};
  days: any[] = [];
  transactions: any[] = [];
  constructor(
    private router: Router,
    private service: AuthService,
    private myservice: HistoryServicesComponent,
    private http: HttpClient
  ) {
    if (Constants.admin?.roles?.indexOf('admin') !== -1) {
      this.userHasTheRole = true;
      console.log('the use has the role admin ', Constants.admin?.roles);
      // if (Constants.admin.rolesGroupe.indexOf(RolesId.Affect_Role_To_Admin) !== -1) {
      //   this.userHasTheRole = true;
      // }
    }
  }

  dics: any = {
    retrait: 'سحب',
    versement: 'إيداع',
    augment: 'زيادة الخزينة',
    retraitMostevid: 'سحب مستفيد',
    manualeVersement: 'تحويل داخلي',
    manualeRetrait: ' تحويل داخلي',
    retrait_coms: 'سحب العمولة',
  };
  selectedDay_id = 0;

  trackById(index: number, debt: any): number {
    return debt.id;
  }
  loadDaysData() {
    this.myservice.getdaysData(this.agency!).subscribe({
      next: async (res: any) => {
        console.log(res.days);
        this.days = res.days;
        console.log('days are : ', this.days);
        if (this.days && this.days.length > 0) {
          this.selectedDay_id = this.days[0].id;
          this.loadDay(this.days[0].id);
        }
      },
    });
  }
  loadDay(day_id: number) {
    console.log('load day with id : ', day_id);
    if (day_id == 0) {
      return;
    }
    this.myservice.getdayTransactions(day_id).subscribe({
      next: async (res: any) => {
        this.day = res.day;
        this.transactions = res.transactions;
        console.log('today is : ', this.day);
        console.log('transactions today : ', this.transactions);
      },
    });
  }
  initBalance = 0;

  exportPDF() {
    const doc = new jsPDF('p', 'pt', 'a4');

    // Arabic fonts
    doc.addFileToVFS('NotoNaskhArabic.ttf', notoNaskhArabic);
    doc.addFont('NotoNaskhArabic.ttf', 'NotoNaskhArabic', 'normal');
    doc.addFileToVFS('NotoSansArabic-Bold.ttf', notoNaskhArabicBold);
    doc.addFont('NotoSansArabic-Bold.ttf', 'NotoSansArabic', 'bold');
    doc.setFont('NotoNaskhArabic');

    // Title
    doc.setFont('NotoSansArabic', 'bold');
    doc.text('تقرير العمليات', 40, 40);

    // Summary info
    doc.setFont('NotoNaskhArabic', 'normal');
    doc.setFontSize(10);
    doc.text('' + this.agency, 40, 60);
    doc.text('' + this.day.date, 40, 75);

    const summaryY = 100;
    doc.setFontSize(12);
    doc.setFont('NotoSansArabic', 'bold');

    // Summary values
    doc.text(`العمولة: ${this.day.benefit?.toFixed(2) || 0}`, 40, summaryY);
    doc.text(
      `الصندوق: ${this.day.Balance + this.day.cash || 0}`,
      200,
      summaryY
    );
    doc.text(`الإيداع: ${this.day.operationsV || 0}`, 360, summaryY);
    doc.text(`السحب: ${this.day.operationsR || 0}`, 520, summaryY);

    // Table columns
    const columns = [
      { header: 'تاريخ', dataKey: 'created_at' },
      { header: 'المستخدم', dataKey: 'userName' },
      { header: 'بعد العملية', dataKey: 'after' },
      { header: 'قبل العملية', dataKey: 'before' },
      { header: 'العمولة', dataKey: 'comission' },
      { header: 'الرقم', dataKey: 'phone' },
      { header: 'المبلغ', dataKey: 'amount' },
      { header: 'العملية', dataKey: 'type' },
    ];

    // Prepare table rows
    const rows = this.transactions
      .filter((trans) => trans.isCanceled === false && trans.type !== 'check')
      .map((trans) => ({
        created_at: trans.created_at
          ? (() => {
              const d = new Date(trans.created_at);
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              const hour = String(d.getHours()).padStart(2, '0');
              const minute = String(d.getMinutes()).padStart(2, '0');
              return `${day}/${month}/${year} ${hour}:${minute}`;
            })()
          : '-',
        userName: trans.userName || '-',
        after: `نقدا: ${trans.cashAfter?.toFixed(2) || 0}\nالمحفظة: ${
          trans.after?.toFixed(2) || 0
        }`,
        before: `نقدا: ${trans.cashBefore?.toFixed(2) || 0}\nالمحفظة: ${
          trans.before?.toFixed(2) || 0
        }`,
        comission: trans.comission ? trans.comission.toFixed(2) : 0,
        phone: trans.phone || '-',
        amount: trans.amount ? trans.amount.toFixed(2) : '-',
        type: this.dics[trans.type],
      }));

    // Table
    (autoTable as any)(doc, {
      startY: summaryY + 30,
      head: [columns.map((c) => c.header)],
      body: rows.map((r) => columns.map((c) => (r as any)[c.dataKey])),
      styles: {
        font: 'NotoNaskhArabic',
        fontSize: 8,
        cellPadding: 3,
        halign: 'center',
        textColor: 0,
        valign: 'middle',
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 11,
        font: 'NotoSansArabic',
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 60 },
        2: { cellWidth: 80 },
        3: { cellWidth: 80 },
        4: { cellWidth: 50 },
        5: { cellWidth: 60 },
        6: { cellWidth: 50 },
        7: { cellWidth: 60 },
      },
    });

    // 🔹 1. Save locally
    const fileName = `${this.agency}_${this.day.date}.pdf`;
    doc.save(fileName);

    // 🔹 2. Send to backend
    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append(
      'message',
      `📄 تقرير من ${this.agency} بتاريخ ${this.day.date}`
    );

    // Replace with your backend URL
    // this.http.post(URLS.send_pdf, formData).subscribe({
    //   next: (res) => {
    //     Swal.fire({
    //       icon: 'success',
    //       position: 'top-end',
    //       text: 'تم تحميل التقرير وإرساله إلى تيليجرام بنجاح',
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //   },
    //   error: (err) => {
    //     Swal.fire({
    //       icon: 'error',
    //       position: 'top-end',
    //       text: 'حدث خطأ أثناء إرسال الملف إلى تيليجرام',
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //   },
    // });
  }


  

  userId = Service.getUserId() ?? null;
  //     private service: AuthService
  userRoles: any = [];
  UserHaveRole = true;
  isAdmin = false;

  async ngOnInit(): Promise<void> {
    this.loadDaysData();

    // console.log("constant : ",Constants.admin)
    if (this.userId == null) {
      this.router.navigateByUrl('/login');
    }
    // this.loadSalesData()
    // this.loadData();

    // console.log(Constants.admin);
    // if (Constants.admin == undefined || Constants.admin.roles == undefined) {
    //   await this.service.getUserById(Number(this.userId)).subscribe({
    //     next: async (res) => {
    //       console.log('Success getUserById :', res);
    //       // this.SharedData.setData('admin',res);
    //       Constants.admin = res.user;
    //       console.log('admin is :', (Constants.admin = res.user));
    //       await Service.setUserId(res.user.id);
    //       console.log('user id ', Service.getUserId());

    //       this.router.navigate(['/admin/']);
    //     },
    //     error: (err) => {
    //       console.error('Elorror:', err);
    //       this.router.navigateByUrl('/login');
    //       Constants.authAdmin = null;
    //       Constants.admin = null;
    //     },
    //     complete: () => {
    //       console.log('Request completed!');
    //     },
    //   });
    // }
  }
}
