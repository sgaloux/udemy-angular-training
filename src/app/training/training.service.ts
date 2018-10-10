import { Exercice } from './exercice.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  availableExercices: Exercice[] = [
    { id: 'crunches', name: 'Crunches', duration: 10, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 5, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 3, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 15, calories: 8 }
  ];

  exerciceChanged = new Subject<Exercice>();
  exercicesChanged = new Subject<Exercice[]>();

  private runningExercice: Exercice;
  private exercices: Exercice[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercices(): any {
    this.db
      .collection('availableExercices')
      .snapshotChanges()
      .pipe(
        map(docArray =>
          docArray.map(
            doc =>
              ({
                id: doc.payload.doc.id,
                ...doc.payload.doc.data()
              } as Exercice)
          )
        )
      )
      .subscribe((ex: Exercice[]) => {
        this.availableExercices = ex;
        this.exercicesChanged.next([...this.availableExercices]);
      });
    return this.availableExercices.slice();
  }

  startExercice(selectedId: string) {
    const selectedEx = this.availableExercices.find(ex => ex.id === selectedId);
    this.runningExercice = selectedEx;
    this.exerciceChanged.next({ ...this.runningExercice });
  }

  completeExercice() {
    this.exercices.push({
      ...this.runningExercice,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercice = null;
    this.exerciceChanged.next(null);
  }

  cancelExercice(progress: number) {
    this.exercices.push({
      ...this.runningExercice,
      duration: this.runningExercice.duration * (progress / 100),
      calories: this.runningExercice.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercice = null;
    this.exerciceChanged.next(null);
  }

  getRunningExercice() {
    return { ...this.runningExercice };
  }

  getCompletedExercices(): Exercice[] {
    return this.exercices.slice();
  }
}
