import { Component, OnInit, ViewChild } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../services/api.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  public dataSource = new MatTableDataSource();
  public dataSourceResp = null;
  public displayedColumns = ['descricao', 'descpai','TIPOCAT', 'update', 'delete'];

  constructor(private router: Router,public apiService: ApiService) {
    apiService.acessorGet( 'menus', function(resp,este){
      este.dataSource = new MatTableDataSource(resp);
      console.log(este.dataSource );
        este.dataSource.sort = este.sort;
        este.dataSourceResp = resp;
    },null,this);

   }

  ngOnInit(): void {
  }


  redirectToCrud(element, type){
    if(type == 'delete'){
      var rota ='menus/delete/' + element;
      this.apiService.acessorPost( rota, {}, function(resp,este){
        este.cliente = resp.resp;
        este.apiService.acessorGet( 'menus', function(resp,este){
          este.dataSource = resp;
        },null,este);
      },null,this);//fim do remsoto
    } else {
      let navigationExtras: NavigationExtras = {
        state: {
          element:element,
          type:type,
          categorias:this.dataSourceResp
        }
      };
      this.router.navigate(['/menu'], navigationExtras);
    }
  }
}
