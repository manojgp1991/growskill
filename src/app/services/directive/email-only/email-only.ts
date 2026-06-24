import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEmailOnly]',
})
export class EmailOnly {
  constructor() {}
   @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {

    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End'
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Allow a-z A-Z 0-9 @ . _ -
    if (!/^[a-zA-Z0-9@._-]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';

    if (!/^[a-zA-Z0-9@._-]+$/.test(text)) {
      event.preventDefault();
    }
  }
  
}
