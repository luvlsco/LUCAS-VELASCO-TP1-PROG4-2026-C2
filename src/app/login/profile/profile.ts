import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { supabase } from '../../services/supabase.client';
import { AuthService } from '../../services/auth.service';

interface ProfileData {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
})
export class Profile {
  protected readonly auth = inject(AuthService);
  protected profile = signal<ProfileData | null>(null);

  constructor() {
    const userId = this.auth.session()?.user.id;
    if (!userId) return;
    void supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', userId)
      .single()
      .then(({ data }) => this.profile.set((data as ProfileData) ?? null));
  }
}
