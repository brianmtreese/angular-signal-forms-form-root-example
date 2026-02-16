import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, minLength, required, submit, ValidationError } from '@angular/forms/signals';
import { SignupModel, SignupService } from './signup.service';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormField],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
	protected readonly model = signal<SignupModel>({
		username: '',
		email: '',
	});

	protected readonly form = form(this.model, s => {
		required(s.username, { message: 'Please enter a username' });
		minLength(s.username, 3, 
			{ message: 'Your username must be at least 3 characters' });
		required(s.email, { message: 'Please enter an email address' });
	});

	private readonly signupService = inject(SignupService);

	protected onSubmit(event: Event) {
		event.preventDefault();

		submit(this.form, async f => {
			const value = f().value();
			const result = await this.signupService.signup(value);

			if (result.status === 'error') {
				const errors: ValidationError.WithOptionalFieldTree[] = [];

				if (result.fieldErrors.username) {
					errors.push({
						fieldTree: f.username,
						kind: 'server',
						message: result.fieldErrors.username,
					});
				}

				if (result.fieldErrors.email) {
					errors.push({
						fieldTree: f.email,
						kind: 'server',
						message: result.fieldErrors.email,
					});
				}

				return errors.length ? errors : undefined;
			}

			console.log('Submitted:', value);
			return undefined;
		});
	}
}
