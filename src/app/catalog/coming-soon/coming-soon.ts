import { Component, inject } from '@angular/core';
import { AlertStore } from '../../services/alert-store';
import { CatalogStore } from '../../services/catalog-store';

@Component({
  selector: 'app-coming-soon',
  imports: [],
  templateUrl: './coming-soon.html',
})
export class ComingSoon {
  protected readonly store = inject(CatalogStore);
  protected readonly alerts = inject(AlertStore);
}
