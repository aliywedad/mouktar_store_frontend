import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants, URLS } from './Constants';
import { AuthService } from '../pages/side-login/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { inject } from '@angular/core';

export class Service {
  httpClient = inject(HttpClient);
  service = inject(AuthService);

  refresh$: any;
  static getHeaders() {
    throw new Error('Method not implemented.');
  }

  static getUserById(id: any, http: HttpClient): Observable<any> {
    const body = {
      id: Number(id),
    };
    console.log('body', body);

    return http.post<any>(URLS.getUserInfoById, body ,{
      headers: this.getAuthHeaders(),
    }); // Return observable
  }

  /** Pour les GET simples, plus de token. */
  static getHeader(): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ Accept: '*/*' }) };
  }
  private static token: string | null = null;

  static async getHeadersWithIdToken(): Promise<any> {
    const options = {
      headers: new HttpHeaders({
        Accept: '*/*',
        Authorization: await this.getIdToken(),
      }),
    };
    return options;
  }

  static refreshData(http: HttpClient) {
    const id = this.getUserId();

    this.getUserById(Number(id), http).subscribe({
      next: async (res) => {
        Constants.admin = res.user;
      },
      error: (err) => {
        console.error('Elorror:', err);
      },
      complete: () => {
        console.log('Request completed!');
      },
    });
  }
  static async getIdToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    if (Constants.admin && Constants.admin.token) {
      this.token = Constants.admin.token;
      return Constants.admin.token;
    }
    return new Promise((resolve, reject) => {
      // get token function
    });
  }

  static async setUserId(userId: string, days = 365) {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `userId=${userId}; path=/; expires=${expires}`;
  }
    static async setUserPhone(phone: string, days = 365) {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `userPhone=${phone}; path=/; expires=${expires}`;
  }
  static getUserPhone(): string | null {
    const match = document.cookie.match(new RegExp('(^| )userPhone=([^;]+)'));
    return match ? match[2] : null;
  }

  static setAuthToken(token: string): void {
    console.log('setting the token -----');
    localStorage.setItem('authToken', token);
    console.log('token is ', token);
  }

  static getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Or from a service
    console.log('token is ', token);

    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // <--- Attach token
    });
  }

  static async setUserName(name: string, days = 365) {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `userName=${name}; path=/; expires=${expires}`;
  }
    static async setAgency(name: string, days = 365) {
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `agency=${name}; path=/; expires=${expires}`;
  }
  static getUserName(): string | null {
    const match = document.cookie.match(new RegExp('(^| )userName=([^;]+)'));
    return match ? match[2] : null;
  }
  static getAgency(): string | null {
    const match = document.cookie.match(new RegExp('(^| )agency=([^;]+)'));
    return match ? match[2] : null;
  }
  static getUserId(): string | null {
    const match = document.cookie.match(new RegExp('(^| )userId=([^;]+)'));
    return match ? match[2] : null;
  }

  static async deleteUserId() {
    document.cookie = `userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  async LoadConstantsInfo() {
    const id = await Service.getUserId();
    this.service.getUserById(Number(id)).subscribe({
      next: async (res) => {
        console.log('Success getUserById :', res);
        // this.SharedData.setData('admin',res);
        Constants.admin = res.user;
        console.log('admin is :', (Constants.admin = res.user));
        await Service.setUserId(res.user.id);
        console.log('user id ', Service.getUserId());

        return true;
      },
      error: (err) => {
        console.error('Elorror:', err);

        Constants.authAdmin = null;
        Constants.admin = null;
        return false;
      },
      complete: () => {
        console.log('Request completed!');
      },
    });
  }
}
