import { Component, OnInit, Output } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercice } from '../exercice.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  @Output()
  exercices: Observable<Exercice[]>;
  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.exercices = this.db
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
      );
    // this.exercices = this.trainingService.getAvailableExercices();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercice(form.value.exercice);
  }
}
