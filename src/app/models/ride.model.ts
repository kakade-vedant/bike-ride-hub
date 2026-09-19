export interface Ride {
  id: string;
  title: string;
  distanceKm: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  googleMapUrl: string;
  stops: string[];
  notes: string;
}