import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, minLength, required, submit, ValidationError } from '@angular/forms/signals';
// import { FormField, FormRoot, form, minLength, required, ValidationError } from '@angular/forms/signals';
import { SignupModel, SignupService } from './signup.service';

const INITIAL_VALUES: SignupModel = {
	username: '',
	email: '',
};

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormField],
//   imports: [CommonModule, FormField, FormRoot],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
	protected readonly model = signal<SignupModel>(INITIAL_VALUES);

	// protected readonly form = form(
	// 	this.model, 
	// 	s => {
	// 		required(s.username, { message: 'Please enter a username' });
	// 		minLength(s.username, 3, 
	// 			{ message: 'Your username must be at least 3 characters' });
	// 		required(s.email, { message: 'Please enter an email address' });
	// 	},
	// 	{
	// 		submission: {
	// 			action: async f => {
	// 				const value = f().value();
	// 				const result = await this.signupService.signup(value);

	// 				if (result.status === 'error') {
	// 					const errors: ValidationError.WithOptionalFieldTree[] = [];

	// 					if (result.fieldErrors.username) {
	// 						errors.push({
	// 							fieldTree: f.username,
	// 							kind: 'server',
	// 							message: result.fieldErrors.username,
	// 						});
	// 					}

	// 					if (result.fieldErrors.email) {
	// 						errors.push({
	// 							fieldTree: f.email,
	// 							kind: 'server',
	// 							message: result.fieldErrors.email,
	// 						});
	// 					}

	// 					return errors.length ? errors : undefined;
	// 				}

	// 				console.log('Form Dirty:', this.form().dirty());
	// 				console.log('Form Value:', this.form().value());
	// 				console.log('Form Model:', this.model());
					
	// 				this.form().reset();
	// 				// f().reset(INITIAL_VALUES);
					
	// 				console.log('Form Dirty:', this.form().dirty());
	// 				console.log('Form Value:', this.form().value());
	// 				console.log('Form Model:', this.model());

	// 				return undefined;
	// 			},
	// 		},
	// 	},
	// );

	protected readonly form = form(
		this.model, 
		s => {
			required(s.username, { message: 'Please enter a username' });
			minLength(s.username, 3, 
				{ message: 'Your username must be at least 3 characters' });
			required(s.email, { message: 'Please enter an email address' });
		}
	);

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

			console.log('Form Dirty:', this.form().dirty());
			console.log('Form Value:', this.form().value());
			console.log('Form Model:', this.model());
			return undefined;
		});
	}
}
