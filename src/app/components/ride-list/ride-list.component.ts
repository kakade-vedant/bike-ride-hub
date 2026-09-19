import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RideService } from '../../services/ride.service';
import { RideCardComponent } from '../ride-card/ride-card.component';
import { AddRideModalComponent } from '../add-ride-modal/add-ride-modal.component';

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RideCardComponent, AddRideModalComponent],
  templateUrl: './ride-list.component.html',
})
export class RideListComponent {
  private rideService = inject(RideService);

  searchQuery = signal<string>('');
  selectedDifficulty = signal<string>('All');
  sortByDistance = signal<'none' | 'asc' | 'desc'>('none');
  showAddModal = signal<boolean>(false);

  filteredRides = computed(() => {
    let list = this.rideService.allRides();
    const query = this.searchQuery().toLowerCase().trim();
    const difficulty = this.selectedDifficulty();
    const sort = this.sortByDistance();

    if (query) {
      list = list.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.stops.some(s => s.toLowerCase().includes(query)) ||
        r.notes.toLowerCase().includes(query)
      );
    }

    if (difficulty !== 'All') {
      list = list.filter(r => r.difficulty === difficulty);
    }

    if (sort === 'asc') {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sort === 'desc') {
      list = [...list].sort((a, b) => b.distanceKm - a.distanceKm);
    }

    return list;
  });

  downloadJson(): void {
    this.rideService.downloadExportJson();
  }
}