import { Component, OnInit, Directive, HostListener, ElementRef } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog/dialog';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  public edit = null;
  public estate = null;
  public produtosDisp;
  public catalogo = {
    IFRAME : null,
    LINK_IMG: null,
    CATALOGO : null,
    TITULO : null,
    PRODUTOS: []

  }

  public indexProdutos = 0;
  public produtos = [];

  constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.estate = this.router.getCurrentNavigation().extras.state;
        if(this.estate.element != null){
          var rota ='catalogos/' + this.estate.element;
          this.apiService.acessorGet( rota, function(resp,este){
            este.catalogo = resp.resp;
            console.log(este.catalogo);
          },null,this);//fim do remsoto
        }


        
        apiService.acessorGet( 'produtos',function(resp,este){
          este.produtosDisp = resp;
        },null,this);//fim do remsoto*/

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

  enviaProduto(produto){
    let navigationExtras: NavigationExtras = {
      state: {
        element:produto,
        type:'details',
        catalogo: this.catalogo.CATALOGO
      }
    };
    this.router.navigate(['/produto'], navigationExtras);
  }
  

  salvar(){
    if(this.validaForm()){
      if(this.estate.element != null){
        var rota ='catalogos/' + this.estate.element;
        this.apiService.acessorPut( rota, this.catalogo,function(resp,este){

          if(resp.resp != 0) {
            var message = "Catálogo alterada com sucesso.";
            var title = "Alteração";
          } else {
            var message = "A Catálogo não foi alterada com sucesso.";
            var title = "Erro ao tentar fazer a alteração";
          }

            este.openDialog(title, message, function(){este.router.navigate(['/catalogos'])});

        },null,this);//fim do remsoto
      } else {
        var rota ='catalogos/new';
        this.apiService.acessorPost( rota, this.catalogo,function(resp,este){

          if(resp.resp != 0) {
            var message = "Catálogo criada com sucesso.";
            var title = "Nova catalogo";
          } else {
            var message = "A Catálogo não foi criada com sucesso.";
            var title = "Erro ao criar novo cliente";
          }

          este.openDialog(title, message, function(){este.router.navigate(['/catalogos'])});

        },null,this);//fim do remsoto
      }
    }


  }

  changeEdit(){
    this.edit = true;
  }

  validaForm(){
    var titulo = this.el.nativeElement.querySelector('#titulo');
    var download = this.el.nativeElement.querySelector('#download');
    var iframe = this.el.nativeElement.querySelector('#iframe');

    if(this.catalogo.TITULO == null){
      var message = "Por favor preencha Título da Catálogo";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){titulo.focus()});
      return false;
    }

    if(this.catalogo.IFRAME == null){
      var message = "Por favor preencha o Descrição da Catálogo";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){iframe.focus()});
      return false;
    }

    if(this.catalogo.LINK_IMG == null){
      var message = "Por favor preencha link da imagem da Catálogo";
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
      este.catalogo.LINK_IMG = 'https://mepi.ind.br/framework/Controllers/files/' + inputNode.files[0].name;
      },null,this);//fim do remsoto


    }

    converteDrive(){

      const regex = /(\/file\/d\/)(.*)(\/view)/;
      const str = this.catalogo.LINK_IMG ;
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
          this.catalogo.LINK_IMG =  link;
      } else {
        this.openDialog("incorreto", "Este Link está incorreto", function(){});
      }




    }

    generateQR(index){
      return 'https://mepi.ind.br/produtos_linha_vida/' + index;
    }


}

