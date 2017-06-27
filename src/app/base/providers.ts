import { IConfig } from 'app/interfaces';
const config: IConfig = require('config.json');

import { NgModule, ApplicationRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, Request, RequestOptionsArgs,
         Response, XHRBackend, RequestOptions,
         ConnectionBackend, Headers } from '@angular/http';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
// import { AppPipesModule } from 'app/pipes';

import { ENV_PROVIDERS, requestOptions } from 'platform';
/*
 * Platform and Environment providers/directives/pipes
 */
import { APP_RESOLVER_PROVIDERS } from './resolvers';

import { InternalStateType } from 'app/types';

import { TranslateModule,
         TranslateLoader,
         TranslateStaticLoader,
         MissingTranslationHandler } from 'ng2-translate/ng2-translate';

import { BCS_VALIDATORS } from 'app/helpers';

import { BcsMissingTranslationHandler } from 'app/handlers';

import { APP_ROUTES, PreloadSelectedModulesStrategy } from './routes';

import { AUTH_PROVIDERS } from 'app/components';

import {
  AppState,
  LogService,
  SessionService,
  ThemingService
} from 'app/services';

import { TranslationProvider } from 'app/providers';

import { ThemeConfig, ThemeConfigProvider,
         ThemeSpinner, ThemePreloader,
         ImageLoaderService, ColorHelper,
         ThemeSupport } from 'assets/styles';

import { RouteActions } from 'app/actions';
import { RouteEffects } from 'app/effects';

export function _window(): any {
   // return the global native browser window object
   return window;
}

export function _console(): any {
  return console;
}

export const BROWSER_PROVIDERS = [
  // { provide: WindowService, useValue: _window() },
  // { provide: ConsoleService, useValue: _console() }
];

const EXTRA_PROVIDERS: any[] = [];

// if (config.useHttpExService) {
//   EXTRA_PROVIDERS.push(
//       { provide: Http,
//         useFactory: (xhrBackend: XHRBackend,
//                      requestOptions: RequestOptions,
//                      logService: LogService) =>
//                new HttpEx(xhrBackend, requestOptions, logService),
//         deps: [XHRBackend, RequestOptions, LogService]
//       }
//   );
// }

EXTRA_PROVIDERS.push(
    {
      provide: MissingTranslationHandler,
      useClass: BcsMissingTranslationHandler
    }
  );

const TRANSLATION_SERVICES = [
  // i18nService
];

// Application wide providers
const BCS_SERVICES = [
  AppState,
  LogService,
  SessionService,
  // ThemingService,
  // ...BROWSER_PROVIDERS,
  // ...EXTRA_PROVIDERS,
  // ...TRANSLATION_SERVICES,
  // ThemeConfigProvider,
  // ThemeConfig,
  // ThemePreloader,
  // ThemeSpinner,
  // ImageLoaderService
];

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  ...BCS_SERVICES,
  // ...AUTH_PROVIDERS,
  ...BCS_VALIDATORS,
  requestOptions,
  PreloadSelectedModulesStrategy,
  // AppPipesModule
];

const BCS_DIRECTIVES = [
];

const APP_DECLARATIONS = [
  ...BCS_DIRECTIVES
];

const BCS_ACTIONS = [
  RouteActions
];

const BCS_EFFECTS = [
  RouteEffects
];

const ENV_MODULES = [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES,
                            {
                              useHash: config.useHashRouting,
                              enableTracing: config.traceRoutes,
                              errorHandler: (error) => console.log(`[ROUTER ERROR] : ${error}`),
                              preloadingStrategy: PreloadAllModules
                            })
];

export function translateLoaderFactory(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

const VENDOR_MODULES = [
  TranslateModule.forRoot({
              // provide: TranslateLoader,
              // useClass: TranslationProvider
              provide: TranslateLoader, deps: [Http],
              useFactory: translateLoaderFactory
  })
];

export {
    ENV_PROVIDERS,
    ENV_MODULES,
    VENDOR_MODULES,
    APP_PROVIDERS,
    BCS_DIRECTIVES,
    BCS_ACTIONS,
    BCS_EFFECTS,
    APP_DECLARATIONS
};
