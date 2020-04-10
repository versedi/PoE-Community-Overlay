import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookmarkModule } from '@modules/bookmark/bookmark.module';
import { CommandModule } from '@modules/command/command.module';
import { EVALUATE_MODULE_FRAME_ROUTES } from '@modules/evaluate/evaluate-module.routes';
import { EvaluateModule } from '@modules/evaluate/evaluate.module';
import { MapModule } from '@modules/map/map.module';
import { MiscModule } from '@modules/misc/misc.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AppTranslationsLoader } from './app-translations.loader';
import { AppComponent } from './app.component';
import { LAYOUT_MODULE_ROUTES } from './layout/layout-module.routes';
import { LayoutModule } from './layout/layout.module';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpRequest = req.clone({
      setHeaders: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT'
      }
    });
    return next.handle(httpRequest);
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    // routing
    RouterModule.forRoot([
      ...LAYOUT_MODULE_ROUTES([
        ...EVALUATE_MODULE_FRAME_ROUTES
      ])
    ], { useHash: true }),

    // translate
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: AppTranslationsLoader }
    }),

    // layout
    LayoutModule,
    // app
    EvaluateModule,
    CommandModule,
    MapModule,
    MiscModule,
    BookmarkModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
