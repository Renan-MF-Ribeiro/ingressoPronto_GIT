import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as firebase from 'firebase';
import jsPDF from 'jspdf';
import { Auth } from '../services/auth.services';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  constructor(private dialog: MatDialogRef<ReservaComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private auth: Auth) {
  }

  qrcodeString:any= 'INGRESSO PRONTO'
  cursor: string = 'default'
  ingressos: any[] = []
  valorTotal!: number
  cliente!: any
  regras: string = `
  * PARA CORRETA UTILIZAÇÃO DO VOUCHER DIGIRIJA-SE A BILHETERIA DO TEATRO PORTANDO DOCUMENTO COM FOTO E ESTE QR CODE.
  * AS RESERVAS SÃO ASSEGURADAS ATÉ O PERIODO DE 2 HORAS ANTES DA APRESENTAÇÃO, CASO NÃO OCORRA O PAGAMENTO DOS INGRESSOS ATÉ ESTE MOMENTO, O INGRESSOS SERÃO DISPONIBILIZADOS.*
  * NÃO É PERMITIDO O CONSUMO DE ALIMENTOS E BEBIDOS NAS ÁREAS INTERNAS DO TEATRO.
  * MENORES DE 12 DEVEM ESTAR ACOMPANHADOS DE PAIS OU RESPONSAVEIS LEGAIS.
  * MENORES DE 16 DEVEM ESTAR ACOMPANHADOS DE APENAS.
  * NÃO É PERMITIDO O CONSUMO DE BEBIBAS ALCOLICAS NAS DEPÊNDENCIAS DO TEATRO`


  ngOnInit(): void {
    firebase.database().ref(`usuario_detalhe/${btoa(this.auth.email)}`)
    .once('value')
    .then((snapshot: any) => {
     this.cliente = snapshot.val()
    this.data.lugares.forEach((element: any) => {
       let lugarSelect = document.getElementById(`reserva-${element}`)
       lugarSelect?.style.setProperty('fill', '#04ff00')
       
       this.ingressos.push({ lugar: element, ingresso: 'Inteira' })
      });
      this.total()
      
    })
    }
  total() {
       let valor = 0
    this.ingressos.forEach(element => {
      if (element.ingresso == "Meia") {
        valor += 10
      } else {
        valor += 20
      }
    })
    this.valorTotal = valor
    this.qrcodeString=`email: ${this.cliente.email},nome: ${this.cliente.nome},lugares: ${this.data.lugares},valor: R$ ${this.valorTotal},00`
  }
  reservar() {
    this.cursor = 'wait'
    var interacao=this.ingressos.length
    this.ingressos.forEach(i=>{
      let valor
      if (i.ingresso == "Meia") {
        valor = 10
      } else {
        valor = 20
      }
      firebase.database().ref(`${btoa('atracoes')}/${btoa(this.data.atracao)}/${btoa(this.data.horario)}/${btoa(i.lugar)}`)
      .set({lugar:i.lugar,
        email:this.cliente.email,
        nome:this.cliente.nome,
        tipo:i.ingresso,
        valor:valor
      }).then((sucess: any) => {
        interacao = interacao - 1
        if(interacao ==0){
      this.voucher()
    }
      })
    })
  }
voucher(){
    
    var doc = new jsPDF
    var meia:any[]=[]
    var inteira:any[]=[]
    this.qrcodeString=`email: ${this.cliente.email},nome: ${this.cliente.nome},lugares: ${this.data.lugares},valor: R$ ${this.valorTotal},00, token: ${btoa(this.data.lugares)}`
    this.ingressos.forEach(element => {
  if (element.ingresso == "Meia") {
        meia.push(element)
      } else {
        inteira.push(element)
      }
    })
    var img = new Image();
    img.src = this.data.img
    img.setAttribute('border-radius','250px')
    var cadeiras: any = document.getElementById('cadeirasReserva')
    var qrcoreElement: any = document.getElementById('qrcode')
    var lugares = new Image()
    var qrcode = new Image()

    htmlToImage.toPng(cadeiras).then((a: any) => {
      lugares.src = a
      htmlToImage.toPng(qrcoreElement).then((b:any)=>{
        qrcode.src = b
        doc.addImage(img, 'jpg', 10, 10, 90, 60)
        doc.setFontSize(12)
        doc.text(doc.splitTextToSize(this.data.descricao, 90), 105, 15)
        doc.addImage(lugares, 'png', 20, 75, 170, 100)
        doc.text(doc.splitTextToSize(`Email: ${this.cliente.email}`,90),20,194)
        doc.text(doc.splitTextToSize(`Nome: ${this.cliente.nome}`,90),20,201)
        doc.text(doc.splitTextToSize(`Ingressos Inteira: ${inteira.length}`,90),20,208)
        doc.text(doc.splitTextToSize(`Ingressos Meia: ${meia.length}`,90),20,215)
        doc.text(doc.splitTextToSize(`Horario da Apresentação: ${this.data.horario}`,90),20,222)
        doc.text(doc.splitTextToSize(`Valor Total: R$ ${this.valorTotal},00`,90),20,229)
        doc.addImage(qrcode, 'png', 130, 180, 60 , 60)
        doc.setFontSize(9)
        doc.text(doc.splitTextToSize(this.regras, 190), 10, 260)
        this.fechar()
        window.open(doc.output('bloburl').toString(), '_blank')
      })
    })






     }

  fechar() {
    this.dialog.close()
  }
}
