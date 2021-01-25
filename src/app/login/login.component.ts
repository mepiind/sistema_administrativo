import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from '../services/api.service';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public login;
  public senha;

  constructor(private route: ActivatedRoute, private router: Router, public apiService: ApiService ) { }

  ngOnInit(): void {
    console.log('teste');
  }

  loggin(){
    var rota ='users/login/admin';
    this.apiService.acessorPost( rota, {usuario: this.login, senha: this.senha} ,function(resp,este){
        if(resp.error == "" && resp.jwt != undefined){
          sessionStorage.setItem('chave',resp.jwt);
            environment.logged = true;
            este.router.navigate(['/home']);
        }
    },null,this);//fim do remsoto

  }

}
