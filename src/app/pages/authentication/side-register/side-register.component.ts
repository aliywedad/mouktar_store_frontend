import { Component } from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../side-login/auth.service';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  constructor(private router: Router, private service: AuthService) {}

  roles = [
    { value: 'admin', viewValue: 'admin' },
    { value: 'user', viewValue: 'user' },
  ];

  user: any = {
    username: '',
    email: '',
    status: 'active',
    password: '',
    role: 'user',
  };
  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/']);
  }
  onSubmit() {
    // this.router.navigate(['/']);
    console.log(this.user);
    this.service.register(this.user).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/']);
    });
  }
}
