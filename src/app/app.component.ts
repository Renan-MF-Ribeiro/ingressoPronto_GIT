import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import * as firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Ingresso Pronto';
  

  constructor(public dialog: MatDialog) { }
    

  public user = 'Login'

  ngOnInit() {
    localStorage.clear()
    sessionStorage.clear()
   

    firebase.initializeApp(firebaseConfig);

  }

  login(): void {
    if (this.user == 'Login') {
      const dialogRef = this.dialog.open(LoginComponent, {

        data: { name: '' }
      });

      dialogRef.afterClosed().subscribe(result => {
       if (result != undefined) {

          firebase.database().ref(`usuario_detalhe/${btoa(result)}`)
            .once('value')
            .then((snapshot: any) => {
              this.user = `Olá, ${snapshot.val().apelido}`
            })
        }
      });
    }
    else {
      let sidenav = ((<HTMLButtonElement>document.getElementById("pessoasMenu")))
      sidenav.click()
    }
  }

  sair() {
    let sidenav = ((<HTMLButtonElement>document.getElementById("pessoasMenu")))
    firebase.auth().signOut().then(() => {
      sidenav.click()
      this.user = 'Login'
      localStorage.clear()
      sessionStorage.clear()
      alert('Logout realizado com sucesso')
    }).catch((error) => {
      sidenav.click()
      alert('Algo não aconteceu bem, tente novamente')
    });

  }

  
}
