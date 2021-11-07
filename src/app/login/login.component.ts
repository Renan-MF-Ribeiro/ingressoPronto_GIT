import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Auth } from '../services/auth.services';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  register = false
  errorLogin!: any
  usuario = new FormGroup({
    email: new FormControl('',Validators.email),
    password: new FormControl('',Validators.required)
  })
  
  
  registrarUsuario = new FormGroup({
    email: new FormControl('',Validators.email),
    nome: new FormControl ('',Validators.required),
    apelido: new FormControl ('',Validators.required),
    password: new FormControl('',Validators.required),
    passwordConfirm: new FormControl('',Validators.required)
  })
  
  passwordConfirm= true

confirmPassword(){
 this.passwordConfirm= this.registrarUsuario.value.password != this.registrarUsuario.value.passwordConfirm
}

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth:Auth) {}

  ngOnInit(): void {
  }

  cadastrar(){ 
    this.auth.cadastroSucess = 'null'
      this.auth.register(this.registrarUsuario.value)

      setTimeout(()=>{
        this.cadastroSucess()   
     },100)
    
  }
entrar(){
  this.auth.loginSucess = 'null'
  this.auth.entrar(this.usuario.value)
   setTimeout(()=>{
     this.loginSucess()   
  },100)
  
}

loginSucess(){
  if(this.auth.loginSucess != 'null'){

    if(this.auth.loginSucess == 'true'){
      this.dialogRef.close(this.usuario.value.email)
      
    }else{
      this.errorLogin = this.auth.error
   }
     
  }else{

    setTimeout(()=>{
      this.loginSucess()
    },100)
  }
 }

cadastroSucess(){
  if(this.auth.cadastroSucess != 'null'){

    if(this.auth.cadastroSucess == 'true'){
      this.errorLogin= 'Registrado com Sucesso, faça login para continuar' 
      setTimeout(()=>{
        this.register = false
        this.errorLogin= undefined  
        },5000)
      
    }else{
      this.errorLogin = this.auth.error
      setTimeout(()=>{
      this.errorLogin= undefined 
      },5000)
    }
     
  }else{

    setTimeout(()=>{
      this.cadastroSucess()
    },100)
  }
 }
}