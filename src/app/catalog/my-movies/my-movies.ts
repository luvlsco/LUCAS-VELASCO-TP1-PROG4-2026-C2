import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogStore } from '../../services/catalog-store';
import { MyMoviesStore } from '../../services/my-movies-store';

@Component({
  selector: 'app-my-movies',
  imports: [RouterLink],
  templateUrl: './my-movies.html',
})
export class MyMovies {
  protected readonly store = inject(CatalogStore);
  protected readonly mine = inject(MyMoviesStore);

  protected setRating(movieId: number, value: string): void {
    this.mine.rate(movieId, Number(value));
  }
}
