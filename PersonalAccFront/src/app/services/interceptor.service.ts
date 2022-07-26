import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, finalize, Observable, of, tap} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  private totalRequests = 0;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    return next.handle(req).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            console.log('Server response. 200')
          }
        },
        (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 500) {
              (<HTMLDivElement>document.getElementById('no-avaliable-database')).style.display = '';
            }
            if (err.status == 0) {
              (<HTMLDivElement>document.getElementById('no-avaliable-backend')).style.display = '';
            }
          }
        }
      ),
      finalize(() => {
        this.totalRequests--;
      })
    );
  }
}