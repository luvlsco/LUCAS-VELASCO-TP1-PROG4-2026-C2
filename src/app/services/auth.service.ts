import { Injectable, effect, signal } from '@angular/core';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase.client';

export interface ProfileDraft {
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  bloodType: string;
  eyeColor: string;
  vacationDays: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly session = signal<Session | null>(null);
  readonly role = signal<string | null>(null);
  private resolveInitialized!: () => void;
  readonly initialized = new Promise<void>((resolve) => {
    this.resolveInitialized = resolve;
  });
  private receivedAuthEvent = false;

  constructor() {
    supabase.auth.onAuthStateChange((_event, session) => {
      this.receivedAuthEvent = true;
      this.session.set(session);
      this.resolveInitialized();
    });
    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!this.receivedAuthEvent && !error) this.session.set(data.session);
        this.resolveInitialized();
      })
      .catch(() => this.resolveInitialized());

    effect(() => {
      const userId = this.session()?.user.id;
      if (!userId) {
        this.role.set(null);
        return;
      }
      void supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
        .then(({ data }) => this.role.set(data?.role ?? 'cliente'));
    });
  }

  async signUp(email: string, password: string, profile: Omit<ProfileDraft, 'email'>): Promise<string | null> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        first_name: profile.firstName,
        last_name: profile.lastName,
        birthdate: profile.birthdate || null,
        blood_type: profile.bloodType,
        eye_color: profile.eyeColor,
        vacation_days: profile.vacationDays,
      });
      if (profileError) return profileError.message;
    }
    return null;
  }

  async signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }

  oAuth(provider: 'google' | 'github'): Promise<string | null> {
    return supabase.auth
      .signInWithOAuth({ provider, options: { redirectTo: window.location.origin } })
      .then(({ error }) => (error ? error.message : null));
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }
}
