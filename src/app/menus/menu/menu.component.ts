import { Component, OnInit, Directive, HostListener, ElementRef } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../dialog/dialog';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public edit = null;
  public estate = null;
  public categorias = null;
  public menu = {
    DESCRICAO : null,
    TIPO: null,
    PAI_CATEGORIA: null,
    CATEGORIA : null,
    ICONE: null

  }

  constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.estate = this.router.getCurrentNavigation().extras.state;
        this.categorias = this.estate.categorias;
        if(this.estate.element != null){
          var rota ='menus/' + this.estate.element;
          this.apiService.acessorGet( rota, function(resp,este){
            este.menu = resp.resp;
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
        var rota ='menus/' + this.estate.element;
        this.apiService.acessorPut( rota, this.menu,function(resp,este){

          if(resp.resp != 0) {
            var message = "Menu editado com sucesso.";
            var title = "Editando Menu";
          } else {
            var message = "O Menu não foi editado com sucesso.";
            var title = "Erro ao editar Menu";
          }

          este.openDialog(title, message,function(){este.router.navigate(['/menus'])});

        },null,this);//fim do remsoto
      } else {
        var rota ='menus/new';
        this.apiService.acessorPost( rota, this.menu,function(resp,este){


          if(resp.resp != 0) {
            var message = "Menu criado com sucesso.";
            var title = "Novo Menu";
          } else {
            var message = "O Menu não foi criado com sucesso.";
            var title = "Erro ao criar Menu";
          }

          este.openDialog(title, message, function(){este.router.navigate(['/menus'])});

        },null,this);//fim do remsoto
      }
    }


  }

  changeEdit(){
    this.edit = true;
  }

  validaForm(){
    var descricao = this.el.nativeElement.querySelector('#descricao');
    var menuTipo = this.el.nativeElement.querySelector('#menuTipo');

    if(this.menu.TIPO == null){
      var message = "Por favor preencha a Categoria";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){menuTipo.focus()});
      return false;
    }

    if(this.menu.DESCRICAO == null){
      var message = "Por favor preencha a Descrição";
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

  
  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
      this.apiService.acessorpostFile( inputNode.files[0], function(resp,este){
      este.menu.ICONE = 'https://mepi.ind.br/framework/Controllers/files/' + inputNode.files[0].name;
      },null,this);//fim do remsoto


    }

    converteDrive(){

      const regex = /(\/file\/d\/)(.*)(\/view)/;
      const str = this.menu.ICONE ;
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
          this.menu.ICONE =  link;
      } else {
        this.openDialog("incorreto", "Este Link está incorreto", function(){});
      }



    }

}
