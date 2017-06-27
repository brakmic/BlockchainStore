/**
 * @author: Harris Brakmic
 */
// Angular 2
// rc2 workaround
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { enableProdMode, ApplicationRef } from '@angular/core';
import { BROWSER_PROVIDERS } from '../browser';
// Environment Providers
let PROVIDERS: any[] = [
  // common env directives
  ...BROWSER_PROVIDERS
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = function identity<T>(value: T): T { return value; };

if ('production' === ENV) {
  // Production
  enableProdMode();

  // Production
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

  PROVIDERS = [
    ...PROVIDERS
    // custom providers in production
  ];

} else {

   _decorateModuleRef = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];

    const _ng = (window as any).ng;
    enableDebugTools(cmpRef);
    (window as any).ng.probe = _ng.probe;
    (window as any).ng.coreTokens = _ng.coreTokens;
    return modRef;
  };

  // Development
   PROVIDERS = [
    ...PROVIDERS
    // custom providers in development
  ];

}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
