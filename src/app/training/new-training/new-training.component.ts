import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercice } from '../exercice.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  @Output()
  trainingStart = new EventEmitter<void>();
  exercices: Exercice[] = [];
  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exercices = this.trainingService.getAvailableExercices();
  }

  onStartTraining() {
    this.trainingStart.emit();
  }
}
