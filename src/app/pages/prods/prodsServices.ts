import { Component, inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
@Injectable({ providedIn: 'root' })
export class prodsServicesComponent {
  httpClient = inject(HttpClient);

getprodsData(
   fromTs?: number,
  toTs?: number,
  tel?: string
): Observable<any> {

  let params = new HttpParams();
 

  if (fromTs) {
    params = params.set('createdFrom', fromTs.toString());
  }

  if (toTs) {
    params = params.set('createdTo', toTs.toString());
  }

  if (tel) {
    params = params.set('tel', tel);
  }

  return this.httpClient.get<any>(URLS.prods, {
    headers: Service.getAuthHeaders(),
    params
  });
}

  getprodsById(id: string): Observable<any> {
    const itemUrl = URLS.prods + id + '/';
    console.log('fetching ---------- ', itemUrl);
    return this.httpClient.get<any>(itemUrl, {
      headers: Service.getAuthHeaders(),
    });
  }
  deleteDebt(id: string): Observable<any> {
    const itemUrl = URLS.prods + id + '/';
    return this.httpClient.delete<any>(itemUrl, {
      headers: Service.getAuthHeaders(),
    });
  }
  addDebt(item: any): Observable<any> {
    return this.httpClient.post<any>(URLS.prods, item, {
      headers: Service.getAuthHeaders(),
    });
  }

  editDebt(item: any): Observable<any> {
    const itemUrl = URLS.prods + item.id + '/';
    return this.httpClient.patch<any>(itemUrl, item, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }
}
