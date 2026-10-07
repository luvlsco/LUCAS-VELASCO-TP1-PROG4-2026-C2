import { Routes } from '@angular/router';
import { MovieAdmin } from './admin/movie-admin/movie-admin';
import { MovieForm } from './admin/movie-form/movie-form';
import { Home } from './catalog/home/home';
import { MovieList } from './catalog/movie-list/movie-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'peliculas', component: MovieList },
  { path: 'admin/peliculas', component: MovieAdmin },
  { path: 'admin/peliculas/nueva', component: MovieForm },
  { path: 'admin/peliculas/:movieId/editar', component: MovieForm },
];
