import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ride } from '../models/ride.model';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'bikeridehub_user_rides';

  private baseRides = signal<Ride[]>([]);
  private customRides = signal<Ride[]>([]);

  // Unified reactive state
  readonly allRides = computed(() => [...this.baseRides(), ...this.customRides()]);

  constructor() {
    this.loadCustomRides();
    this.fetchBaseRides();
  }

  private fetchBaseRides(): void {
    this.http.get<Ride[]>('/assets/data/rides.json')
      .pipe(
        tap(rides => this.baseRides.set(rides)),
        catchError(err => {
          console.error('Failed to load base rides.json', err);
          return of([]);
        })
      )
      .subscribe();
  }

  private loadCustomRides(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.customRides.set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
  }

  addRide(ride: Omit<Ride, 'id'>): void {
    const newRide: Ride = {
      ...ride,
      id: `ride-${Date.now()}`
    };

    const updated = [newRide, ...this.customRides()];
    this.customRides.set(updated);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  getExportJsonPayload(): string {
    return JSON.stringify(this.allRides(), null, 2);
  }

  downloadExportJson(): void {
    const blob = new Blob([this.getExportJsonPayload()], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'rides.json';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}