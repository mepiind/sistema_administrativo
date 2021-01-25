import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-normas',
  templateUrl: './normas.component.html',
  styleUrls: ['./normas.component.css']
})
export class NormasComponent implements OnInit {
    public dataSource:any;
    public displayedColumns = ['norma', 'titulo' , 'details' , 'update', 'delete'];

  constructor(private router: Router,public apiService: ApiService) {
    apiService.acessorGet( 'normas',function(resp,este){
      este.dataSource = resp;
    },null,this);//fim do remsoto*/
  }

  ngOnInit(): void {
  }

  redirectToCrud(type, element){
    if(type == 'delete'){
      var rota ='normas/delete/' + element;
      this.apiService.acessorPost( rota, {}, function(resp,este){
        este.cliente = resp.resp;
        este.apiService.acessorGet( 'normas', function(resp,este){
          este.dataSource = resp;
        },null,este);
      },null,this);//fim do remsoto
    } else {
      let navigationExtras: NavigationExtras = {
        state: {
          element:element,
          type:type,
          categorias:this.dataSource
        }
      };
      this.router.navigate(['/norma'], navigationExtras);
    }
  }


}
