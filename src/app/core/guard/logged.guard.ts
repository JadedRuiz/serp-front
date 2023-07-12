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
    const dataPage = localStorage.getItem('dataPage');

    if(dataPage){
        return true;
    }

    router.navigateByUrl('/auth/login');
    return false;
};
