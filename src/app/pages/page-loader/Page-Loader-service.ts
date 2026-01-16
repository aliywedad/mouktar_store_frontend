// import { URLS } from 'src/Constants/Constants';
import { HttpClient } from '@angular/common/http';
import { URLS } from 'src/app/tools/Constants';
import { Service } from 'src/app/tools/Service';


export class PageLoaderService {

    static async getAdminByUID(http: HttpClient, uid: string): Promise<any> {
        let options = await Service.getHeadersWithIdToken();
        let result: any = (await http.post(URLS.getAdminByUID, { "uid": uid }, options).toPromise());
        return result
    }

    
}