import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiaComponent } from './noticias/noticia/noticia.component';
import { NormasComponent } from './normas/normas.component';
import { NormaComponent } from './normas/norma/norma.component';
import { MenusComponent } from './menus/menus.component';
import { ArquivosComponent } from './arquivos/arquivos.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { ProdutoComponent } from './produtos/produto/produto.component';
import { DatabooksComponent } from './databooks/databooks.component';
import { DatabookComponent } from './databooks/databook/databook.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import {  ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { MenuComponent } from './menus/menu/menu.component';
import { HomeComponent } from './home/home.component';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { SetoresComponent } from './setores/setores.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SetorComponent } from './setores/setor/setor.component';
import { CatalogosComponent } from './catalogos/catalogos.component';
import { CatalogoComponent } from './catalogos/catalogo/catalogo.component';
import { ItensComponent } from './databooks/itens/itens.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TextMaskModule } from 'angular2-text-mask';
import { SpinnerOverlayComponentComponent } from './spinner-overlay-component/spinner-overlay-component.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerOverlayService } from './spinner-overlay.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './interceptors/loader.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientesComponent,
    ClienteComponent,
    NoticiasComponent,
    NoticiaComponent,
    NormasComponent,
    NormaComponent,
    MenusComponent,
    ArquivosComponent,
    ProdutosComponent,
    ProdutoComponent,
    DatabooksComponent,
    DatabookComponent,
    MenuComponent,
    HomeComponent,
    SetoresComponent,
    SetorComponent,
    CatalogosComponent,
    CatalogoComponent,
    ItensComponent,
    SpinnerOverlayComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSortModule,
    HttpClientModule,
    MatTableModule,
    MatSelectModule,
    MatGridListModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    TextFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    QRCodeModule,
    TextMaskModule,
    MatProgressSpinnerModule
  ],
  providers: [SpinnerOverlayService, { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
  bootstrap: [AppComponent]


})
export class AppModule { }
