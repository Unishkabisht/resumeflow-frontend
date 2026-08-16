import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class TemplateService {
    private api = environment.apiUrl + '/api';

    constructor(private http: HttpClient) { }

    list() {
        return this.http.get<any>(`${this.api}/templates`);
    }
}
