import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

const firebaseConfig = {
  apiKey: "AIzaSyDyjkEUMc1EIcjJTpLUTsZmZ6VuWpGbB6o",
  authDomain: "juegosdeploy.firebaseapp.com",
  projectId: "juegosdeploy",
  storageBucket: "juegosdeploy.firebasestorage.app",
  messagingSenderId: "1024385073777",
  appId: "1:1024385073777:web:9258f0ec23f0b4b40491d0",
  measurementId: "G-F4NJFY53SY"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({theme: {preset: Aura}}),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() =>  getAuth())
  ]
};

