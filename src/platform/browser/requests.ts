// Angular 2 Http
import { Http,
         RequestOptions, Headers,
         BaseRequestOptions } from '@angular/http';

export class BcsRequestOptions extends BaseRequestOptions {
  constructor () {
    super();
    this.headers.append('Authorization', 'Basic SOME_BASE64_STRING==');
  }
}

export const requestOptions = { provide: RequestOptions,  useClass: BcsRequestOptions };
