/**
 * Session management service.
 * @type {Injectable}
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LogService } from '../log';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
import { IAppState } from 'stores';

@Injectable()
export class SessionService {
    private sessionSubscription: Subscription;
    private sessionState: Observable<any>;
  /**
   * Creates an instance of SessionService.
   *
   * @param {Http} http
   * @param {ConfigService} configService
   * @param {LogService} logService
   */
  constructor(private http: Http,
              private logService: LogService,
              private store: Store<IAppState>) {
  }
  public getSessionStatus(): Observable<any> {
    return this.store.select((store) => store.session);
  }
}
