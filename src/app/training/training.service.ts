import { Exercice } from './exercice.model';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, take } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';
import { StartLoading, StopLoading } from '../shared/ui.actions';
import {
  SetAvailableTrainings,
  SetFinishedTrainings,
  StopTraining,
  StartTraining
} from './training.actions';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromRoot.ApplicationState>
  ) {}

  fetchAvailableExercices() {
    this.store.dispatch(new StartLoading());
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
            this.store.dispatch(new SetAvailableTrainings(ex));
            this.store.dispatch(new StopLoading());
          },
          () => {
            this.store.dispatch(new StopLoading());
            this.uiService.showSnackbar(
              'Fetching exercices failed, please try again later',
              null,
              3000
            );
          }
        )
    );
  }

  startExercice(selectedId: string) {
    this.store.dispatch(new StartTraining(selectedId));
  }

  completeExercice() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new StopTraining());
      });
  }

  cancelExercice(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new StopTraining());
      });
  }

  fetchCompletedOrCancelledExercices() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercices')
        .valueChanges()
        .subscribe((exercices: Exercice[]) => {
          this.store.dispatch(new SetFinishedTrainings(exercices));
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
