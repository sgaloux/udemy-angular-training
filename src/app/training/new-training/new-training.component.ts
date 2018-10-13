import { Component, OnInit, Output } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercice } from '../exercice.model';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  @Output()
  exercices$: Observable<Exercice[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  fetchExercices() {
    this.trainingService.fetchAvailableExercices();
  }
  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercices$ = this.store.select(fromTraining.getAvailableExercices);
    this.fetchExercices();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercice(form.value.exercice);
  }
}
