import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {

  public dataSource:any;
  public displayedColumns = ['capa','titulo', 'details' , 'update', 'delete'];

  constructor(private router: Router,public apiService: ApiService) {
    apiService.acessorGet( 'catalogos',function(resp,este){
      este.dataSource = resp;
    },null,this);//fim do remsoto*/
  }

  ngOnInit(): void {
  }

  redirectToCrud(type,element){
    if(type == 'delete'){
      var rota ='catalogos/delete/' + element;
      this.apiService.acessorPost( rota, {} ,function(resp,este){
        este.cliente = resp.resp;
        este.apiService.acessorGet( 'catalogos', function(resp,este){
          este.dataSource = resp;
        },null,este);
      },null,this);//fim do remsoto
    } else {
      let navigationExtras: NavigationExtras = {
        state: {
          element:element,
          type:type
        }
      };
      this.router.navigate(['/catalogo'], navigationExtras);
    }
  }


  }
