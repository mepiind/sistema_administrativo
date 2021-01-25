import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   env = environment;

  constructor(private router: Router,public apiService: ApiService) {
  }

  ngOnInit() {
    if(!this.env.logged) {
      this.router.navigate(['/login']);
    }
  }
}
