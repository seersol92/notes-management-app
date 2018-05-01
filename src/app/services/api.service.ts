import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiService {

  api: String =  'http://project635noteapi.azurewebsites.net/api';
  options;
  constructor(
    private http: Http
  ) {
    this.options = new RequestOptions({
      headers : new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  postRequest(url, data) {
    return this.http.post(this.api + url, data)
    .map(res => res.json())
    .catch(this.handleError);
  }
  getRequest(url) {
    return this.http.get(this.api + url)
    .map(res => res.json())
    .catch(this.handleError);
  }

  updateRequest(url, data) {
    return this.http.put(this.api + url, data)
    .map(res => res.json())
    .catch(this.handleError);
  }

  deleteRequest(url) {
    return this.http.delete(this.api + url)
    .map(res => res.json())
    .catch(this.handleError);
  }
  public handleError (error: Response | any) {
    if (error.status === 0 ) {  // catch server error
          return Observable.throw(error);
    }
  }
}
