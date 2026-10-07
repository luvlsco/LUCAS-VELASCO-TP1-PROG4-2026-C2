import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogStore } from '../../services/catalog-store';

@Component({
  selector: 'app-movie-admin',
  imports: [RouterLink],
  templateUrl: './movie-admin.html',
})
export class MovieAdmin {
  protected readonly store = inject(CatalogStore);
}
