import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../services/api.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})


export class ClientesComponent  implements AfterViewInit {
  public dataSource = new MatTableDataSource();
  public displayedColumns = ['NOME', 'databook' , 'details' , 'update', 'delete'];
  
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,public apiService: ApiService) {
    apiService.acessorGet( 'clientes', function(resp,este){
    este.dataSource = new MatTableDataSource(resp);
    console.log(este.dataSource );
      este.dataSource.sort = este.sort;
    },null,this);

   }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  ngAfterViewInit() {
   //this.dataSource.sort = this.sort;
  }

  redirectToCrud(element, type){
    if(type == 'delete'){
      var rota ='clientes/delete/' + element;
      this.apiService.acessorPost( rota, {}, function(resp,este){
        este.cliente = resp.resp;
        este.apiService.acessorGet( 'clientes', function(resp,este){
          este.dataSource = resp;
        },null,este);
      },null,this);//fim do remsoto
    } else if(type == 'setores') {
      let navigationExtras: NavigationExtras = {
        state: {
          element:element,
          type:type
        }
      };
      this.router.navigate(['/setores'], navigationExtras);
    } else {
      let navigationExtras: NavigationExtras = {
        state: {
          element:element,
          type:type
        }
      };
      this.router.navigate(['/cliente'], navigationExtras);
    }
  }
}
