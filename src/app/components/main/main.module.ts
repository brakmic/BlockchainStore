import { NgModule, ApplicationRef,
         NO_ERRORS_SCHEMA,
         CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpModule, Http } from '@angular/http';
// import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { AppState, LogService } from 'app/services';
import { StoreType } from 'app/types';

// State management
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppReducer } from 'stores';
import { RouteEffects } from 'app/effects';

import { ENV_MODULES,
         VENDOR_MODULES, APP_DECLARATIONS,
         ENV_PROVIDERS, APP_PROVIDERS,
         BCS_ACTIONS, BCS_EFFECTS,
         APP_PIPES, PreloadSelectedModulesStrategy } from 'app/base';

import { MainComponent } from './main.component';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ MainComponent ], // declare Main component
  providers: [      // provide Services to Angular's Dependency Injection mechanism
    ENV_PROVIDERS,
    APP_PROVIDERS,
    BCS_ACTIONS,
    BCS_EFFECTS,
  ],
  imports: [          // import Angular's & own modules
    ...ENV_MODULES,
    ...VENDOR_MODULES,
    // BrowserModule,
    // AppPipesModule,
    StoreModule.provideStore(AppReducer),
    EffectsModule.run(RouteEffects),
  ],
  declarations: [     // load all available components & directives
    MainComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MainModule {
  constructor(public appRef: ApplicationRef,
              public appState: AppState,
              public logService: LogService) {}
  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    this.logService.logEx(`HMR Store: ${JSON.stringify(store, null, 2)}`, 'AppModule');
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      const restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }
  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // recreate elements
    const state = this.appState._state;
    store.state = state;
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
