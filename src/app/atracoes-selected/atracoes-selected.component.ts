import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import * as firebase from 'firebase';
import { ReservaComponent } from '../reserva/reserva.component';
import { AppComponent } from '../app.component';

import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-atracoes-selected',
  templateUrl: './atracoes-selected.component.html',
  styleUrls: ['./atracoes-selected.component.css']
})
export class AtracoesSelectedComponent implements OnInit, OnDestroy {

  destroyed = new Subject<void>();
  currentScreenSize!: string;
  cols = 3
  colsGridimg = 1
  colsGridPrincipal = 2
  colsGridSecundario = 7
  colsGridIcon = 1
  rowspan = 4
  rowSpanCadeiras = 8


  img!: string
  horario: string[] = []
  cadeiras: string[] = []
  valor!: string
  color!: string
  hora!: string
  selected: string[] = []
  colorButton!: string
  descricao!: string
  reservados: any
  reservadosA: any = []

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(private router: Router, public dialog: MatDialog, private app: AppComponent, private breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).pipe(takeUntil(this.destroyed)).subscribe((result: any) => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';

          this.ColsChange()
        }
      }
    });

  }
  ColsChange() {

    if (this.currentScreenSize.indexOf('Small') > -1) {
      this.cols = 1
      this.colsGridPrincipal = 1
      this.colsGridimg = 4
      this.colsGridSecundario = 3
      this.colsGridIcon = 1
      this.rowspan = 8
      this.rowSpanCadeiras = 16
    } else {
      this.cols = 3
      this.colsGridimg = 4
      this.colsGridPrincipal = 2
      this.colsGridSecundario = 7
      this.colsGridIcon = 1
      this.rowspan = 4
      this.rowSpanCadeiras = 8
    }

  }
  atracao = this.router.routerState.snapshot.url

  ngOnInit(): void {
    switch (this.atracao) {
      case '/danca': {
        this.colorButton = '#FF4081'
        this.danca()
        break
      }
      case '/orquestra': {
        this.orquestra()
        this.colorButton = '#3f51b5'
        break
      }
      default: {
        alert('Erro desconhecido, consulte o administrador do sistema')
      }

    }
  }


  danca() {
    this.img = 'assets/Atração-dança.jpg'
    this.horario = ['14h', '17h', '20h']
    this.valor = 'R$20,00 (inteira) | R$10,00 (meia) - Classificação Livre'
    this.color = '#ffe6e6'
    this.descricao = `O palco da Central do Universo – recebe o espetáculo de dança contemporânea “A Porta”. A coreografia de Xitão e Nilzinho Almeida fala da relação do homem e da mulher com os desafios da cidade, os aglomerados de edifícios, a periferia, carência, o trânsito, o caos, diversos problemas e eles precisam caminhar junto com a cidade, estar em evolução constante, reinventar, adaptar-se e com isso, quando uma porta se fecha, uma janela se abre e só nos resta dançar.`
    for (let i = 0; i <= 108; i++) {
      this.cadeiras.push('a')
    }
  }
  orquestra() {

    this.img = 'assets/atraçãp-orquestra.jpg'
    this.horario = ['13h', '15h', '17h', '21h']
    this.valor = 'R$20,00 (inteira) | R$10,00 (meia) - Classificação Livre'
    this.color = '#e6f3ff'
    this.descricao = `A Central do Universo – Tem o prazer de receber em seu Auditorio principal, a Orquesta Sinfônica "Juntos". Orquestra composta por ex-moradores de rua que encontraram na musica classica uma inspiração e força que os tirou das ruas e lhes aprensentou o mundo da musica, hoje fazem apresentações estado afora com o intuito de arrecadar fundos para institutos que fazem o acolhimento de pessoas em situação de rua.`

  }

  horarios(horario: string) {
    this.reservados = []
    this.reservadosA.forEach((element: any) => {
      let lugarSelect = document.getElementById(element)?.querySelector('svg')
      lugarSelect?.setAttribute('fill', '#828282')
      lugarSelect?.setAttribute('cursor', 'pointer')
    })
    this.reservadosA = []
    firebase.database().ref(`${btoa('atracoes')}/${btoa(this.atracao)}/${btoa(horario)}`)
      .once('value', a => {

        this.reservados = snapshotToArray(a);
        this.reservados.forEach((element: any) => {
          setTimeout(() => {
            this.reservadosA.push(atob(element.key))
            let lugarSelect = document.getElementById(atob(element.key))?.querySelector('svg')
            lugarSelect?.setAttribute('fill', '#ff0000')
            lugarSelect?.setAttribute('cursor', 'not-allowed')
          }, 100);
        });



        this.selected.forEach(element => {
          let lugarSelect = document.getElementById(element)?.querySelector('svg')
          lugarSelect?.setAttribute('fill', '#828282')
        })
        this.selected = []

        let hora = document.getElementById(horario)
        let horaAntes = document.getElementById(this.hora)
        if (this.hora == horario) {
          hora?.style.setProperty('background-color', this.colorButton)
          hora?.style.setProperty('color', '#ffffff')
        } else {


          hora?.style.setProperty('background-color', this.colorButton)
          hora?.style.setProperty('color', '#ffffff')

          horaAntes?.style.setProperty('background-color', '#ffffff')
          horaAntes?.style.setProperty('color', '#000000')
        }

        this.hora = horario
      })
  }

  select(lugar: string) {
    if(this.reservadosA.includes(lugar)){
      alert('Assento já reservado')
    }else{

      let color: string = '#04ff00'
      if (this.selected.includes(lugar)) {
      color = '#828282'
      const index = this.selected.indexOf(lugar);
      
      if (index >= 0) {
        this.selected.splice(index, 1);
      }

    } else {
      
      this.selected.push(lugar)
    }
    let lugarSelect = document.getElementById(lugar)?.querySelector('svg')
    lugarSelect?.setAttribute('fill', color)
    
  }
  }
  
  reserva() {

    if (sessionStorage.getItem(btoa('token')) != null) {
      if (this.selected.length == 0) {
        this.dialog.open(ErrorDialog)
      } else {
        const dialog = this.dialog.open(ReservaComponent, {
          width: '100%',
          data: { atracao: this.atracao, img: this.img, horario: this.hora, lugares: this.selected, descricao: this.descricao }
        });
        dialog.afterClosed().subscribe(resposta => {
          this.horarios(this.hora)
        })
      }
    } else {
      const dialogRef = this.dialog.open(LoginComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {

          firebase.database().ref(`usuario_detalhe/${btoa(result)}`)
            .once('value')
            .then((snapshot: any) => {
              this.app.user = `Olá, ${snapshot.val().apelido}`
            })
          if (this.selected.length == 0) {
            this.dialog.open(ErrorDialog)
          } else {
            const dialog = this.dialog.open(ReservaComponent, {
              width: '100%',
              data: { atracao: this.atracao, img: this.img, horario: this.hora, lugares: this.selected, descricao: this.descricao }
            });
            dialog.afterClosed().subscribe(resposta => {
              this.horarios(this.hora)
            })
          }
        }
      });


    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

@Component({
  selector: 'error-dialog',
  templateUrl: 'erro.html',
})
export class ErrorDialog {

  constructor(
    public dialogRef: MatDialogRef<ErrorDialog>) { }



}

function snapshotToArray(snapshot: any) {
  var returnArr: any = [];

  snapshot.forEach(function (childSnapshot: any) {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });

  return returnArr;
};