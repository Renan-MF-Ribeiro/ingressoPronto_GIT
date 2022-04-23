import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './angular-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Auth } from './services/auth.services';
import { AtracoesComponent } from './atracoes/atracoes.component';
import { AtracoesSelectedComponent, ErrorDialog } from './atracoes-selected/atracoes-selected.component';
import { ReservaComponent } from './reserva/reserva.component';
import { QRCodeModule } from 'angular2-qrcode';
import { UsuarioComponent } from './usuario/usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AtracoesComponent,
    AtracoesSelectedComponent,
    ReservaComponent,
    ErrorDialog,
    UsuarioComponent

  ],
  entryComponents: [LoginComponent, ReservaComponent, ErrorDialog],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule

  ],
  providers: [Auth,AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
