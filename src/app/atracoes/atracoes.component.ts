import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-atracoes',
  templateUrl: './atracoes.component.html',
  styleUrls: ['./atracoes.component.css']
})
export class AtracoesComponent implements OnInit,OnDestroy  {
  destroyed = new Subject<void>();
  currentScreenSize!: string;
  cols=12
  colsGridimg=4
  colsGridPrincipal=8
  colsGridSecundario=7
  colsGridIcon=1
  row='2vw'
  rowSpanDescricao=4
  

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  constructor(private route: Router,private breakpointObserver: BreakpointObserver) { breakpointObserver.observe([
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
    this.cols = 4
    this.colsGridPrincipal = 4
    this.colsGridimg=4
    this.colsGridSecundario=3
    this.colsGridIcon=1
    this.row='8vw'
    this.rowSpanDescricao=5
  } else {
    this.cols = 12
    this.colsGridimg=4
    this.colsGridPrincipal=8
    this.colsGridSecundario=7
    this.colsGridIcon=1
    this.row='2vw'
    this.rowSpanDescricao=4
  }

}

  ngOnInit(): void {
  }


  atracoes(atracao: string) {
    switch (atracao) {
      case 'orquestra': {
        this.route.navigate(['orquestra'])
        break
      }
      case 'danca': {
        this.route.navigate(['danca'])
        break
      }
      default: {
        alert: 'Erro desconhecido, contate o administrador do sistema.'
      }
    }
  }
  
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
