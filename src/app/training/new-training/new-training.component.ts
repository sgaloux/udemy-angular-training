import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercice } from '../exercice.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output()
  exercices: Exercice[];
  exercicesSubscription: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exercicesSubscription = this.trainingService.exercicesChanged.subscribe(
      ex => {
        this.exercices = ex;
      }
    );
    this.trainingService.fetchAvailableExercices();
  }

  ngOnDestroy() {
    this.exercicesSubscription.unsubscribe();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercice(form.value.exercice);
  }
}
