import { Exercice } from './exercice.model';
import * as fromRoot from '../app.reducer';
import {
  TrainingActions,
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING
} from './training.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  availableExercices: Exercice[];
  finishedExercices: Exercice[];
  activeTraining: Exercice;
}

export interface State extends fromRoot.ApplicationState {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercices: [],
  finishedExercices: [],
  activeTraining: null
};

export function trainingReducer(
  state: TrainingState = initialState,
  action: TrainingActions
) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercices: action.payload
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercices: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: {
          ...state.availableExercices.find(ex => ex.id === action.payload)
        }
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null
      };
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>(
  'training'
);

export const getAvailableExercices = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercices
);

export const getFinishedExercices = createSelector(
  getTrainingState,
  (state: TrainingState) => state.finishedExercices
);

export const getActiveTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining
);

export const getIsTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining !== null
);
