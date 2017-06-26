/*
 * Default Angular providers
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader } from '@angularclass/hmr';
import { ApplicationRef } from '@angular/core';
import { decorateModuleRef } from 'platform';

/*
* Top level NgModule that holds all of our components
*/
import { MainModule } from 'app/components';
/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(MainModule)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
}

bootloader(main);
