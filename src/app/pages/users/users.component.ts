import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { UsersServicesComponent } from 'src/app/pages/users/UsersServices';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './components/add-user/add-user.component';
import { Constants, roles } from 'src/app/tools/Constants';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { Service } from 'src/app/tools/Service';
import { AuthService } from '../side-login/auth.service';
import { RoleAlert } from 'src/app/tools/RoleAlert/loading.component';
 import { ReactiveFormsModule, FormControl } from '@angular/forms'; // <-- add this

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    ReactiveFormsModule,
    LoadingComponent,
    CommonModule,
    MatCardModule,
    MaterialModule,
    RoleAlert,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    AddUserComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  roles_dics = roles;
  filterControl = new FormControl(''); // <-- filter input

  users: any = [];
  filteredUsers: any = [];
  isLoading = false;

  userId = Service.getUserId() ?? null;
  userRoles: any = [];
  UserHaveRole = false;
  isAdmin = false;

  constructor(
    private myService: UsersServicesComponent,
    private router: Router,
    private service: AuthService
  ) {}

  getArRole(role: string) {
    return this.roles_dics[role] ?? role;
  }

  async loadRoles() {
    await this.service.getUserById(Number(this.userId)).subscribe({
      next: async (res) => {
        this.userRoles = res.user.roles;
        this.UserHaveRole =
          this.userRoles.filter((r: any) => r === 'users').length > 0;
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

  async ngOnInit(): Promise<void> {
    this.loadRoles();
    this.isLoading = true;
    console.log('user info : ', Constants.admin);

    this.myService.getUserData().subscribe((data) => {
      if (Array.isArray(data)) {
        this.users = data;
      } else if (data && typeof data === 'object') {
        this.users = Object.values(data);
      } else {
        this.users = [];
      }

      this.filteredUsers = [...this.users]; // initialize filtered list
      this.isLoading = false;

      // subscribe to filter changes
      this.filterControl.valueChanges.subscribe((value) => {
        this.applyFilter(value||'');
      });
    });
  }

  applyFilter(value: string) {
    const filterValue = value?.toLowerCase() ?? '';
    this.filteredUsers = this.users.filter((user: any) =>
      user.name?.toLowerCase().includes(filterValue) ||
      user.phone?.toString().includes(filterValue) ||
      user.email?.toLowerCase().includes(filterValue) ||
      (user.agency && user.agency.some((a: string) => a.toLowerCase().includes(filterValue)))
    );
  }

  goToAddPage() {
    this.router.navigate(['admin/add-users']);
  }

  goToEditPage(id: number) {
    this.router.navigate(['/admin/edit-users', id]);
  }

  deleteUser(id: number) {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف هذا المستخدم!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E74C3C',
      cancelButtonColor: '#4A90E2',
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
        this.myService.deteleUser(id).subscribe(() => {
          this.users = this.users.filter((user: any) => user.id !== id);
          this.applyFilter(this.filterControl.value ?? ''); // update filtered list
          Swal.fire({
            title: 'نجح',
            text: 'تم الحذف بنجاح',
            icon: 'success',
            confirmButtonColor: '#4A90E2',
            confirmButtonText: 'موافق',
            customClass: { popup: 'swal2-popup-arabic' },
          });
        });
      }
    });
  }

  trackById(index: number, user: any): string {
    return user.id;
  }
}
