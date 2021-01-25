import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SpinnerOverlayComponentComponent } from '../app/spinner-overlay-component/spinner-overlay-component.component';


@Injectable({
  providedIn: 'root'
})
export class SpinnerOverlayService {

  constructor() { }

  isLoading = new Subject<boolean>();
  show() {
      this.isLoading.next(true);
  }
  hide() {
      this.isLoading.next(false);
  }

}
