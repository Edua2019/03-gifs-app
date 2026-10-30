import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const gif_Key = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(gif_Key) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;
}


@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);

  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();

  }

  saveToLocalStorage = effect( () =>{
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(gif_Key, historyString);
  });

  loadTrendingGifs(){

    this.http.get<GiphyResponse>(`${ environment.giphyApiUrl}/gifs/trending`,{
      params:{
        api_key: environment.giphyApiKey,
        limit: 20
      },
    }).subscribe( (resp) => {

      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
      console.log({gifs});
    });

  }

  /*
    Tarea.
    Crear un metodo searchGifs que reciba el query
  */

  searchGifs(query: string){
    return this.http.get<GiphyResponse>(`${ environment.giphyApiUrl}/gifs/search`,{
      params:{
        api_key: environment.giphyApiKey,
        q: query,
        limit: 25
      },
    }).pipe(
      map( ({data}) => data ),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      //TODO HISTORIAL

      tap(items =>{
        this.searchHistory.update( history => ({
          ... history,
          [query.toLocaleLowerCase()]: items,
        }));
      })
    );
    // .subscribe( (resp) =>{
    //   const gif = GifMapper.mapGiphyItemsToGifArray(resp.data);

    //   console.log({gif});
    // });
  }

  getHistoryGifs( query: string): Gif[]{
    return this.searchHistory()[query] ?? [];
  }



}
