import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { environment } from '../../environments/environment';
import { DialogOverviewExampleDialog } from '../dialog/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SpinnerOverlayComponentComponent } from '../spinner-overlay-component/spinner-overlay-component.component';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private overlayRef: OverlayRef = undefined;

  constructor(private overlay: Overlay,private http: HttpClient, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

    verificaSessao(){
      if(sessionStorage.getItem('chave') == undefined){
        this.router.navigate(['/login']);
        environment.logged = false;
        return false;
      } else {
        return sessionStorage.getItem('chave');
      }
    }


  acessorPost(rota,parametros,sucesso,erro,este){

    var jwt = this.verificaSessao();
    var resposta = null;
        parametros.jwt = jwt;

    var param = JSON.stringify(parametros);
    var headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    this.http.post('https://mepi.ind.br/framework/' + rota ,param,{headers: headers})
    .subscribe( data => {
      resposta = data;
      if(resposta.error != undefined && resposta.error != ""){
          this.openDialog("Erro interno", resposta.error, function(){console.log("error")});
      }
      sucesso(resposta,este);
    }, error => {
     console.log(error)
   },() => {} );
  }

  acessorPut(rota,parametros,sucesso,erro,este){


    var jwt = this.verificaSessao();
    var resposta = null;
        parametros.jwt = jwt;

    var param = JSON.stringify(parametros);
    var headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    this.http.put('https://mepi.ind.br/framework/' + rota ,param,{headers: headers})
    .subscribe( data => {
      resposta = data;
      if(resposta.error != undefined && resposta.error != ""){
          this.openDialog("Erro interno", resposta.error, function(){console.log("error")});
      }
      sucesso(resposta,este);
      
    }, error => {
     console.log(error)
    },() => {} );
  }

  acessorGet(rota,sucesso,erro,este){
   this.verificaSessao();
    var resposta = null;
    var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
      this.http.get('https://mepi.ind.br/framework/' + rota,{headers: headers})
      .subscribe( data => {
        resposta = data;
        sucesso(resposta,este);
      }, error => {
       console.log(error)
     },() => {} );
    }

    acessorDelete(rota,sucesso,erro,este){
    }

    acessorpostFile(fileToUpload: File,sucesso,erro,este) {
        var jwt = this.verificaSessao();
        const endpoint = 'https://mepi.ind.br/framework/upload';
        const formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
         this.http.post(endpoint, formData).subscribe((response: Response) => {
           console.log('teste');
              sucesso(response,este);
        }, error => {
         console.log(error)
        },() => {} );
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
