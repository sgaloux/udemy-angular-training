import { Exercice } from './exercice.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  availableExercices: Exercice[] = [];

  exerciceChanged = new Subject<Exercice>();
  exercicesChanged = new Subject<Exercice[]>();
  finishedExercicesChanged = new Subject<Exercice[]>();

  private runningExercice: Exercice;
  private exercices: Exercice[] = [];
  private finishedExercices: Exercice[] = [];

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
    this.addDataToDatabase({
      ...this.runningExercice,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercice = null;
    this.exerciceChanged.next(null);
  }

  cancelExercice(progress: number) {
    this.addDataToDatabase({
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

  fetchCompletedOrCancelledExercices() {
    this.db
      .collection('finishedExercices')
      .valueChanges()
      .subscribe((exercices: Exercice[]) => {
        this.finishedExercicesChanged.next(exercices);
      });
  }

  private addDataToDatabase(ex: Exercice) {
    this.db.collection('finishedExercices').add(ex);
  }
}
