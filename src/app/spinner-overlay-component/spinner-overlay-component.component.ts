import { Component, OnInit } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SpinnerOverlayService} from '../spinner-overlay.service'
import { Subject } from 'rxjs';

@Component({
  selector: 'app-spinner-overlay-component',
  templateUrl: './spinner-overlay-component.component.html',
  styleUrls: ['./spinner-overlay-component.component.css']
})
export class SpinnerOverlayComponentComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: SpinnerOverlayService){}


  ngOnInit(): void {
  }

}
