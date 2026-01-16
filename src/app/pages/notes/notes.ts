import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { Service } from 'src/app/tools/Service';
import { AuthService } from '../side-login/auth.service';
import { RoleAlert } from 'src/app/tools/RoleAlert/loading.component';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NotesServicesComponent } from './notesServices';
import { clientsServicesComponent } from '../clients/clientsServices';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    MatTableModule,
    LoadingComponent,
    MatExpansionModule,
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
  templateUrl: './notes.html',
  styleUrls: ['./notes.scss'], // fixed typo
})
export class NotesComponent implements OnInit {
  isLoading = false;
  notes: any[] = [];
 
  note: any = {
    note: '',
    tel:'',
    name:"",
    date: new Date().toISOString(),
    timestamp: new Date().getTime(),
  };
  comments_text = '';
  fromDate!: string; // yyyy-MM-dd
  toDate!: string; // yyyy-MM-dd
  userId = Service.getUserId() ?? null;

  constructor(
    private clientsService: clientsServicesComponent,
    private myService: NotesServicesComponent,
    private router: Router,
    private authService: AuthService
  ) {}
  formatDate2(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  ngOnInit(): void {
      const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.toDate = this.formatDate2(now);
    this.fromDate = this.formatDate2(yesterday);

     this.loadData();
  }
  tel=''

  loadData() {
    this.isLoading = true;
    const fromTs = this.getFromTimestamp();
    const toTs = this.getToTimestamp();


    this.myService.getnotesData(fromTs,toTs,this.tel).subscribe({
      next: (data) => {
        this.notes = data.data;
        console.log("notes data is : ",this.notes)
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  // إرسال تعليق
  sendComment(c: any) {
    if (!c.comments) c.comments = [];

    if (!this.comments_text.trim()) return; // prevent empty comment

    c.comments.push({
      comment: this.comments_text.trim(),
      date: new Date().toISOString(),
      timestamp: new Date().getTime(),
    });

    this.comments_text = '';
    this.isLoading = true;

    this.myService.editNote(c).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'تمت العملية بنجاح',
          showConfirmButton: false,
          timer: 2000,
          confirmButtonColor: '#5a86aa',
          customClass: { popup: 'swal2-popup-arabic' },
        });
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'خطأ!',
          text: err?.error?.message || 'حدث خطأ أثناء الإضافة',
          icon: 'error',
          confirmButtonText: 'موافق',
          confirmButtonColor: '#d33',
          customClass: { popup: 'swal2-popup-arabic' },
        });
      },
    });
  }

  // إضافة ملاحظة جديدة
  onSubmit() {
    if (!this.note.note?.trim()) {
      Swal.fire({
        title: 'خطأ!',
        text: 'لا يمكن إضافة ملاحظة فارغة',
        icon: 'error',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#d33',
        customClass: { popup: 'swal2-popup-arabic' },
      });
      return;
    }

    if (this.note.client) {
      this.note.clientId = this.note.client.id;
    }

    this.isLoading = true;

    this.myService.addNote(this.note).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'تمت الإضافة بنجاح',
          showConfirmButton: false,
          timer: 2000,
          confirmButtonColor: '#5a86aa',
          customClass: { popup: 'swal2-popup-arabic' },
        });
        this.resetNote();
        this.loadData();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'خطأ!',
          text: err?.error?.message || 'حدث خطأ أثناء الإضافة',
          icon: 'error',
          confirmButtonText: 'موافق',
          confirmButtonColor: '#d33',
          customClass: { popup: 'swal2-popup-arabic' },
        });
      },
    });
  }

  // إعادة ضبط النموذج
  resetNote() {
    this.note = {
      note: '',
      client: null,
      date: new Date().toISOString(),
      timestamp: new Date().getTime(),
    };
  }

  // حذف ملاحظة
  deleteNote(id: string) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من استعادة الملاحظة بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#5a86aa',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup-arabic',
        confirmButton: 'swal2-confirm-arabic',
        cancelButton: 'swal2-cancel-arabic',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.myService.deletenote(id).subscribe({
          next: () => {
            this.notes = this.notes.filter((item) => item.id !== id);
            Swal.fire({
              title: 'تم الحذف!',
              text: 'تم حذف الملاحظة بنجاح',
              icon: 'success',
              confirmButtonColor: '#5a86aa',
              showConfirmButton: false,
              timer: 1500,
              customClass: { popup: 'swal2-popup-arabic' },
            });
          },
          error: () => {
            Swal.fire({
              title: 'خطأ!',
              text: 'حدث خطأ أثناء محاولة الحذف',
              icon: 'error',
              confirmButtonText: 'موافق',
              confirmButtonColor: '#d33',
              customClass: { popup: 'swal2-popup-arabic' },
            });
          },
        });
      }
    });
  }

  // التحقق من رقم الهاتف 8 أرقام
  isValidPhone(phone: string): boolean {
    return /^[0-9]{8}$/.test(phone);
  }

  trackById(index: number, note: any): string {
    return note.id;
  }

  // تحويل التاريخ من ISO
  formatDate(isoString: string): string {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleString('EG', { hour12: false });
  }

  getFromTimestamp(): number {
    return this.fromDate ? new Date(this.fromDate + 'T00:00:00').getTime() : 0;
  }

  getToTimestamp(): number {
    return this.toDate
      ? new Date(this.toDate + 'T23:59:59').getTime()
      : Date.now();
  }
}
