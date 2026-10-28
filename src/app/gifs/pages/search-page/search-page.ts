import { Component, inject, signal } from '@angular/core';
import { GifList } from '../../components/gif-list/gif-list';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html',
})
export default class SearchPage {

  gifService = inject(GifService);
  loadSearchGifs = signal<Gif[]>([]);

  onSearch( Query: string ){

    this.gifService.searchGifs(Query)
    .subscribe( (resp) =>{

      this.loadSearchGifs.set(resp);

    });

  }

}
