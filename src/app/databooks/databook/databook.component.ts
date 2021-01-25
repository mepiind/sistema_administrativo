import { Component, OnInit, Directive,  ElementRef,HostListener, forwardRef } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog/dialog';
import {FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';


import * as _moment from 'moment';
import {defaultFormat as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatabookComponent),
  multi: true
};

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
};



@Component({
  selector: 'app-databook',
  templateUrl: './databook.component.html',
  styleUrls: ['./databook.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class DatabookComponent implements OnInit {
    public indexProdutos = 0;
    public produtos = [];
    public edit = null;
    public estate = null;
    public date = {value:null};

    public mask = {
      guide: true,
      showMask: true,
      // keepCharPositions : true,
      mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
    };

    public dataSource:any;
    public displayedColumns = ['titulo','registro' , 'details' , 'update', 'delete'];

    public databook = {
      DATABOOK : null,
      VALIDADE : null,
      TITULO: null,
      STATUS: null,
      SETOR: null,
      CLIENTE_NOME: null,
      SETOR_NOME: null,
      ITENS: []
    }
    public produtosDisp;

      constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {

          this.route.queryParams.subscribe(params => {
          if (this.router.getCurrentNavigation().extras.state) {

            this.estate = this.router.getCurrentNavigation().extras.state;
            this.databook.SETOR = this.estate.setor;
            if(this.estate.element != null){
              var rota ='dataBooks/' + this.estate.element;
              this.apiService.acessorGet( rota, function(resp,este){
                este.databook = resp.resp;

                apiService.acessorPost( 'itensDatabooks/databook', {'databook' : este.databook.DATABOOK} ,function(resp,este){

                  if(  este.databook['ITENS'] == undefined){
                      este.databook['ITENS'] = [];
                  }

                  este.dataSource = este.databook['ITENS'];
                  

                  var dateParts = este.databook.VALIDADE.split("/");
                  var dateObject = null;

                  if(dateParts.length == 3){
                      dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                  }
                  este.date = new FormControl(dateObject);
                },null,este);//fim do remsoto
              },null,this);//fim do remsoto
            }

            if(this.estate.type == "edit" || this.estate.type == "new"){
              this.edit = true;
            } else {
              this.edit = false;
            }
          }
        });

      }

      ngOnInit(): void {
      }


      addEvent(event){
        
        var erro = false;

        if( event.value._i != null) {
          if(  event.value._i.date != null && event.value._i.month != null  && event.value._i.year != null ){
            this.databook.VALIDADE = event.value.format("DD/MM/YYYY");
            console.log(this.databook.VALIDADE);
          } else {
  
            if( event.value._i.length >= 10 ||event.value == null ){
              this.databook.VALIDADE = event.value._i.substring(0, 10);
            }
          }
        }
          
       
        
      }

      returnkeys(object){
        return Object.keys(object);
      }

      salvar(){
        if(this.validaForm()){
          if(this.estate.element != null){
            var rota ='dataBooks/' + this.estate.element;
            this.apiService.acessorPut( rota, this.databook,function(resp,este){

              if(resp.resp != 0) {
                var message = "Databook editado com sucesso";
                var title = "Editando Databook";
              } else {
                var message = "O Databook não foi editado com sucesso";
                var title = "Erro ao editar Databook";
              }

             let navigationExtras: NavigationExtras = {
                state: {
                  element: este.databook.SETOR
                }
              }
              este.openDialog(title, message, function(){este.router.navigate(['/databooks'],navigationExtras)});


            },null,this);//fim do remsoto
          } else {
            var rota ='dataBooks/new';
            this.apiService.acessorPost( rota, this.databook,function(resp,este){

              if(resp.resp != 0) {
                var message = "Databook criado com sucesso";
                var title = "Novo databook";
              } else {
                var message = "O Databook não foi criado com sucesso";
                var title = "Erro ao criar novo Databook";
              }
              let navigationExtras: NavigationExtras = {
                state: {
                  element: este.databook.SETOR
                }
              }
              este.openDialog(title, message, function(){este.router.navigate(['/databooks'],navigationExtras)});

            },null,this);//fim do remsoto
          }
        }


      }

      changeEdit(){
        this.edit = true;
      }

      validaForm(){
        var titulo = this.el.nativeElement.querySelector('#titulo');
        var produto = this.el.nativeElement.querySelector('#produto');
        var validade = this.el.nativeElement.querySelector('#validade');
        var download = this.el.nativeElement.querySelector('#download');


        if(this.databook.TITULO == null){
          var message = "Por favor preencha o título";
          var title = "Campo obrigatório";
          this.openDialog(title, message, function(){titulo.focus()});
          return false;
        }

        if(this.databook.VALIDADE == undefined){
          var message = "Por favor preencha a data de Validade";
          var title = "Campo obrigatório";
          this.openDialog(title, message, function(){validade.focus()});
          return false;
        }

        if(!_moment(this.databook.VALIDADE, "DD/MM/YYYY", true).isValid()){
          console.log(_moment(this.databook.VALIDADE, "DD/MM/YYYY", true));
          console.log(_moment('01/01/2019', "DD/MM/YYYY", true));
          console.log(_moment('01/2/2019', "DD/MM/YYYY", true));
          var message = "A data não é válida. Por favor preencha a data corretamente";
          var title = "Data inválida";
          this.openDialog(title, message, function(){validade.focus()});
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

      
  redirectToCrud(element, type){
    if(type == 'delete'){
      var rota ='itensDatabooks/delete/' + element;
      this.apiService.acessorPost( rota, {databook: this.databook.DATABOOK},function(resp,este){
          este.apiService.acessorPost( 'itensDatabooks/databook', {'databook' : este.databook.DATABOOK} ,function(resp,este){
            if(  este.databook['ITENS'] == undefined){
                este.databook['ITENS'] = [];
            } else {
              este.databook['ITENS'] = resp.resp;
              este.dataSource = este.databook['ITENS'];
            }
          },null,este);//fim do remsoto

      },null,this);//fim do remsoto
    }  else {
      let navigationExtras: NavigationExtras = {
        state: {
          element:element,
          databook: this.databook.DATABOOK,
          type:type,
        }
      };
      this.router.navigate(['/itens'], navigationExtras);
    }
  }

  generateQR(index, titulo){
    return 'http://mepi.ind.br/databookGroup/' + index + '/' + titulo;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
      let navigationExtras: NavigationExtras = {
        state: {
          element: this.databook.SETOR

        }
      };
      this.router.navigate(['/databooks'], navigationExtras);
  }



}
