import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appConfirmEqualValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmEqualValidatorDirective,
      multi: true
    }
  ]
})
export class ConfirmEqualValidatorDirective implements Validator {
  @Input('appConfirmEqualValidator') controlNameToCompare!: string;

  validate(control: AbstractControl): ValidationErrors | null {
    const controlToCompare = control.parent?.get(this.controlNameToCompare);
    if (controlToCompare && controlToCompare.value !== control.value) {
      return { 'mismatch': true };
    }
    return null;
  }
}