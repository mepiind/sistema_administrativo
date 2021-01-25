import { Component, OnInit, Directive, HostListener, ElementRef } from '@angular/core';
import {  ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DialogOverviewExampleDialog } from '../../dialog/dialog';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  public edit = null;
  public estate = null;
  public cliente = {
    USUARIO : null,
    SENHA: null,
    NOME: null,
    CPF: null,
    CEP: null,
    CIDADE: null,
    ESTADO: null,
    TELEFONE: null,
    CELULAR: null,
    ENDERECO: null,
    EMAIL: null,
    SITE: null,
  }

  constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router, private apiService:ApiService, public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.estate = this.router.getCurrentNavigation().extras.state;

        if(this.estate.element != null){
          var rota ='clientes/' + this.estate.element;
          this.apiService.acessorGet( rota, function(resp,este){
            este.cliente = resp.resp;
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
        var rota ='clientes/' + this.estate.element;
        this.apiService.acessorPut( rota, this.cliente,function(resp,este){

          if(resp.resp != 0) {
            var message = "Cliente editado com sucesso";
            var title = "Editando Cliente";
          } else {
            var message = "Cliente não foi editado com sucesso";
            var title = "Erro ao editar cliente";
          }

          este.openDialog(title, message, function(){este.router.navigate(['/clientes'])});

        },null,this);//fim do remsoto
      } else {
        var rota ='clientes/new';
        this.apiService.acessorPost( rota, this.cliente,function(resp,este){

          if(resp.resp != 0) {
            var message = "Cliente criado com sucesso";
            var title = "Novo cliente";
          } else {
            var message = "Cliente não foi criado com sucesso";
            var title = "Erro ao criar novo cliente";
          }

          este.openDialog(title, message, function(){este.router.navigate(['/clientes'])});

        },null,this);//fim do remsoto
      }
    }


  }

  changeEdit(){
    this.edit = true;
  }

  validaForm(){
    var nome = this.el.nativeElement.querySelector('#nome');
    var celular = this.el.nativeElement.querySelector('#celular');
    var cpf = this.el.nativeElement.querySelector('#cpf');

    if(this.cliente.NOME == null){
      var message = "Por favor preencha o nome";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){nome.focus()});
      return false;
    }

    if(this.cliente.CPF == null){
      var message = "Por favor preencha o cpf";
      var title = "Campo obrigatório";
      this.openDialog(title, message, function(){cpf.focus()});
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
