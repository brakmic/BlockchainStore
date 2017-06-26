import { Action } from '@ngrx/store';
import { type } from 'app/helpers';
import { CATEGORY } from 'app/common';
import { IRoute } from 'app/interfaces';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export interface IRouteActions {
  INIT:        string;
  INITIALIZED: string;
  INIT_FAILED: string;
  SELECTED:    string;
  CHANGING:    string;
  CHANGED:     string;
}

export const RouteActionTypes: IRouteActions = {
  INIT:        type(`${CATEGORY} Route Init`),
  INITIALIZED: type(`${CATEGORY} Route Initialized`),
  INIT_FAILED: type(`${CATEGORY} Route Init Failed`),
  SELECTED:    type(`${CATEGORY} Route Selected`),
  CHANGING:    type(`${CATEGORY} Route Changing`),
  CHANGED:     type(`${CATEGORY} Route Changed`)
};

/**
 * Every action is comprised of at least a type and an optional
 * payload.
 * */
export class InitRouteAction implements Action {
  type = RouteActionTypes.INIT;
  payload: IRoute = undefined;

  constructor() { }
}

export class InitializedRouteAction implements Action {
  type = RouteActionTypes.INITIALIZED;

  constructor(public payload: IRoute) { }
}

export class InitFailedRouteAction implements Action {
  type = RouteActionTypes.INIT_FAILED;
  payload: IRoute = null;

  constructor() { }
}

export class RouteSelectedAction implements Action {
  type = RouteActionTypes.SELECTED;

  constructor(public payload: IRoute) { }
}

export class RouteChangingAction implements Action {
  type = RouteActionTypes.CHANGING;

  constructor(public payload: IRoute) { }
}

export class RouteChangedAction implements Action {
  type = RouteActionTypes.CHANGED;

  constructor(public payload: IRoute) { }
}

export type RouteAction
  = InitRouteAction
  | InitializedRouteAction
  | InitFailedRouteAction
  | RouteSelectedAction
  | RouteChangingAction
  | RouteChangedAction;
