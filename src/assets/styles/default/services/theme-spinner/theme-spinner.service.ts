import { Injectable } from '@angular/core';

@Injectable()
export class ThemeSpinner {

  private selector: string = 'preloader';
  private element: HTMLElement;

  constructor() {
    this.element = document.getElementById(this.selector);
  }

  public show(): void {
    this.element.style.display = 'block';
  }

  public hide(delay: number = 0): void {
    setTimeout(() => {
      this.element.style.display = 'none';
    }, delay);
  }

  public remove(delay: number = 0): void {
    setTimeout(() => {
      if (this.element) {
        this.element.remove();
      }
    }, delay);
  }
}
