import { Exercice } from './exercice.model';

export class TrainingService {
  availableExercices: Exercice[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  getAvailableExercices(): any {
    this.availableExercices.slice();
  }
}
