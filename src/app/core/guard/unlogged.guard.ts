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
    const dataPage = localStorage.getItem('dataLogin');

    if(!dataPage){
        return true;
    }

    router.navigateByUrl('sis_koonol/catalogos');
    return false;
};
