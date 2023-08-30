import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent {

  @ViewChild('cotizacion', {static: false}) cotizacion!:ElementRef

  generarPDF() {
      const cotizacion = new jsPDF();

      cotizacion.setFontSize(10)
      cotizacion.html(this.cotizacion.nativeElement, {
        callback: (pdf) => {
          pdf.setFontSize(10)
          pdf.save('Cotizacion.pdf');
        }
      })
  }

}
