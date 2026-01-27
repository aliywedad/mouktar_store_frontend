import { Component, inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
@Injectable({ providedIn: 'root' })
export class facteursServicesComponent {
  httpClient = inject(HttpClient);

getfacteursData(
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

  return this.httpClient.get<any>(URLS.facteurs, {
    headers: Service.getAuthHeaders(),
    params
  });
}

  getfacteursById(id: string): Observable<any> {
    const UserUrl = URLS.facteurs + id + '/';
    console.log('fetching ---------- ', UserUrl);
    return this.httpClient.get<any>(UserUrl, {
      headers: Service.getAuthHeaders(),
    });
  }
  detelefacteur(id: number): Observable<any> {
    const UserUrl = URLS.facteurs + id + '/';
    return this.httpClient.delete<any>(UserUrl, {
      headers: Service.getAuthHeaders(),
    });
  }
  addfacteur(User: any): Observable<any> {
    return this.httpClient.post<any>(URLS.facteurs, User, {
      headers: Service.getAuthHeaders(),
    });
  }

    getDebtsByPhone(tel: number): Observable<any> {
      const body = { tel: tel };
    return this.httpClient.post<any>(URLS.getDebtsByPhone, body, {
      headers: Service.getAuthHeaders(),
    });
  }



  sendFacteur(id: string): Observable<any> {
    const body = { id_facteur: id };
    console.log('sending facteur with id ', id);
    return this.httpClient.post<any>(URLS.confirmeFacteur, body, {
      headers: Service.getAuthHeaders(),
    });
  }


  editProduct(User: any): Observable<any> {
    const UserUrl = URLS.facteurs + User.id + '/';
    return this.httpClient.patch<any>(UserUrl, User, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }
}
