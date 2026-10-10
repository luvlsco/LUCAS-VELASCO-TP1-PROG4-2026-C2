import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { supabase } from '../services/supabase.client';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.initialized;
  return auth.session() ? true : router.parseUrl('/login');
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.initialized;
  return auth.session() ? router.parseUrl('/') : true;
};

export const employeeGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.initialized;
  const userId = auth.session()?.user.id;
  if (!userId) return router.parseUrl('/login');
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
  return data?.role === 'admin' || data?.role === 'empleado' ? true : router.parseUrl('/');
};
