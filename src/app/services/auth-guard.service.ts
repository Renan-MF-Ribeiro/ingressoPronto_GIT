import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
constructor(private router: Router){}

    canActivate(): boolean {
      if(!(sessionStorage.getItem('token') == 'true')){
        this.router.navigate([''])
      }
      return sessionStorage.getItem('token') == 'true'
        }
  }
