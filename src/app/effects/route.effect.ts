// angular
import { Injectable, Inject,
         forwardRef } from '@angular/core';

// libs
import { Store, Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { IRoute } from '../interfaces';
import { QueryType } from 'app/enums';
import { IAppState } from 'stores';
import * as _ from 'lodash';
import { RouteActions, RouteActionTypes } from 'app/actions';

@Injectable()
export class RouteEffects {

  @Effect() public routeSelected$: Observable<Action> = this.actions$
    .ofType(RouteActionTypes.SELECTED)
    .map((action) => {
      const payload = action.payload;
      console.log(payload);
      return payload;
    })
    .map((route) => this.routeActions.routeChanging(route));

  @Effect() public routeChanging$: Observable<Action> = this.actions$
    .ofType(RouteActionTypes.CHANGING)
    .map((action) => action.payload)
    .map((route) => this.routeActions.routeChanged(route));

  constructor(private store: Store<IAppState>,
              private actions$: Actions,
              private routeActions: RouteActions) { }


}
