import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { AppNavItemComponent } from './sidebar/nav-item/nav-item.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HeaderComponent } from './header/header.component';
import { Constants } from 'src/app/tools/Constants';
import { AuthService } from 'src/app/pages/side-login/auth.service';
import { Service } from 'src/app/tools/Service';
import { navItems } from './sidebar/sidebar-data';
import Swal from 'sweetalert2';

const MOBILE_VIEW = 'screen and (max-width: 1008px)';
const TABLET_VIEW = 'screen and (min-width: 1069px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterModule,
    AppNavItemComponent,
    MaterialModule,
    CommonModule,
    SidebarComponent,
    NgScrollbarModule,
    HeaderComponent,
  ],
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FullComponent implements OnInit {
  navItems: any = navItems.filter((r: any) => r.displayName != 'users');

  // export const navItems: NavItem[] = [

  // ];

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav | any;

  //get options from service
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  constructor(
    private breakpointObserver: BreakpointObserver,

    private router: Router,
    private service: AuthService
  ) {
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes

        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];

        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
      });
  }
  // roles: string[] = [];
  initialHeight = window.innerHeight;

  async ngOnInit() {
 

    this.initialHeight = window.innerHeight;

    const userId = (await Service.getUserId()) ?? null;
    if (!userId) {
      // Swal.fire({
      //   title: 'خطأ في تحميل البيانات',
      //   text: 'لم يتم العثور على معرف المستخدم. يرجى إعادة تسجيل الدخول.',
      //   icon: 'error',
      //   confirmButtonText: 'موافق',
      // });
      Constants.authAdmin = null;
      Constants.admin = null;
      // this.router.navigateByUrl('/login');

      return;
    }

    // await this.service.getUserById(Number(userId)).subscribe({
    //   next: async (res) => {
    //     // console.log('Success getUserById :', res);
    //     Constants.admin = res.user;
    //     // this.roles = res.user.roles;
    //     if (res.user.roles.filter((r: any) => r === 'users').length > 0) {
    //       this.navItems =navItems
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Error:', err);
    //     // this.router.navigateByUrl('/login');
    //     Constants.authAdmin = null;
    //     Constants.admin = null;
    //   },
    //   complete: () => {
    //     // console.log('Request completed!');
    //   },
    // });

    // console.log('=============================================');
    // console.log('roles : ', this.roles);
    // console.log('constant roles  : ', Constants.admin);
    // console.log('navItems : ', this.navItems);
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
  }
}
