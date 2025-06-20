import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneNumber]',
})
export class PhoneNumberDirective implements OnChanges {
  @Input('appPhoneNumber') countryCode: string = '+1';

  private patterns: { [key: string]: RegExp } = {
    '+91': /^[6-9]\d{0,9}$/,     // India: starts with 6-9, 10 digits max
    '+1': /^[2-9]\d{0,9}$/,      // USA: starts with 2-9, 10 digits
    '+44': /^[1-9]\d{0,9}$/,     // UK: starts with 1-9, 10 digits (simplified)
  };

  private currentPattern: RegExp = /^\d{0,10}$/;

  constructor(private el: ElementRef, private control: NgControl) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countryCode']) {
      this.setPattern();
    }
  }

  private setPattern(): void {
    this.currentPattern = this.patterns[this.countryCode] || /^\d{0,10}$/;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    let value: string = this.el.nativeElement.value;

    // Remove non-numeric characters
    value = value.replace(/\D/g, '');

    // Enforce pattern
    if (!this.currentPattern.test(value)) {
      // Optionally trim to first 10 digits
      value = value.slice(0, 10);
      // Trim leading zeros or invalid start digits
      const firstChar = value.charAt(0);
      if (!this.currentPattern.test(firstChar)) {
        value = '';
      }
    }

    // Update input and form control
    this.el.nativeElement.value = value;
    this.control.control?.setValue(value);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^\d$/.test(event.key) && !allowed.includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(pasted)) {
      event.preventDefault();
    }
  }
}