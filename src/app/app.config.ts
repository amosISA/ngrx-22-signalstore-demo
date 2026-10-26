import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { catalogActions } from './catalog/catalog.actions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideStore(),
    provideStoreDevtools({
      name: 'NgRx 22 · ReelNight',
      maxAge: 25,
      actionCreators: catalogActions,
    }),
  ],
};
