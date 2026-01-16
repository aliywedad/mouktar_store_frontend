import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
@Injectable({ providedIn: 'root' })
export class StarterServicesComponent {
  httpClient = inject(HttpClient);

  gettotale_debts(): Observable<any[]> {
    return this.httpClient.get<any[]>(URLS.total_debts, {
      headers: Service.getAuthHeaders(),
    });
  }

  getToday(agency: string): Observable<any[]> {
    const body = {
      agency: agency,
    };
    console.log('getToday(agency:string) body is ', body);
    return this.httpClient.post<any[]>(URLS.getTodayTransactions, body, {
      headers: Service.getAuthHeaders(),
    });
  }
  sendTodayInitBalance(
    balance: number,
    cash: number,
    agency: string
  ): Observable<any[]> {
    const body = {
      balance: balance,
      cash: cash,
      agency: agency,
    };
    console.log(body);
    return this.httpClient.post<any[]>(URLS.sendTodayBalance, body, {
      headers: Service.getAuthHeaders(),
    });
  }

  createFacteur(
    data: any,
    date: string,
    total: number,
    transporter: string,
    payed_price: number,
    note: string,
    garage: string,
    timestamp: number,
    tel:string,
    name:string
  ): Observable<any[]> {
    const body = {
      data: data,
      date: date,
      total: total,
      transporter,
      payed_price,
      garage,
      note,
      timestamp,
      tel,
      name
    };

    return this.httpClient.post<any[]>(URLS.facteurs, body, {
      headers: Service.getAuthHeaders(),
    });
  }

  getSaleById(id: number): Observable<any[]> {
    const UserUrl = URLS.sales + id + '/';
    return this.httpClient.get<any[]>(UserUrl, {
      headers: Service.getAuthHeaders(),
    });
  }

  sales_stats(): Observable<any[]> {
    return this.httpClient.get<any[]>(URLS.sales_stats, {
      headers: Service.getAuthHeaders(),
    });
  }

  deteleDay(id: number): Observable<any> {
    const UserUrl = URLS.days + id + '/';
    return this.httpClient.delete<any>(UserUrl, {
      headers: Service.getAuthHeaders(),
    });
  }

  addSale(User: any): Observable<any> {
    return this.httpClient.post<any>(URLS.sales, User, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }
  cancelSale(id: string, user_id: string): Observable<any> {
    const body = {
      sale_id: Number(id),
      user_id: Number(user_id),
    };
    return this.httpClient.post<any>(URLS.CancelSale, body, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }

  editSale(User: any): Observable<any> {
    const UserUrl = URLS.sales + User.id + '/';
    return this.httpClient.put<any>(UserUrl, User, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }
}
