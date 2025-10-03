import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private tokenStorage = inject(TokenStorageService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenStorage.getToken();

        if (token) {
            // Clone the request and add the authorization header
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(authReq);
        }

        // If no token, proceed with the original request
        return next.handle(req);
    }
}
