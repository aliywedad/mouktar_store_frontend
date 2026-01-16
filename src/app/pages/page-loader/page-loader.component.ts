import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/tools/Constants';
import { HttpClient } from '@angular/common/http';
import { PageLoaderService } from './Page-Loader-service';
import { Administrateur } from 'src/app/tools/Administrateur';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import { Service } from 'src/app/tools/Service';
import { AuthService } from '../side-login/auth.service';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss'],
  standalone: true,
  imports: [LoadingComponent],
})
export class PageLoaderComponent implements OnInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private service: AuthService
  ) {}

  async ngOnInit() {
    this.initWebSite();
  }
  userId = Service.getUserId() ?? null;
  async initWebSite() {
    console.log('init the function ======');
    let rout: string = Constants.route;
    if (this.userId === null) {
      rout = '/login';
      // this.router.navigateByUrl(rout);
      Constants.authAdmin = null;
      Constants.admin = null;
    } else {
      
      await this.service.getUserById(Number(this.userId)).subscribe({
        next: async (res) => {
          console.log('Success getUserById :', res);
          // this.SharedData.setData('admin',res);
          Constants.admin = res.user;
          console.log('admin is :', (Constants.admin = res.user));
          await Service.setUserId(res.user.id);
          console.log('user id ', Service.getUserId());

          this.router.navigate(['/admin/']);
        },
        error: (err) => {
          console.error('Elorror:', err);
          rout = '/login';
          // this.router.navigateByUrl(rout);
          Constants.authAdmin = null;
          Constants.admin = null;
        },
        complete: () => {
          console.log('Request completed!');
        },
      });

      // let details = await PageLoaderService.getAdminByUID(this.http, this.user.uid!);
      // if (details.admin === null) {

      //  }getUserInfoById
      // Constants.admin = Object.values(details.admin)[0];
  

  
      // if (
      //   rout === '' ||
      //   rout === '/dashboard/manager' ||
      //   rout === '/auth/signin' ||
      //   rout === '/auth/reset-password' ||
      //   rout === '/error' ||
      //   rout === '/maintenance'
      // )
      rout = '/admin';
      this.router.navigateByUrl(rout);
      // .catch(e => {
      //   this.router.navigateByUrl("error")
      // })
    }
  }
}
