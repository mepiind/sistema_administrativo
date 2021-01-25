import { Component, OnInit, Directive, HostListener, ElementRef } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog/dialog';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import * as _moment from 'moment';
import {defaultFormat as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-setor',
  templateUrl: './setor.component.html',
  styleUrls: ['./setor.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class SetorComponent implements OnInit {

  public indexProdutos = 0;
  public produtos = [];
  public edit = null;
  public estate = null;
  public date = {value:null};

  public myControl = new FormControl();
  public filteredOptions: Observable<Cliente[]>;
  public selectedCliente: Cliente;
  public setor = {
    CLIENTE : null,
    NOME : null,
    SETOR : null,
    SELECTEDSETOR: null,
  }
  public produtosDisp;
  public clientes;

    constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {

        this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {

          this.estate = this.router.getCurrentNavigation().extras.state;
          this.setor.SETOR = this.estate.element;
          if(this.estate.element != null){
            var rota ='setores/' + this.estate.element;
            this.apiService.acessorGet( rota, function(resp,este){
              este.setor.NOME = resp.resp.SETOR;
              este.setor.SETOR = resp.resp.ID;
              este.setor.CLIENTE = new Cliente(resp.resp.NOME,resp.resp.CLIENTEID);
            
            },null,this);//fim do remsoto*/
          }
        }

        if(this.estate.type == "edit" || this.estate.type == "new"){
          this.edit = true;
        } else {
          this.edit = false;
        }
        
     });


    }

    changeCliente(valor){
      console.log(valor);
    }

    AutoCompleteDisplay(item: any): string {
      if (item == undefined) { return }
      return item.NOME;
    }

    ngOnInit() {
        this.apiService.acessorGet( 'clientes', function(resp,este){
          este.clientes = resp;
          este.filteredOptions = este.myControl.valueChanges.pipe(
            startWith(''),
            map(value => este._filter(value))
          );

        },null,this);
    }
  
    private _filter(value: any): Cliente[] {

      return this.clientes.filter((item: any) => {
        //If the user selects an option, the value becomes a Human object,
        //therefore we need to reset the val for the filter because an
        //object cannot be used in this toLowerCase filter
        if (typeof value === 'object') { value = "" };
        const TempString = item.NOME;
        return TempString.toLowerCase().includes(value.toLowerCase());
      });

     // const filterValue = value.toLowerCase();
  
      //return this.clientes.filter(item: any => option.NOME.toLowerCase().indexOf(filterValue) === 0);
    }

   
    salvar(){

      
      this.setor.SELECTEDSETOR = this.setor.CLIENTE.CLIENTE;
      console.log(this.setor);


      if(this.validaForm()){
        if(this.estate.element != null){
          var rota ='setores/' + this.estate.element;
          this.apiService.acessorPut( rota, this.setor,function(resp,este){

            if(resp.resp != 0) {
              var message = "Setor editado com sucesso";
              var title = "Editando Setor";
            } else {
              var message = "O Setor não foi editado com sucesso";
              var title = "Erro ao editar Setor";
            }

            este.openDialog(title, message, function(){este.router.navigate(['/setores'])});

          },null,this);//fim do remsoto
        } else {
          var rota ='setores/new';
          this.apiService.acessorPost( rota, this.setor,function(resp,este){

            if(resp.resp != 0) {
              var message = "Setor criado com sucesso";
              var title = "Novo Setor";
            } else {
              var message = "O Setor não foi criado com sucesso";
              var title = "Erro ao criar novo Setor";
            }
            
            este.openDialog(title, message, function(){este.router.navigate(['/setores'])});

          },null,this);//fim do remsoto
        }
      }


    }

    changeEdit(){
      this.edit = true;
    }

    validaForm(){
      var cliente = this.el.nativeElement.querySelector('#cliente');
      var nome = this.el.nativeElement.querySelector('#nome');
     
      if(this.setor.CLIENTE == null){
        var message = "Por favor preencha o cliente";
        var title = "Campo obrigatório";
        this.openDialog(title, message, function(){cliente.focus()});
        return false;
      }

      if(this.setor.NOME == null){
        var message = "Por favor preencha o nome";
        var title = "Campo obrigatório";
        this.openDialog(title, message, function(){nome.focus()});
        return false;
      }



      return true;

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

    


}

export class Cliente {
  
  public NOME: string
  public CLIENTE: number

  constructor(
    NOME, CLIENTE
  ) { this.NOME = NOME; this.CLIENTE = CLIENTE}
}