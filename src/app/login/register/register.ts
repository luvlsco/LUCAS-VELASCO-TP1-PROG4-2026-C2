import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, FormRoot, form, min, minLength, required } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected draft = signal({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthdate: '',
    bloodType: '',
    eyeColor: '',
    vacationDays: 14,
  });
  protected saving = signal(false);
  protected submitError = signal<string | null>(null);

  protected registerForm = form(this.draft, (f) => {
    required(f.email, { message: 'El mail es obligatorio' });
    required(f.password, { message: 'La contraseña es obligatoria' });
    minLength(f.password, 6, { message: 'Mínimo 6 caracteres' });
    required(f.firstName, { message: 'El nombre es obligatorio' });
    required(f.lastName, { message: 'El apellido es obligatorio' });
    required(f.birthdate, { message: 'La fecha de nacimiento es obligatoria' });
    required(f.bloodType, { message: 'El tipo de sangre es obligatorio' });
    required(f.eyeColor, { message: 'El color de ojos es obligatorio' });
    min(f.vacationDays, 0, { message: 'Mínimo 0' });
  });

  protected async save(): Promise<void> {
    if (!this.registerForm().valid()) {
      this.submitError.set('Revisá los campos marcados.');
      return;
    }
    this.saving.set(true);
    const d = this.draft();
    const message = await this.auth.signUp(d.email, d.password, {
      firstName: d.firstName,
      lastName: d.lastName,
      birthdate: d.birthdate,
      bloodType: d.bloodType,
      eyeColor: d.eyeColor,
      vacationDays: d.vacationDays,
    });
    this.saving.set(false);
    if (message) this.submitError.set(message);
    else await this.router.navigate(['/']);
  }
}
