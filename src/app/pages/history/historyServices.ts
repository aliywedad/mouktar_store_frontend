import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
@Injectable({ providedIn: 'root' })
export class HistoryServicesComponent {
  httpClient = inject(HttpClient);

  gettotale_debts(): Observable<any[]> {
    return this.httpClient.get<any[]>(URLS.total_debts, {
      headers: Service.getAuthHeaders(),
    });
  }

  getToday(): Observable<any[]> {
    return this.httpClient.get<any[]>(URLS.getTodayTransactions, {
      headers: Service.getAuthHeaders(),
    });
  }
  getdaysData(agency:string): Observable<any[]> {
    const body={
      agency:agency
    }
    return this.httpClient.post<any[]>(URLS.getDays, body,{
      headers: Service.getAuthHeaders(),
    });
  }

  getdayTransactions(id: number): Observable<any[]> {
    const body = {
      day_id: Number(id),
    };
    console.log(body);
    return this.httpClient.post<any[]>(URLS.getTransactionsByDay, body, {
      headers: Service.getAuthHeaders(),
    });
  }

  sendTodayInitBalance(balance: number): Observable<any[]> {
    const body = {
      balance: balance,
    };
    console.log(body);
    return this.httpClient.post<any[]>(URLS.sendTodayBalance, body, {
      headers: Service.getAuthHeaders(),
    });
  }
  sendBalance(body: any): Observable<any[]> {
    console.log(body);
    return this.httpClient.post<any[]>(URLS.transaction, body, {
      headers: Service.getAuthHeaders(),
    });
  }
  gettotale_deposits(): Observable<any[]> {
    return this.httpClient.get<any[]>(URLS.total_deposits, {
      headers: Service.getAuthHeaders(),
    });
  }
  gettotale_suppliers_debts(): Observable<any[]> {
    return this.httpClient.get<any[]>(URLS.total_suppliers, {
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

  deteleSale(id: number): Observable<any> {
    const UserUrl = URLS.sales + id + '/';
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
