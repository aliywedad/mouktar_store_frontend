import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Constants, URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleAlert } from 'src/app/tools/RoleAlert/loading.component';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material/table';

import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { facteursServicesComponent } from '../../facteursServices';
import { FacteurCardComponent } from 'src/app/pages/factcteur-card/factcteur-card';
@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FacteurCardComponent,
    MatTableModule,
    MatProgressSpinnerModule,
    RoleAlert,
    LoadingComponent,
  ],
  templateUrl: './edit-facteur.component.html',
  styleUrl: './edit-facteur.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EditFacteurComponent implements OnInit {
  userHasTheRole = false;
  userCanSee = false;
  isLoading = false;

  date = new Date().toISOString().split('T')[0];
  // day: any = {};
  transactions: any[] = [];
  constructor(
    private myService: facteursServicesComponent,
    private route: ActivatedRoute,
    private myservice: facteursServicesComponent,
    private http: HttpClient,
  ) {
    if (Constants.admin?.roles?.indexOf('admin') !== -1) {
      this.userHasTheRole = true;
    }
  }

  selectedFile: File | null = null;
  uploadedImageUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    // show preview
    const reader = new FileReader();
    reader.onload = (e) => (this.uploadedImageUrl = reader.result);
    reader.readAsDataURL(this.selectedFile!);
  }
  uploadImage(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(null);
        return;
      }

      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http
        .post<{ url: string }>('http://localhost:8000/api/upload/', formData)
        .subscribe({
          next: (res) => {
            this.uploadedImageUrl = res.url; // ✅ REAL URL
            resolve(res.url);
          },
          error: (err) => reject(err),
        });
    });
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
    this.facture.data.splice(index, 1);
  }
  today = new Date().toLocaleDateString();
  addItem() {
    this.item.prixTotal =
      this.item.Quantity * this.item.prixUnitaire * this.item.package;
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
  showPreview = false;
  facture: any = {};
downloadImage(url: string) {
  if (!url) return;

  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = url.split('/').pop() || 'facture.jpg';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(err => console.error('Download failed', err));
}

  /* Toggle preview */
  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  get getUrl() {
    if (this.uploadedImageUrl) {
      return this.uploadedImageUrl;
    } else {
      console.warn('image url is ================ ', this.facture.image_url);
      return this.facture.image_url;
    }
  }
  async saveChanges() {
    this.isLoading = true;
    this.facture['total'] = this.getTotal;

    const imageUrl = await this.uploadImage(); // ✅ waits correctly

    if (imageUrl) {
      this.facture['image_url'] = imageUrl; // ✅ URL, not base64
    }
    console.warn('facture to save is ', imageUrl);

    await this.myservice.editProduct(this.facture).subscribe({
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
        this.loadDATA();
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
  loadDATA() {
    const debt_id = this.route.snapshot.paramMap.get('id');
    if (debt_id) {
      this.isLoading = true;
      this.myService.getfacteursById(debt_id).subscribe((data) => {
        this.facture = data.data;
        console.log('facteurs  ta is ', this.facture);
        this.isLoading = false;
      });
    }
  }
  ngOnInit(): void {
    this.loadDATA();
  }
}
