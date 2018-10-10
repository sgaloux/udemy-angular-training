import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercice } from '../exercice.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output()
  exercices: Exercice[];
  isLoading = false;

  private exercicesSubscription: Subscription;
  private loadingSubs: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  fetchExercices() {
    this.trainingService.fetchAvailableExercices();
  }
  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(loading => {
      this.isLoading = loading;
    });
    this.exercicesSubscription = this.trainingService.exercicesChanged.subscribe(
      ex => {
        this.exercices = ex;
      }
    );
    this.fetchExercices();
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
    if (this.exercicesSubscription) { this.exercicesSubscription.unsubscribe(); }
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercice(form.value.exercice);
  }
}
