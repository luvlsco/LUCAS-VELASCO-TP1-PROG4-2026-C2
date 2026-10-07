import { Component, inject } from '@angular/core';
import { CatalogStore } from '../../services/catalog-store';

@Component({
  selector: 'app-coming-soon',
  imports: [],
  templateUrl: './coming-soon.html',
})
export class ComingSoon {
  protected readonly store = inject(CatalogStore);
}
