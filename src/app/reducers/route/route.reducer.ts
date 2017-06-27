import { IRouteState, initialRouteState } from 'app/states';
import { RouteAction, RouteActionTypes } from 'app/actions';

export function routeReducer(
    state: IRouteState = initialRouteState,
    action: RouteAction
): IRouteState {
  switch (action.type) {
    case RouteActionTypes.INITIALIZED:
      return (<any>Object).assign({}, state, {
        settings: undefined
      });

    case RouteActionTypes.CHANGED:
      return (<any>Object).assign({}, state, {
        settings: action.payload
      });
    default:
      return state;
  }
}
