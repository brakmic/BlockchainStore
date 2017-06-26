import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { IRoute } from 'app/interfaces';
import * as route from '../route.action';

@Injectable()
export class RouteActions {
  public routeInitialized(payload: IRoute) {
    return new route.InitializedRouteAction(payload);
  }
  public routeSelected(payload: IRoute): Action {
    return new route.RouteSelectedAction(payload);
  }
  public routeChanging(payload: IRoute): Action {
    return new route.RouteChangingAction(payload);
  }
  public routeChanged(payload: IRoute): Action {
    return new route.RouteChangedAction(payload);
  }
}
