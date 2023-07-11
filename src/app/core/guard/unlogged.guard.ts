import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    CanActivateFn,
} from '@angular/router';



export const UnloggedGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const router = inject(Router);
    const token = JSON.parse(localStorage.getItem('dataPage')+"").token;

    if(!token){
        return true;
    }

    router.navigateByUrl('sis_koonol/catalogos');
    return false;
};
