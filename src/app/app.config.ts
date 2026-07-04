import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { tokenInterceptor } from './services/interceptor-service/token-interceptor/token-interceptor';
import { loadingInterceptor } from './services/interceptor-service/loading-interceptor/loading-interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptors([tokenInterceptor, loadingInterceptor])),
  ]
};
