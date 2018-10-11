import * as fromUi from './shared/ui.reducer';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

export interface ApplicationState {
  ui: fromUi.State;
}

export const reducers: ActionReducerMap<ApplicationState> = {
  ui: fromUi.uiReducer
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);
