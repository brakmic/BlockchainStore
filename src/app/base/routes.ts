// Router Provider
import { Routes,
         Route, PreloadingStrategy } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as bows from 'platform/helpers/bows-alt';
const logger = bows('Preload');
import { BCS } from 'app/helpers';

export class PreloadSelectedModulesStrategy implements PreloadingStrategy {
  private loadParam: () => void;
  private routeParam: Route;
  public preload(route: Route, load: () => void): Observable<any> {
    this.routeParam = route;
    this.loadParam = load;
    return ((route.data as any) && (route.data as any).preload) ? 
                                          this._load() : Observable.of(null);
  }
  private _load(): Observable<any> {
    if (this.routeParam && this.loadParam) {
      const mod = !_.isEmpty(this.routeParam.path) ? this.routeParam.path.toUpperCase() : 'RETAIL';
      logger.log(`${mod}`);
      return Observable.of(this.loadParam());
    }
    return Observable.of(null);
  }
}

export const APP_ROUTES: Routes = [
  // {
  //   path: 'access-denied',
  //   loadChildren: 'app/components#AccessDeniedModule',
  //   data: {
  //     preload: true
  //   }
  // },
  // {
  //   path: 'logon',
  //   loadChildren: 'app/components#LogonModule'
  // },
  // {
  //   path: 'logout',
  //   loadChildren: 'app/components#LogoutModule'
  // },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
  },
  {
    path: '',
    loadChildren: 'app/components#BcsModule',
    data: {
      preload: true
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
