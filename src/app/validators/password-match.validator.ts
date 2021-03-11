import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export function checkPasswords(hi): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    console.log(control);
    console.log(hi);

    return { something: true };
  };
}
