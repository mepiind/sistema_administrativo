import { Component, OnInit, Directive, HostListener, ElementRef } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog/dialog';

@Component({
  selector: 'app-norma',
  templateUrl: './norma.component.html',
  styleUrls: ['./norma.component.css']
})
export class NormaComponent implements OnInit {

  public edit = null;
  public estate = null;
  public categorias = null;
  public norma = {
    DESCRICAO : null,
    DOWNLOAD: null,
    N_NORMA: null,
    NORMA : null,
    TITULO : null

  }

  constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.estate = this.router.getCurrentNavigation().extras.state;
        this.categorias = this.estate.categorias;
        if(this.estate.element != null){
          var rota ='normas/' + this.estate.element;
          this.apiService.acessorGet( rota, function(resp,este){
            este.norma = resp.resp;
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

  salvar(){
    if(this.validaForm()){
      if(this.estate.element != null){
        var rota ='normas/' + this.estate.element;
        this.apiService.acessorPut( rota, this.norma,function(resp,este){

          if(resp.resp != 0) {
            var message = "Norma editada com sucesso";
            var title = "Editando Norma";
          } else {
            var message = "A Norma não foi editada com sucesso";
            var title = "Erro ao editar Norma";
          }

            este.openDialog(title, message, function(){este.router.navigate(['/normas'])});

        },null,this);//fim do remsoto
      } else {
        var rota ='normas/new';
        this.apiService.acessorPost( rota, this.norma,function(resp,este){

          if(resp.resp != 0) {
            var message = "Norma criada com sucesso";
            var title = "Nova Norma";
          } else {
            var message = "Norma criada não foi criado com sucesso";
            var title = "Erro ao criar nova Norma";
          }

          este.openDialog(title, message, function(){este.router.navigate(['/normas'])});

        },null,this);//fim do remsoto
      }
    }


  }

  changeEdit(){
    this.edit = true;
  }

  validaForm(){
    var n_norma = this.el.nativeElement.querySelector('#N_NORMA');
    var descricao = this.el.nativeElement.querySelector('#DESCRICAO');
    var download = this.el.nativeElement.querySelector('#DOWNLOAD');
    var titulo = this.el.nativeElement.querySelector('#TITULO');

    if(this.norma.N_NORMA == null){
      var message = "Por favor preencha a Número da norma";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){n_norma.focus()});
      return false;
    }

    if(this.norma.TITULO == null){
      var message = "Por favor preencha o Título";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){titulo.focus()});
      return false;
    }

    if(this.norma.DESCRICAO == null){
      var message = "Por favor preencha a Descrição";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){descricao.focus()});
      return false;
    }

    if(this.norma.DOWNLOAD == null){
      var message = "Por favor preencha o Download";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){descricao.download()});
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
      este.norma.DOWNLOAD = 'https://mepi.ind.br/framework/Controllers/files/' + inputNode.files[0].name;
      },null,this);//fim do remsoto


    }


}
