import { Routes } from '@angular/router';
import { MovieAdmin } from './admin/movie-admin/movie-admin';
import { MovieForm } from './admin/movie-form/movie-form';
import { Home } from './catalog/home/home';
import { ComingSoon } from './catalog/coming-soon/coming-soon';
import { MovieDetail } from './catalog/movie-detail/movie-detail';
import { MovieList } from './catalog/movie-list/movie-list';
import { MyMovies } from './catalog/my-movies/my-movies';
import { ScreeningAdmin } from './booking/screening-admin/screening-admin';
import { ScreeningForm } from './booking/screening-form/screening-form';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'peliculas', component: MovieList },
  { path: 'peliculas/:movieId', component: MovieDetail },
  { path: 'proximamente', component: ComingSoon },
  { path: 'mis-peliculas', component: MyMovies },
  { path: 'admin/funciones', component: ScreeningAdmin },
  { path: 'admin/funciones/nueva', component: ScreeningForm },
  { path: 'admin/funciones/:screeningId/editar', component: ScreeningForm },
  { path: 'admin/peliculas', component: MovieAdmin },
  { path: 'admin/peliculas/nueva', component: MovieForm },
  { path: 'admin/peliculas/:movieId/editar', component: MovieForm },
];
