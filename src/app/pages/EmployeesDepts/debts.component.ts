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
import { DebtsServicesComponent } from './debtsServices';
import { Constants } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
import { AuthService } from '../side-login/auth.service';
import { RoleAlert } from 'src/app/tools/RoleAlert/loading.component';
import { StarterServicesComponent } from '../starter/starterServices';

interface Debt {
  id: number;
  name: string;
  description?: string;
  phone?: string;
  balance: number;
  initAmount: number;
  created_at: string;
  done?: boolean;
}

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    LoadingComponent,
    RoleAlert,
  ],
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss'],
})
export class DebtsComponent implements OnInit {
  debts: any[] = [];
  isLoading = false;

  searchTerm = '';

  constructor(
    private service: AuthService,
    private debtsService: DebtsServicesComponent,
    private router: Router,
    private myservice: StarterServicesComponent
  ) {}

  totale_debts = null;
  loadTotalDebts() {
    this.myservice.gettotale_debts().subscribe({
      next: async (res: any) => {
        this.totale_debts = res.total_balance;
      },
    });
  }

  userId = Service.getUserId() ?? null;
  //     private service: AuthService
  userRoles: any = [];
  UserHaveRole = false;
  isAdmin = false;
  async loadRoles() {
    await this.service.getUserById(Number(this.userId)).subscribe({
      next: async (res) => {
        this.userRoles = res.user.roles;
        this.UserHaveRole =
          this.userRoles.filter((r: any) => r === 'debts').length > 0;
        this.isAdmin =
          this.userRoles.filter((r: any) => r === 'admin').length > 0;
        console.log('user got the roles : ', this.UserHaveRole);
      },
      error: (err) => {
        console.error('Elorror:', err);
        this.router.navigateByUrl('/login');
        Constants.authAdmin = null;
        Constants.admin = null;
      },
      complete: () => {
        console.log('Request completed!');
      },
    });
  }
  ngOnInit(): void {
    this.loadRoles();
    this.loadDebts();
    this.loadTotalDebts();
  }

  loadDebts(): void {
    this.isLoading = true;
    this.debtsService.getDebtsData().subscribe({
      next: (data) => {
        console.log(data);
        // Ensure debts is an array
        if (Array.isArray(data)) {
          this.debts = data;
        } else if (data && typeof data === 'object') {
          this.debts = Object.values(data);
        } else {
          this.debts = [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.debts = [];
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          text: 'حدث خطأ أثناء تحميل الديون.',
        });
      },
    });
  }

  goToAddPage(): void {
    this.router.navigate(['/admin/add-debt']);
  }

  goToDetailsPage(id: number): void {
    this.router.navigate(['/admin/debt', id]);
  }

  deleteDebt(id: number): void {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من التراجع عن هذا!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5a86aa',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف الدين!',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.debtsService.deleteDebt(id).subscribe({
          next: () => {
            this.debts = this.debts.filter((debt) => debt.id !== id);
            Swal.fire({
              text: 'تم حذف الدين بنجاح.',
              icon: 'success',
              confirmButtonColor: '#5a86aa',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              text: 'حدث خطأ أثناء حذف الدين.',
            });
          },
        });
      }
    });
  }

  trackById(index: number, debt: Debt): number {
    return debt.id;
  }
}
