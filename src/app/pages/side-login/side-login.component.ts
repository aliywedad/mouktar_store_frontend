import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { share } from 'rxjs';
import { AuthService } from './auth.service';
import { Constants } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
import Swal from 'sweetalert2';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    LoadingComponent,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
  styleUrl: './side-login.component.scss',
})
export class AppSideLoginComponent implements OnInit {
  ngOnInit(): void {
    this.checkServer()
    this.SharedData.clearData();
  }
  isLoading = false;
  form: FormGroup;
  error: string = '';
  phone=Service.getUserPhone() || ''

  constructor(
    private service: AuthService,
    private SharedData: SharedDataService,
    private router: Router
  ) {
    this.form = new FormGroup({
      username: new FormControl(this.phone, [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }
checkServer() {
  this.service.checkServer().subscribe({
    next: (res) => {
      console.log('Server is reachable:', res);
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error reaching server:', err);
      this.isLoading = false;
      // Swal.fire({
      //   title: '⚠️ تعذر الاتصال بالخادم',
      //   html: `
      //     <p>الخادم غير متاح حالياً أو هناك مشكلة في الاتصال.</p>
      //     <p>يرجى المحاولة لاحقاً.</p>
      //     <hr>
      //     <p style="font-size:14px;color:#555">
      //       إذا استمرت المشكلة، يرجى التواصل مع المطور:<br>
      //       <strong>Aliy Sidahmed</strong><br>
      //       📞 34135930
      //     </p>
      //   `,
      //   icon: 'error',
      //   confirmButtonText: 'موافق',
      //   confirmButtonColor: '#d33'
      // });
    },
    complete: () => {
      console.log('Check server request completed!');
      this.isLoading = false;
    },
  });
}



  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.service.authenticate(this.form.value).subscribe({
        next: async (res) => {
          console.log('Success:', res);
              Service.setAuthToken(res.user.token)

          // this.SharedData.setData('admin',res);

          Constants.admin = res.user;
          console.log('admin is :', (Constants.admin = res.user));
          await Service.setUserId(res.user.id);
          await Service.setUserName(res.user.name);
          await Service.setUserPhone(res.user.phone);
          
          this.isLoading = false;

          this.router.navigate(['/admin/']);
        },
        error: (err) => {
          Swal.fire({
            title: '  خطأ',
            text: err.error.message || JSON.stringify(err.error) ,
            icon: 'error',
            confirmButtonText: 'موافق',
          });
          console.error('Elorror:', err);
          this.isLoading = false;
        },
        complete: () => {
          console.log('Request completed!');
          this.isLoading = false;
        },
      });

      // this.router.navigate(['/admin']);

      //  console.log('Form Data:', this.form.value.isAdmin);

      console.log('Form Data:', this.form.value.isAdmin);
    } else {
      console.log('Form is invalid!');
    }
  }

  get f() {
    return this.form.controls;
  }

  // onSubmit() {
  //   // console.log(this.form.value);
  //   // this.router.navigate(['/']);
  //   console.log(this.form.value);
  // }
}
