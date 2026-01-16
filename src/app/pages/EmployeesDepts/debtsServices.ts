import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
@Injectable({ providedIn: 'root' })
export class DebtsServicesComponent {
  httpClient = inject(HttpClient);

  getDebtsData(): Observable<any[]> {
    return this.httpClient.get<any[]>(URLS.Debts ,{
      headers: Service.getAuthHeaders(),
    });
  }
  getPayments(id: number):Observable<any> {
    const body={
      id:id
    }
    return this.httpClient.post<any>(URLS.getPaymentByDebt, body ,{
      headers: Service.getAuthHeaders(),
    });  
  }

  
  deleteDebt(id: number): Observable<any> {
    const UserUrl = URLS.Debts + id + '/';
    return this.httpClient.delete<any>(UserUrl ,{
      headers: Service.getAuthHeaders(),
    });
  }
  payDebt(data:any): Observable<any>{
    return this.httpClient.post<any>(URLS.debtsPayment, data ,{
      headers: Service.getAuthHeaders(),
    }); // Return observable

  }
  addDebt(User: any): Observable<any> {
    return this.httpClient.post<any>(URLS.Debts, User ,{
          headers: Service.getAuthHeaders(),
        }); // Return observable
  }
  editDebt(User: any): Observable<any> {
    const UserUrl = URLS.Debts + User.id + '/';
    return this.httpClient.put<any>(UserUrl, User ,{
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }
}
