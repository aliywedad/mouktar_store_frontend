import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { facteursServicesComponent } from 'src/app/pages/facteurs/facteursServices';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

import jsPDF from 'jspdf';

@Component({
  selector: 'app-facteur-details',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    LoadingComponent,
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class FacteurDetailsComponent implements OnInit {
  constructor(
    private service: facteursServicesComponent,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  product: any = {};
  isLoading = false;
  submitted = false;
  factureData: any = {};
  get getTotal() {
    let total = 0;
    this.factureData.data.forEach((el: any) => {
      total += Number(el.prixTotal) ?? 0;
    });
    return total;
  }

 
  
  ngOnInit() {
    this.isLoading = true;

    const Fid = this.route.snapshot.paramMap.get('id');
    console.log('id is ', Fid);

    if (Fid) {
      this.service.getfacteursById(Fid).subscribe({
        next: async (res) => {
          console.log(res);
          this.factureData=res.data
          console.log("factureData ",this.factureData)

          this.isLoading = false;

          // Swal.fire({
          //   title: 'done!',
          //   text: res.message,
          //             icon: 'success',
          // confirmButtonColor:'#5a86aa',
          // });
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            title: 'حدث خطأ',
            text: err.error.message,
            icon: 'error',
            confirmButtonText: 'حسناً',
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }




printFacture() {
  const element = document.getElementById('facteur-card');
  if (!element) return;

  html2canvas(element, {
    scale: 2,
    useCORS: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  }).then(canvas => {
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

    // Open PDF in a new tab
    const pdfBlob = pdf.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfURL);
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
    }
  });
}

  
exportPDF() {
  const element = document.getElementById('facteur-card');
  if (!element) return;
  //  element.style.height="100vh"
  html2canvas(element, {
    scale: 2,
    useCORS: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  }).then(canvas => {


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



  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
