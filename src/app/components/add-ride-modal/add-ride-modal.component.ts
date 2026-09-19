import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RideService } from '../../services/ride.service';

@Component({
  selector: 'app-add-ride-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-ride-modal.component.html',
})
export class AddRideModalComponent {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private rideService = inject(RideService);

  copyStatus = signal<string>('Copy Updated JSON');

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    distanceKm: [null, [Validators.required, Validators.min(1)]],
    difficulty: ['Moderate', [Validators.required]],
    googleMapUrl: ['', [Validators.required]],
    stopsInput: ['', [Validators.required]],
    notes: ['', [Validators.required]]
  });

  onUrlInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    // URL parsing logic for google.com/maps/dir/Stop1/Stop2/...
    if (input.includes('/maps/dir/')) {
      try {
        const parts = input.split('/maps/dir/')[1].split('/');
        const extractedStops = parts
          .filter(p => p.trim() !== '' && !p.startsWith('@') && !p.startsWith('data='))
          .map(p => decodeURIComponent(p.replace(/\+/g, ' ')));

        if (extractedStops.length > 0 && !this.form.get('stopsInput')?.value) {
          this.form.patchValue({ stopsInput: extractedStops.join(', ') });
        }
      } catch (e) {
        console.warn('URL parsing skipped', e);
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const rawStops = this.form.value.stopsInput
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    this.rideService.addRide({
      title: this.form.value.title,
      distanceKm: Number(this.form.value.distanceKm),
      difficulty: this.form.value.difficulty,
      googleMapUrl: this.form.value.googleMapUrl,
      stops: rawStops,
      notes: this.form.value.notes
    });

    this.close.emit();
  }

  copyJsonPayload(): void {
    const payload = this.rideService.getExportJsonPayload();
    navigator.clipboard.writeText(payload).then(() => {
      this.copyStatus.set('Copied!');
      setTimeout(() => this.copyStatus.set('Copy Updated JSON'), 2500);
    });
  }

  downloadJson(): void {
    this.rideService.downloadExportJson();
  }
}