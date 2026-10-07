import { Routes } from '@angular/router';
import { MovieForm } from './admin/movie-form/movie-form';

export const routes: Routes = [
  { path: 'admin/peliculas/nueva', component: MovieForm },
  { path: 'admin/peliculas/:movieId/editar', component: MovieForm },
];
