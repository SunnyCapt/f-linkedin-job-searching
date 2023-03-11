import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FlnType} from "../models/flnType";

export const strangeURL = 'https://www.linkedin.com/jobs/search/?f_T=';

@Injectable({
  providedIn: 'root'
})
export class FlnTypesService {

  constructor(private httpClient: HttpClient) {
  }

  public getJsonData(): Observable<FlnType[]>{
    return this.httpClient.get<FlnType[]>("./assets/titles.json")
  }
}
