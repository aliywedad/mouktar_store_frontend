import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  httpClient = inject(HttpClient);

  authenticate(user: any): Observable<any> {
    const body = {
      identifier: user.username,
      password: user.password,
    };
    // console.log('body', body);

    return this.httpClient.post<any>(URLS.login, body); // Return observable
  }

  //   getRemainingDays(agency: any): Observable<any> {
  //   const body = {
  //     agency: agency,
  //   };
  //   // console.log('body is ===== ', body);

  //   return this.httpClient.post<any>(URLS.agency_remaining_days, body, {
  //     headers: Service.getAuthHeaders(),
  //   }); // Return observable
  // }

  getUserById(id: any): Observable<any> {
    const body = {
      id: Number(id),
    };
    // console.log('body is ===== ', body);

    return this.httpClient.post<any>(URLS.getUserInfoById, body, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }
  checkServer(): Observable<any> {
    return this.httpClient.get<any>(URLS.hello, {
      headers: Service.getAuthHeaders(),
    });  
  }

  register(client: any): Observable<any> {
    // console.log('register', client);
    const UserUrl = '';
    return this.httpClient.post<any>(UserUrl, client); // Return observable
  }
}
