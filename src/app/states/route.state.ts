import { Observable } from 'rxjs/Observable';
import { IRoute } from 'app/interfaces';

export interface IRouteState {
  route: IRoute;
}

export const initialRouteState: IRouteState = {
  route: undefined
};

export function getRoute(state$: Observable<IRouteState>) {
  return state$.select((state) => state.route);
}
