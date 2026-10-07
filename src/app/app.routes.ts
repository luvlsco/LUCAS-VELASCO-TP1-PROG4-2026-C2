import { Routes } from '@angular/router';
import { MovieAdmin } from './admin/movie-admin/movie-admin';
import { MovieForm } from './admin/movie-form/movie-form';
import { Home } from './catalog/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin/peliculas', component: MovieAdmin },
  { path: 'admin/peliculas/nueva', component: MovieForm },
  { path: 'admin/peliculas/:movieId/editar', component: MovieForm },
];
