import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    CanActivateFn,
} from '@angular/router';



export const LoggedGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const router = inject(Router);
    const token = JSON.parse(localStorage.getItem('dataPage')+"").token;
    console.log(token);

    if(token){
        return true;
    }

    router.navigateByUrl('/auth/login');
    return false;
};
