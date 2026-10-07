import { Component, inject } from '@angular/core';
import { CatalogStore } from '../../services/catalog-store';
import { MOVIE_GENRES } from '../movie.model';

@Component({
  selector: 'app-movie-list',
  imports: [],
  templateUrl: './movie-list.html',
})
export class MovieList {
  protected readonly store = inject(CatalogStore);
  protected readonly genreOptions = MOVIE_GENRES;
}
