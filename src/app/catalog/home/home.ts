import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogStore } from '../../services/catalog-store';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  protected readonly store = inject(CatalogStore);
}
