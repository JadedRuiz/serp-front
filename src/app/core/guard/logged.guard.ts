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
    const token = localStorage.getItem('sales.token');
  
    if(token){
        return true; 
    }

    router.navigateByUrl('/auth/login');
    return false;
};