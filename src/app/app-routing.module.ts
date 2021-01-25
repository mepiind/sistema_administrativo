import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DatabookComponent } from './databooks/databook/databook.component';
import { ClientesComponent } from './clientes/clientes.component';
import { NormasComponent } from './normas/normas.component';
import { ClienteComponent } from './clientes/cliente/cliente.component';
import { MenusComponent } from './menus/menus.component';
import { MenuComponent } from './menus/menu/menu.component';
import { HomeComponent } from './home/home.component';
import { NormaComponent } from './normas/norma/norma.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiaComponent } from './noticias/noticia/noticia.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { ProdutoComponent } from './produtos/produto/produto.component';
import { DatabooksComponent } from './databooks/databooks.component';
import { SetoresComponent } from './setores/setores.component';
import { SetorComponent } from './setores/setor/setor.component';
import { CatalogosComponent } from './catalogos/catalogos.component';
import { CatalogoComponent } from './catalogos/catalogo/catalogo.component';
import { ItensComponent } from './databooks/itens/itens.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  {  path: 'databook', component: DatabookComponent },
  {  path: 'clientes', component: ClientesComponent },
  {  path: 'cliente', component: ClienteComponent },
  {  path: 'menus', component: MenusComponent },
  {  path: 'menu', component: MenuComponent },
  {  path: 'normas', component: NormasComponent },
  {  path: 'norma', component: NormaComponent },
  {  path: 'noticias', component: NoticiasComponent },
  {  path: 'noticia', component: NoticiaComponent },
  {  path: 'produtos', component: ProdutosComponent },
  {  path: 'produto', component: ProdutoComponent },
  {  path: 'databooks', component: DatabooksComponent },
  {  path: 'databook', component: DatabookComponent },
  {  path: 'setores', component: SetoresComponent },
  {  path: 'setor', component: SetorComponent },
  {  path: 'home', component: HomeComponent },

  {  path: 'catalogos', component: CatalogosComponent },
  {  path: 'catalogo', component: CatalogoComponent },
  {  path: 'itens', component: ItensComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
