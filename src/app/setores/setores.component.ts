import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../dialog/dialog';



@Component({
  selector: 'app-setores',
  templateUrl: './setores.component.html',
  styleUrls: ['./setores.component.css']
})
export class SetoresComponent implements OnInit {

  public estate:any;
  public dataSource:any;
  public clientesBool = false;
  public clientes;
  public cliente;
  public state;
  public displayedColumns = ['cliente','setor', 'databook','update',  'delete'];

  constructor(private router: Router,public apiService: ApiService, public dialog: MatDialog) {
        
    if (this.router.getCurrentNavigation().extras.state) {
      this.estate = this.router.getCurrentNavigation().extras.state;
      this.cliente = this.estate.element;
        apiService.acessorGet( 'setores/clientes/' +  this.cliente ,function(resp,este){
          este.dataSource = resp;
          console.log(este.dataSource );
        },null,this);
      } else {
        apiService.acessorGet( 'setores',function(resp,este){
          este.dataSource = resp;
          console.log(este.dataSource );
        },null,this);
      }
   }

  ngOnInit(): void {
  }

  sair(){
    
  }

  openDialog(title, message, funcao): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {title: title, message: message}
    });

    dialogRef.afterClosed().subscribe(result => {
        funcao();
    });
  }

  redirectToCrud(element, type){
      if(type == 'delete'){
        var rota ='setores/delete/' + element;
        this.apiService.acessorPost( rota, {},function(resp,este){
          este.apiService.acessorGet( 'setores',function(resp,este){
            este.dataSource = resp;
            console.log(este.dataSource );
          },null,este);
        },null,this);//fim do remsoto
      } else if(type == 'databook') {
        let navigationExtras: NavigationExtras = {
          state: {
            element:element,
            cliente: this.cliente,
            type:type
          }
        };
        this.router.navigate(['/databooks'], navigationExtras) 
      } else {
      
        let navigationExtras: NavigationExtras = {
          state: {
            element:element,
            type:type,
            categorias:this.dataSource
          }
        };
        this.router.navigate(['/setor'], navigationExtras);
      }
    }

}
