import { Component, Input, input, OnInit } from '@angular/core';
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
  selector: 'app-factcteur-card',
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
  templateUrl: './factcteur-card.html',
  styleUrl: './factcteur-card.scss',
})
export class FacteurCardComponent implements OnInit {
  constructor(
    private service: facteursServicesComponent,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  @Input() factureData: any;
  @Input() showNote: boolean = false;
  @Input() showExports: boolean = false;
  @Input() Editing: boolean = false;
  @Input() ShowDebts: boolean = true;

  isLoading = false;
  submitted = false;
  deleteItem(index: number) {
    this.factureData.data.splice(index, 1);
  }
  get getTotal() {
    let total = 0;
    if (!this.factureData || !this.factureData.data) {
      return total;
    }
    this.factureData.data.forEach((el: any) => {
      total += Number(el.prixTotal) ?? 0;
    });
    return total;
  }

  debts: any[] = [];

  getDebtsByPhone(tel: string) {
    if (
      !tel ||
      tel.trim() === '' ||
      tel.length < 8 
    ) {
      this.debts = [];
      return;
    } else {
      this.service.getDebtsByPhone(tel).subscribe((data) => {
        this.debts = data.data;
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

  ngOnInit() {
    if (this.ShowDebts && this.factureData?.tel) {
      this.getDebtsByPhone(this.factureData.tel);
    }
    else{
      console.log("no phone number provided for debts fetch")
      console.log("ShowDebts is ",this.ShowDebts)
      console.log("factureData.tel is ",this.factureData?.tel)
    }
  }

  printFacture() {
    const element = document.getElementById('facteur-card');
    if (!element) return;

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

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
