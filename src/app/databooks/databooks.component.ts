import { Component, OnInit, HostListener } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../dialog/dialog';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-databooks',
  templateUrl: './databooks.component.html',
  styleUrls: ['./databooks.component.css']
})
export class DatabooksComponent implements OnInit {
  public estate:any;
  public dataSource:any;
  public clientesBool = false;
  public clientes;
  public cliente;
  public setor;
  public displayedColumns = ['titulo','validade' ,'status', 'details' , 'update', 'delete'];

  constructor(private router: Router,public apiService: ApiService, public dialog: MatDialog) {
      if (this.router.getCurrentNavigation().extras.state) {
        this.estate = this.router.getCurrentNavigation().extras.state;
        this.setor = this.estate.element;
        this.cliente = this.estate.cliente;
        apiService.acessorPost( 'dataBooks/setores',{setor: this.setor} ,function(resp,este){
        if(resp.resp == undefined || resp.resp == []){
              este.openDialog("É necessário escolher um cliente", "Escolha primeiro um cliente para entrar em um databook", function(){this.clientesBool = true});
        } else {
          este.dataSource = resp.resp;
        }

        console.log(este.dataSource );
        },null,this);
      } else {
        this.openDialog("É necessário escolher um cliente", "Escolha primeiro um cliente para entrar em um databook", function(){});
        this.clientesBool = true;
        apiService.acessorGet( 'clientes', function(resp,este){
          este.clientes = resp;
          console.log(este.dataSource );
        },null,this);
      }
   }

   onBookChange(evento){
     var cliente =  evento.value;
     this.estate = {element:cliente};
     this.apiService.acessorPost( 'dataBooks/setores',{cliente: cliente} ,function(resp,este){
           este.dataSource = resp.resp;
     },null,this);
   }

  ngOnInit(): void {
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
        var rota ='databooks/delete/' + element;
        this.apiService.acessorPost( rota, {},function(resp,este){
          este.cliente = resp.resp;
          este.apiService.acessorPost( 'dataBooks/setores',{setor: este.estate.element}, function(resp,este){
            este.dataSource = resp.resp;
          },null,este);
        },null,this);//fim do remsoto
      }  else {
        let navigationExtras: NavigationExtras = {
          state: {
            element:element,
            type:type,
            setor: this.setor

          }
        };
        this.router.navigate(['/databook'], navigationExtras);
      }
    }


    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        let navigationExtras: NavigationExtras = {
          state: {
            element: this.cliente
  
          }
        };
        this.router.navigate(['/databooks'], navigationExtras);
    }

  }
