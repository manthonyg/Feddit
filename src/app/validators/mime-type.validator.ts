import { AbstractControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';

export function mimeType(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value === 'string') {
      return null;
    }

    const type = control?.value?.type;
    if (type) {
      switch (type) {
        case 'image/jpeg' || 'image/png':
          return null;
        default:
          return { invalidMimeType: true };
      }
    }
  };
}
