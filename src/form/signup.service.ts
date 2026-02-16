import { Injectable } from '@angular/core';

export interface SignupModel {
	username: string;
	email: string;
}

export type SignupResult =
  | { status: 'ok' }
  | {
      status: 'error';
      fieldErrors: Partial<Record<keyof SignupModel, string>>;
    };

@Injectable({ providedIn: 'root' })
export class SignupService {
  async signup(value: SignupModel): Promise<SignupResult> {
    await new Promise((r) => setTimeout(r, 700));
  
    const fieldErrors: Partial<Record<keyof SignupModel, string>> = {};
  
    // Username rules
    if (value.username.trim().toLowerCase() === 'brian') {
      fieldErrors.username = 'That username is already taken.';
    }
  
    // Email rules
    if (value.email.trim().toLowerCase() === 'brian@test.com') {
      fieldErrors.email = 'That email is already taken.';
    }
  
    if (Object.keys(fieldErrors).length > 0) {
      return { status: 'error', fieldErrors };
    }
  
    return { status: 'ok' };
  }  
}
