import { Exercice } from './exercice.model';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  availableExercices: Exercice[] = [];

  exerciceChanged = new Subject<Exercice>();
  exercicesChanged = new Subject<Exercice[]>();
  finishedExercicesChanged = new Subject<Exercice[]>();

  private runningExercice: Exercice;
  private exercices: Exercice[] = [];
  private finishedExercices: Exercice[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {}

  fetchAvailableExercices(): any {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(
      this.db
        .collection('availableExercices')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(
              doc =>
                ({
                  id: doc.payload.doc.id,
                  ...doc.payload.doc.data()
                } as Exercice)
            );
          })
        )
        .subscribe(
          (ex: Exercice[]) => {
            this.availableExercices = ex;
            this.exercicesChanged.next([...this.availableExercices]);
            this.uiService.loadingStateChanged.next(false);
          },
          error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              'Fetching exercices failed, please try again later',
              null,
              3000
            );
            this.exerciceChanged.next(null);
          }
        )
    );
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
    this.fbSubs.push(
      this.db
        .collection('finishedExercices')
        .valueChanges()
        .subscribe((exercices: Exercice[]) => {
          this.finishedExercicesChanged.next(exercices);
        })
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((s: Subscription) => s.unsubscribe());
    this.fbSubs = [];
  }

  private addDataToDatabase(ex: Exercice) {
    this.db.collection('finishedExercices').add(ex);
  }
}
