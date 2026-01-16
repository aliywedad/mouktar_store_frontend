import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Constants } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/pages/side-login/auth.service';
import { LoadingComponent } from 'src/app/tools/loading/loading.component';
import Swal from 'sweetalert2';
import { StarterServicesComponent } from 'src/app/pages/starter/starterServices';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    MaterialModule,
    LoadingComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  constructor(
    private http: HttpClient,
    private router: Router,
    private service: AuthService,
    private starterService: StarterServicesComponent
  ) {}
  realoading = false;
  Loaded = false;
  name = '';
  email = '';
  phone = '';
  remainingDays :string | number=''
   agencies: any[] = [];
  selectedAgency = Service.getAgency() ?? null;

  countRemainingTime(targetDateStr: string) {
    const now = new Date();
    const targetDate = new Date(targetDateStr.replace(' ', 'T')); // make it ISO-compatible

    const diffMs = targetDate.getTime() - now.getTime(); // difference in milliseconds

    if (diffMs <= 0) {
      return { days: 0, hours: 0 }; // already expired
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return { days: diffDays, hours: diffHours };
  }

   remaining:any ={} ;
// console.log(`Remaining: ${this.remaining.days} days and ${remaining.hours} hours`)

  refreshPage() {
    // Save the current route
    this.realoading = true;
    const currentUrl = this.router.url;

    // Navigate away and then back to trigger reload
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  refreshAgency() {
    this.selectedAgency = Service.getAgency();
  }

  async changeAgency(agency: string) {
    if (agency === this.selectedAgency) return;

    const { value: password } = await Swal.fire({
      title: 'تغيير الوكالة',
      text: 'هل أنت متأكد أنك تريد تغيير الوكالة؟',
      input: 'password',
      inputPlaceholder: 'أدخل كلمة المرور  ',
      showCancelButton: true,
      confirmButtonText: 'تأكيد',
      cancelButtonText: 'إلغاء',
    });

    if (!password) return;

    if (password === '2233') {
      Service.setAgency(agency);
      Swal.fire({
        icon: 'success',
        confirmButtonColor: '#5a86aa',
        title: 'تم تغيير الوكالة',
        text: 'تم تحديث الوكالة بنجاح.',
        timer: 2000,
        showConfirmButton: false,
      });
      this.refreshPage();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'كلمة المرور غير صحيحة',
        text: 'كلمة المرور التي أدخلتها غير صحيحة، حاول مرة أخرى.',
      });
    }
  }
 
 
  async ngOnInit(): Promise<void> {
    const userId = (await Service.getUserId()) ?? null;

 
   
  }
}
