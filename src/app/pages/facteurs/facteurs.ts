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
import { FacteurCardComponent } from '../factcteur-card/factcteur-card';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

import jsPDF from 'jspdf';

@Component({
  selector: 'app-facteurs',
  standalone: true,
  imports: [
    MatTableModule,
    FacteurCardComponent,
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
    private service: AuthService,
  ) {}
  isLoading = false;
  facteurs: any = [];
  tel = '';
  userId = Service.getUserId() ?? null;
  userRoles: any = [];
  UserHaveRole = false;
  isAdmin = false;

  downloadImage(url: string) {
    if (!url) return;

    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = url.split('/').pop() || 'facture.jpg';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => console.error('Download failed', err));
  }

  getFromTimestamp(): number {
    return new Date(this.fromDate + 'T00:00:00').getTime();
  }
  expandedRowId: string | null = null;

  toggleRow(id: string) {
    this.expandedRowId = this.expandedRowId === id ? null : id;
  }

  getToTimestamp(): number {
    return new Date(this.toDate + 'T23:59:59').getTime();
  }
  timestampToDate(isoString: string): string {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleString('EG', { hour12: false });
  }
  fromDate!: string; // yyyy-MM-dd
  toDate!: string; // yyyy-MM-dd
  formatDate(date: Date): string {
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

  showFacteursToExport = false;
  exportAllAsPDF() {
    console.log('exportAllAsPDF started');

    this.showFacteursToExport = true;

    // Wait for Angular to render the DOM
    setTimeout(async () => {
      try {
        const element = document.getElementById('facteuts-contents');
        if (!element) {
          console.error('Export element not found');
          return;
        }

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          windowWidth: 1200, // 👈 force desktop viewport
          windowHeight: element.scrollHeight,
        });

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

        pdf.save(`factures_${Date.now()}.pdf`);
      } catch (error) {
        console.error('Error exporting PDF:', error);
      } finally {
        // Hide AFTER export completes
        this.showFacteursToExport = false;
        console.log('exportAllAsPDF finished');
      }
    }, 0); // 👈 critical
  }

  loadDATA() {
    this.isLoading = true;
    const fromTs = this.getFromTimestamp();
    const toTs = this.getToTimestamp();

    this.myService.getfacteursData(fromTs, toTs, this.tel).subscribe((data) => {
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
      cancelButtonColor: '#4A90E2',
      confirmButtonText: 'نعم، احذف الفاتورة',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.myService.detelefacteur(id).subscribe({
          next: () => {
            this.facteurs = this.facteurs.filter((item: any) => item.id !== id);
            Swal.fire({
              title: 'تم الحذف!',
              text: 'تم حذف الفاتورة بنجاح.',
              icon: 'success',
              confirmButtonColor: '#4A90E2',
              confirmButtonText: 'حسناً',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
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
                popup: ' ',
              },
            });
            console.error('Error deleting facture:', error);
          },
        });
      }
    });
  }

  SendFacteur(id: string) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم تأكيد وإرسال الفاتورة ولا يمكن التراجع عن ذلك.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4A90E2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، أكد الفاتورة',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm-arabic',
        cancelButton: 'swal2-cancel-arabic',
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isLoading = true;

      this.myService.sendFacteur(id).subscribe({
        next: () => {
          this.isLoading = false;

          // Update local list (mark as sent instead of deleting)
          const facteur = this.facteurs.find((f: any) => f.id === id);
          if (facteur) {
            facteur.send = true;
          }

          Swal.fire({
            title: 'تم بنجاح ✅',
            text: 'تم تأكيد الفاتورة وإرسالها بنجاح.',
            icon: 'success',
            confirmButtonColor: '#4A90E2',
            confirmButtonText: 'حسناً',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
              popup: ' ',
            },
          });
        },

        error: (error) => {
          this.isLoading = false;
          console.error('Error sending facture:', error);

          Swal.fire({
            title: 'خطأ ❌',
            text: 'حدث خطأ أثناء تأكيد الفاتورة. يرجى المحاولة مرة أخرى.',
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'حسناً',
            customClass: {
              popup: ' ',
            },
          });
        },
      });
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
        popup: ' ',
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
        popup: ' ',
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
        popup: ' ',
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
        popup: ' ',
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
        popup: ' ',
      },
    });
  }

  trackById(index: number, item: any): string {
    return item.id;
  }
}
