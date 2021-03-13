import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {

  constructor(
    private router: Router,
  ) {

    this.router.events.subscribe(event => {
      console.log(event);
    });

  }

}
