import { Component } from '@angular/core';
import { RideListComponent } from './components/ride-list/ride-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RideListComponent],
  template: `<app-ride-list />`
})
export class AppComponent {}