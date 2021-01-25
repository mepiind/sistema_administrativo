import { Component, OnInit, Directive, HostListener, ElementRef } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog/dialog';


@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {

  public edit = null;
  public estate = null;
  public categorias = null;
  public noticia = {
    DESCRICAO : null,
    DESCRICAO_REDUZ : null,
    LINK_IMG: null,
    NOTICIA : null,
    TITULO : null

  }

  constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.estate = this.router.getCurrentNavigation().extras.state;
        this.categorias = this.estate.categorias;
        if(this.estate.element != null){
          var rota ='noticias/' + this.estate.element;
          this.apiService.acessorGet( rota, function(resp,este){
            este.noticia = resp.resp;
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
        var rota ='noticias/' + this.estate.element;
        this.apiService.acessorPut( rota, this.noticia,function(resp,este){

          if(resp.resp != 0) {
            var message = "Notícia alterada com sucesso.";
            var title = "Alteração";
          } else {
            var message = "A Notícia não foi alterada com sucesso.";
            var title = "Erro ao tentar fazer a alteração";
          }

            este.openDialog(title, message, function(){este.router.navigate(['/noticias'])});

        },null,this);//fim do remsoto
      } else {
        var rota ='noticias/new';
        this.apiService.acessorPost( rota, this.noticia,function(resp,este){

          if(resp.resp != 0) {
            var message = "Notícia criada com sucesso.";
            var title = "Nova noticia";
          } else {
            var message = "A Notícia não foi criada com sucesso.";
            var title = "Erro ao criar novo cliente";
          }

          este.openDialog(title, message, function(){este.router.navigate(['/noticias'])});

        },null,this);//fim do remsoto
      }
    }


  }

  changeEdit(){
    this.edit = true;
  }

  validaForm(){
    var descricao = this.el.nativeElement.querySelector('#descricao');
    var titulo = this.el.nativeElement.querySelector('#titulo');
    var download = this.el.nativeElement.querySelector('#download');
    var descReduz = this.el.nativeElement.querySelector('#descricaoReduz');

    if(this.noticia.TITULO == null){
      var message = "Por favor preencha Título da Notícia";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){titulo.focus()});
      return false;
    }

    if(this.noticia.DESCRICAO == null){
      var message = "Por favor preencha o Descrição da Notícia";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){descricao.focus()});
      return false;
    }

    if(this.noticia.DESCRICAO_REDUZ == null){
      var message = "Por favor preencha o Descrição reduzida da Notícia";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){descReduz.focus()});
      return false;
    }

    if(this.noticia.LINK_IMG == null){
      var message = "Por favor preencha link da imagem da Notícia";
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
      este.noticia.LINK_IMG = 'https://mepi.ind.br/framework/Controllers/files/' + inputNode.files[0].name;
      },null,this);//fim do remsoto


    }

    converteDrive(){

      const regex = /(\/file\/d\/)(.*)(\/view)/;
      const str = this.noticia.LINK_IMG ;
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
          this.noticia.LINK_IMG =  link;
      } else {
        this.openDialog("incorreto", "Este Link está incorreto", function(){});
      }



    }


}
