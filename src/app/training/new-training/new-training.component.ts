import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercice } from '../exercice.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription, Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output()
  exercices: Exercice[];
  isLoading$: Observable<boolean>;

  private exercicesSubscription: Subscription;
  private loadingSubs: Subscription;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.ApplicationState>
  ) {}

  fetchExercices() {
    this.trainingService.fetchAvailableExercices();
  }
  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercicesSubscription = this.trainingService.exercicesChanged.subscribe(
      ex => {
        this.exercices = ex;
      }
    );
    this.fetchExercices();
  }

  ngOnDestroy() {
    if (this.exercicesSubscription) {
      this.exercicesSubscription.unsubscribe();
    }
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercice(form.value.exercice);
  }
}
