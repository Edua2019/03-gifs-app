import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.service';


@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.html',
})
export default class TrendingPage {

  gifsService = inject( GifService );

  /*
     el viw Child y el viewChildren nos van a servir para tomar referencias o información del HTML (elementos - piesas)
     viewChild nos va a servir para tomar una referencia de un solo elemento
     viewChildren nos va a servir para tomar una referencia de varios elementos
   */
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('goupDiv');

  onScroll(EVENT: Event){
    const scrolDiv = this.scrollDivRef()?.nativeElement;
    if(!scrolDiv) return;

    /*
      scrollTop nos da la posición del scroll en el eje Y, es decir, cuanto nos hemos desplazado hacia abajo
      clientHeight nos da la altura del elemento que tiene el scroll, es decir, cuanto mide el div que tiene el scroll
      scrollHeight nos da la altura total del contenido del elemento que tiene el scroll, es decir,
        cuanto mide todo el contenido del div que tiene el scroll
     */
    const scrollTop = scrolDiv.scrollTop;
    const clientHeight = scrolDiv.clientHeight;
    const scrollHeight = scrolDiv.scrollHeight;

    //console.log({stcrolTotal: scrollTop + clientHeight, scrollHeight});

    // Este es un booleano que nos dice si esteamos al final
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;

    console.log({isAtBottom});
    if(isAtBottom){
      this.gifsService.loadTrendingGifs();
    }

  }

}
