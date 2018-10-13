import { Action } from '@ngrx/store';
import { Exercice } from './exercice.model';

export const SET_AVAILABLE_TRAININGS = '[Training] Set available trainings';
export const SET_FINISHED_TRAININGS = '[Training] Set finished trainings';
export const START_TRAINING = '[Training] Start training';
export const STOP_TRAINING = '[Training] Stop training';

export class SetAvailableTrainings implements Action {
  readonly type = SET_AVAILABLE_TRAININGS;
  constructor(public payload: Exercice[]) {}
}

export class SetFinishedTrainings implements Action {
  readonly type = SET_FINISHED_TRAININGS;
  constructor(public payload: Exercice[]) {}
}

export class StartTraining implements Action {
  readonly type = START_TRAINING;
  constructor(public payload: string) {}
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;
}

export type TrainingActions =
  | SetAvailableTrainings
  | SetFinishedTrainings
  | StartTraining
  | StopTraining;
