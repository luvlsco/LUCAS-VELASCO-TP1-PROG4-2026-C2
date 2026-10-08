import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, FormRoot, form, minLength, required } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected draft = signal({ email: '', password: '' });
  protected saving = signal(false);
  protected submitError = signal<string | null>(null);

  protected loginForm = form(this.draft, (f) => {
    required(f.email, { message: 'El mail es obligatorio' });
    required(f.password, { message: 'La contraseña es obligatoria' });
    minLength(f.password, 6, { message: 'Mínimo 6 caracteres' });
  });

  protected async save(): Promise<void> {
    if (!this.loginForm().valid()) {
      this.submitError.set('Revisá los campos marcados.');
      return;
    }
    this.saving.set(true);
    const message = await this.auth.signIn(this.draft().email, this.draft().password);
    this.saving.set(false);
    if (message) this.submitError.set(message);
    else await this.router.navigate(['/']);
  }

  protected async oauth(provider: 'google' | 'github'): Promise<void> {
    const message = await this.auth.oAuth(provider);
    if (message) this.submitError.set(message);
  }
}
