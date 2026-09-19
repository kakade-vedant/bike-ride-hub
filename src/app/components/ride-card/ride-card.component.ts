import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ride } from '../../models/ride.model';

@Component({
  selector: 'app-ride-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-card.component.html',
})
export class RideCardComponent {
  @Input({ required: true }) ride!: Ride;
}