import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/pages/side-login/auth.service';
import { Constants } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
})
export class AppNavItemComponent implements OnChanges, OnInit {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  //@HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem | any;
  @Input() depth: any;

  constructor(
    public navService: NavService,
    public router: Router,

    private service: AuthService
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }
  // roles: string[] = Constants.admin!.roles ?? [];
  async ngOnInit(): Promise<void> {
    // if (Constants.admin == undefined || Constants.admin.roles == undefined) {
    //   const userId = Service.getUserId() ?? null;

    //   await this.service.getUserById(Number(userId)).subscribe({
    //     next: async (res) => {
    //       console.log('Success getUserById :', res);
    //       // this.SharedData.setData('admin',res);
    //       Constants.admin = res.user;
    //       console.log('hhhh admin is :', (Constants.admin = res.user));
    //       this.roles = Constants.admin!.roles ?? [];
    //       await Service.setUserId(res.user.id);
    //       console.log('user id ', Service.getUserId());

    //       this.router.navigate(['/admin/']);
    //     },
    //     error: (err) => {
    //       console.error('Elorror:', err);
    //       this.router.navigateByUrl('/login');
    //       Constants.authAdmin = null;
    //       Constants.admin = null;
    //     },
    //     complete: () => {
    //       console.log('Request completed!');
    //     },
    //   });
    // }
  }
  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => {});
  }

  onItemSelected(item: NavItem) {
    this.router.navigate([item.route]);

    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  onSubItemSelected(item: NavItem) {}
}
