import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
@Injectable({ providedIn: 'root' })
export class clientsServicesComponent {
  httpClient = inject(HttpClient);

  getclientsData(): Observable<any> {
    return this.httpClient.get<any>(URLS.clients, {
      headers: Service.getAuthHeaders(),
    });
  }

  addclient(User: any): Observable<any> {
    return this.httpClient.post<any>(URLS.clients, User, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }

  getclientsById(id: string): Observable<any> {
    const UserUrl = URLS.clients + id + '/';
    return this.httpClient.get<any>(UserUrl, {
      headers: Service.getAuthHeaders(),
    });
  }
  deleteClient(id: number): Observable<any> {
    const UserUrl = URLS.clients + id + '/';
    return this.httpClient.delete<any>(UserUrl, {
      headers: Service.getAuthHeaders(),
    });
  }

  editClient(User: any): Observable<any> {
    const UserUrl = URLS.clients + User.id + '/';
    return this.httpClient.patch<any>(UserUrl, User, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }
}
