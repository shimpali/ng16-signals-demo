import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { SignalsComponent } from './signals/signals.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [SignalsComponent],
  template: `<app-signals/>`,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
