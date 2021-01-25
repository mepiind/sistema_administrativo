import { Component, OnInit, Directive, HostListener, ElementRef } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog/dialog';


@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {

  public edit = null;
  public estate = null;
  public categorias = null;
  public menus;
  public catalogo;
  public produto = {
      MENU_DESC : null,
      LINK_FOTO : null,
      ADICIONAIS : null,
      INFORMACAO : null,
      CARACTERISTICAS : null,
      DESCRICAO : null,
      MARCA : null,
      NORMA : null,
      CODIGO : null,
      CATEGORIA : null,
      APLICACAO : null,
      CA : null,
      LINK_FOTO_REAL :null,
      PRODUTO: null
  }

  constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {

    apiService.acessorGet( 'menus', function(resp,este){
      este.menus = resp;
    },null,this);



    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.estate = this.router.getCurrentNavigation().extras.state;
        this.categorias = this.estate.categorias;
        this.catalogo = this.estate.catalogo;
        if(this.estate.element != null){
          var rota ='produtos/' + this.estate.element;
          this.apiService.acessorGet( rota, function(resp,este){
            este.produto = resp.resp;
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
        var rota ='produtos/' + this.estate.element;
        this.apiService.acessorPut( rota, this.produto,function(resp,este){

          if(resp.resp != 0) {
            var message = "Produto editado com sucesso";
            var title = "Editando Produto";
          } else {
            var message = "O Produto não foi editado com sucesso";
            var title = "Erro editar Produto";
          }

            este.openDialog(title, message, function(){este.router.navigate(['/produtos'])});

        },null,this);//fim do remsoto
      } else {
        var rota ='produtos/new';
        this.apiService.acessorPost( rota, this.produto,function(resp,este){

          if(resp.resp != 0) {
            var message = "Produto criado com sucesso";
            var title = "Novo produto";
          } else {
            var message = "O Produto não foi criado com sucesso";
            var title = "Erro ao criar novo Produto";
          }

          este.openDialog(title, message, function(){este.router.navigate(['/produtos'])});

        },null,this);//fim do remsoto
      }
    }


  }

  changeEdit(){
    this.edit = true;
  }

  validaForm(){
    var menu = this.el.nativeElement.querySelector('#menu');
    var descricao = this.el.nativeElement.querySelector('#descricao');
    var imagem = this.el.nativeElement.querySelector('#imagem');

    if(this.produto.DESCRICAO == null){
      var message = "Por favor preencha a descrição do produto";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){descricao.focus()});
      return false;
    }

    if(this.produto.CATEGORIA == null){
      var message = "Por favor preencha a categoria do produto";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){descricao.focus()});
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

  onFileSelected(foto) {
    const inputNode: any = document.querySelector('#file');
      this.apiService.acessorpostFile( inputNode.files[0], function(resp,este){
      este.produto[foto] = 'https://mepi.ind.br/framework/Controllers/files/' + inputNode.files[0].name;
      },null,this);//fim do remsoto


    }

    converteDrive(foto){


      const regex = /(\/file\/d\/)(.*)(\/view)/;
      const str = this.produto[foto] ;
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
          this.produto[foto] =  link;
      } else {
         this.openDialog("incorreto", "Este Link está incorreto", function(){});
      }



    }

    generateQR(index){
      return 'https://mepi.ind.br/produto_linha_vida/' + index;
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event) {

      if(this.catalogo != null){
        let navigationExtras: NavigationExtras = {
          state: {
            element: this.catalogo,
            type:'details'
  
          }
        };
        this.router.navigate(['/catalogo'], navigationExtras);
      } else {
        this.router.navigate(['/produtos']);
      }

        
    }

}
