import {AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
export function passwordMatch(password: string, confirmPassword: string):ValidatorFn {
    return (formGroup: AbstractControl<any, any>):{ [key: string]: any } | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);
      
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true }
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }