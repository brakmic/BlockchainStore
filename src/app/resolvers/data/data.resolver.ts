import { Resolve, ActivatedRouteSnapshot,
         RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class DataResolver implements Resolve<any> {
  constructor() {

  }
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return Observable.of({ Back: 'BACK'});
  }
}
