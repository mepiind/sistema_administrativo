import { Component, OnInit, Directive,  ElementRef,HostListener } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog/dialog';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';



import * as _moment from 'moment';
import {defaultFormat as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

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
  selector: 'app-itens',
  templateUrl: './itens.component.html',
  styleUrls: ['./itens.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ItensComponent implements OnInit {

  public mask = {
    guide: true,
    showMask: true,
    // keepCharPositions : true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };

  public indexProdutos = 0;
  public produtos = [];
  public edit = null;
  public estate = null;
  public type;
  public date = {value:null};

  public dataSource:any;
  public displayedColumns = ['titulo','registro' , 'details' , 'update', 'delete'];

  public databook; 

  public itemID;


  public item = {
    ITEM : null,
    DT_CADASTRADO : null,
    NOME: null,
    DESCRICAO: null,
    DOWNLOAD: null,
    DATABOOK: null
  }

  

    constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {

        this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.estate = this.router.getCurrentNavigation().extras.state;
          this.itemID = this.estate.element;
          this.type = this.estate.type;
          this.databook = this.estate.databook;

          this.item.DATABOOK = this.databook;
          
          if(this.type != 'new'){
            apiService.acessorGet( 'itensDatabooks/' +   this.itemID ,function(resp,este){
              este.item = resp.resp;

              var dateParts = este.item.DT_CADASTRADO.split("/");
              var dateObject = null;

              if(dateParts.length == 3){
                  dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
              }
              este.date = new FormControl(dateObject);

            },null,this);//fim do remsoto*/
          }
          

          if(this.estate.type == "edit" || this.estate.type == "new"){
            this.edit = true;
          } else {
            this.edit = false;
          }
        }
      });

     

    }

    addEvent(event){
        
      var erro = false;

      if(event.value._i != null) {
        if(  event.value._i.date != null && event.value._i.month != null  && event.value._i.year != null ){
          this.item.DT_CADASTRADO= event.value.format("DD/MM/YYYY");
          console.log( this.item.DT_CADASTRADO);
        } else {

          if( event.value._i.length >= 10 ||event.value == null ){
             this.item.DT_CADASTRADO = event.value._i.substring(0, 10);
          }
        }
      } 

    
    }


    ngOnInit(): void {
    }

    returnkeys(object){
      return Object.keys(object);
    }

    salvar(){
      if(this.validaForm()){
        if(this.type == 'edit'){
          var rota ='ItensDatabooks/' + this.estate.element;
          this.apiService.acessorPut( rota, this.item,function(resp,este){

            if(resp.resp != 0) {
              var message = "Databook editado com sucesso";
              var title = "Editando Databook";
            } else {
              var message = "O Databook não foi editado com sucesso";
              var title = "Erro ao editar Databook";
            }

            let navigationExtras: NavigationExtras = {
              state: {
                element:  este.databook ,
                type: 'details'
              }
            }
            este.openDialog(title, message, function(){este.router.navigate(['/databook'],navigationExtras)});


          },null,this);//fim do remsoto
        } else {
          var rota ='ItensDatabooks/new';
          this.apiService.acessorPost( rota, this.item,function(resp,este){

            if(resp.resp != 0) {
              var message = "Databook criado com sucesso";
              var title = "Novo databook";
            } else {
              var message = "O Databook não foi criado com sucesso";
              var title = "Erro ao criar novo Databook";
            }
            let navigationExtras: NavigationExtras = {
              state: {
                element:  este.databook ,
                type: 'details'
              }
            }
            este.openDialog(title, message, function(){este.router.navigate(['/databook'],navigationExtras)});

          },null,this);//fim do remsoto
        }
      }


    }

    changeEdit(){
      this.edit = true;
    }

    validaForm(){
      var titulo = this.el.nativeElement.querySelector('#titulo');
      var descricao = this.el.nativeElement.querySelector('#descricao');
      var download = this.el.nativeElement.querySelector('#download');
      var validade = this.el.nativeElement.querySelector('#validade');


      if(this.item.NOME == null){
        var message = "Por favor preencha o título";
        var title = "Campo obrigatório";
        this.openDialog(title, message, function(){titulo.focus()});
        return false;
      }

      if(this.item.DT_CADASTRADO == null){
        var message = "Por favor preencha a data de execução";
        var title = "Campo obrigatório";
        this.openDialog(validade, message, function(){validade.focus()});
        return false;
      }

      
      if(!_moment(this.item.DT_CADASTRADO, "DD/MM/YYYY", true).isValid()){
        console.log(_moment(this.item.DT_CADASTRADO, "DD/MM/YYYY", true));
        var message = "A data não é válida. Por favor preencha a data corretamente";
        var title = "Data inválida";
        this.openDialog(validade, message, function(){validade.focus()});
        return false;
        
      }

      if(this.item.DOWNLOAD == null){
        var message = "Por favor preencha o download";
        var title = "Campo obrigatório";
        this.openDialog(title, message, function(){download.focus()});
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
    onFileSelected() {
      const inputNode: any = document.querySelector('#file');
        this.apiService.acessorpostFile( inputNode.files[0], function(resp,este){
        este.item.DOWNLOAD = 'https://mepi.ind.br/framework/Controllers/files/' + inputNode.files[0].name;
        },null,this);//fim do remsoto
  
  
      }
  
      converteDrive(){
  
        const regex = /(\/file\/d\/)(.*)(\/view)/;
        const str = this.item.DOWNLOAD ;
        let m;
        var link = 'https://drive.google.com/uc?export=view&id=';
        var drive = 'false';
        if ((m = regex.exec(str)) !== null) {
  
  
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                //console.log(`Found match, group ${groupIndex}: ${match}`);
                if(groupIndex == 2){
                    link += match;
                    drive = 'true';
                }
            });
        }
  
        if(drive == 'true'){
            this.item.DOWNLOAD =  link;
        } else {
          this.openDialog("incorreto", "Este Link está incorreto", function(){});
        }
  
  
  
      }
      
      generateQR(index){
        return 'http://mepi.ind.br/databook/' + index;
      }

      @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        let navigationExtras: NavigationExtras = {
          state: {
            element: this.databook 
  
          }
        };
        this.router.navigate(['/databook'], navigationExtras);
    }
  

  }


