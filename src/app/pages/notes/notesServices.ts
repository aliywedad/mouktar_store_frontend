import { Component, inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';
@Injectable({ providedIn: 'root' })
export class NotesServicesComponent {
  httpClient = inject(HttpClient);

  getnotesData(
    fromTs?: number,
    toTs?: number,
    tel?: string
  ): Observable<any> {
    let params = new HttpParams();

    if (tel) {
      params = params.set('tel', tel);
    }

    if (fromTs) {
      params = params.set('createdFrom', fromTs.toString());
    }

    if (toTs) {
      params = params.set('createdTo', toTs.toString());
    }

    return this.httpClient.get<any>(URLS.notes, {
      headers: Service.getAuthHeaders(),
      params,
    });
  }

  addNote(note: any): Observable<any> {
    return this.httpClient.post<any>(URLS.notes, note, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }

  getnotesById(id: string): Observable<any> {
    const noteUrl = URLS.notes + id + '/';
    return this.httpClient.get<any>(noteUrl, {
      headers: Service.getAuthHeaders(),
    });
  }
  deletenote(id: string): Observable<any> {
    const noteUrl = URLS.notes + id + '/';
    return this.httpClient.delete<any>(noteUrl, {
      headers: Service.getAuthHeaders(),
    });
  }

  editNote(note: any): Observable<any> {
    const noteUrl = URLS.notes + note.id + '/';
    return this.httpClient.patch<any>(noteUrl, note, {
      headers: Service.getAuthHeaders(),
    }); // Return observable
  }
}
