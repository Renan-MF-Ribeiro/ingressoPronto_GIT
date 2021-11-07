import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtracoesSelectedComponent } from './atracoes-selected/atracoes-selected.component';
import { AtracoesComponent } from './atracoes/atracoes.component';

const routes: Routes = [
  {path:'',component:AtracoesComponent},
  {path:'danca',component:AtracoesSelectedComponent},
  {path:'orquestra',component:AtracoesSelectedComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
