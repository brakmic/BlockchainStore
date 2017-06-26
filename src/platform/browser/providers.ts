/**
 * @author: Harris Brakmic
 *
 * These are globally available services in any component or any other service
 */
// Angular 2
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS = [
  { provide: LocationStrategy, useClass: PathLocationStrategy }
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
