import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { UsersServicesComponent } from 'src/app/pages/users/UsersServices';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { CommonModule } from '@angular/common';
import {  roles, roles_list } from 'src/app/tools/Constants';
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatButtonModule,
    LoadingComponent,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  constructor(
    private service: UsersServicesComponent,
    private router: Router
  ) {}
  agencies :any= [];

  ngOnInit() {

    this.service.getAgencies().subscribe({
      next: (res) => {
        this.agencies = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  isLoading = false;
  roles = roles_list.filter((role) => role === 'users');
  roles_dics = roles;
  user: any = {
    name: '',
    phone: null,
    password: '1234',
    token: '',
    created_at: new Date(),
    roles: [],
    agency: [],
  };
  updateAgency(ag: string) {
    const index = this.user.agency.indexOf(ag);

    if (index > -1) {
      // Role exists → remove it
      this.user.agency.splice(index, 1);
    } else {
      // Role does not exist → add it
      this.user.agency.push(ag);
    }

    console.log('Updated roles:', this.user.roles);
  }
  updateRoles(role: string) {
    const index = this.user.roles.indexOf(role);

    if (index > -1) {
      // Role exists → remove it
      this.user.roles.splice(index, 1);
    } else {
      // Role does not exist → add it
      this.user.roles.push(role);
    }

    console.log('Updated roles:', this.user.roles);
  }
  goBack() {
    this.router.navigate(['/admin/users']);
  }
  submitted = false;
  onSubmit(form: NgForm) {
    this.submitted = true;

    // Validate roles
    // if (!this.user.roles || this.user.roles.length === 0) {

    //   return;
    // }

    // Validate form
    if (
      form.invalid ||
      !this.user.name ||
      !this.user.password ||
      !this.user.phone
    ) {
      return;
    }

    if (this.user.phone.toString().length !== 8) {
      return;
    }

    this.isLoading = true;
    console.log(this.user);
    this.service.addUser(this.user).subscribe({
      next: async (res) => {
        this.isLoading = false;

        Swal.fire({
          position: 'center',
          icon: 'success',
          confirmButtonColor: '#5a86aa',
          text: res.message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.goBack()
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'error!',
          text: err.error.message,
          icon: 'error',
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  showInputsdata() {
    console.log(this.user);
  }
}
