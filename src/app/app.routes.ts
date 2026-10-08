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
import { SeatMap } from './booking/seat-map/seat-map';
import { Login } from './login/login/login';
import { Register } from './login/register/register';
import { authGuard, employeeGuard, guestGuard } from './guard/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'peliculas', component: MovieList },
  { path: 'peliculas/:movieId', component: MovieDetail },
  { path: 'proximamente', component: ComingSoon },
  { path: 'mis-peliculas', component: MyMovies },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'registro', component: Register, canActivate: [guestGuard] },
  { path: 'funciones/:screeningId', component: SeatMap },
  {
    path: 'empleado/validar',
    loadComponent: () => import('./validation/validate/validate').then((m) => m.Validate),
    canActivate: [employeeGuard],
  },
  { path: 'admin/funciones', component: ScreeningAdmin, canActivate: [authGuard] },
  { path: 'admin/funciones/nueva', component: ScreeningForm, canActivate: [authGuard] },
  { path: 'admin/funciones/:screeningId/editar', component: ScreeningForm, canActivate: [authGuard] },
  { path: 'admin/peliculas', component: MovieAdmin, canActivate: [authGuard] },
  { path: 'admin/peliculas/nueva', component: MovieForm, canActivate: [authGuard] },
  { path: 'admin/peliculas/:movieId/editar', component: MovieForm, canActivate: [authGuard] },
];
