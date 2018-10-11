import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

export interface ApplicationState {
  ui: fromUi.State;
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<ApplicationState> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuthenticated = createSelector(
  getAuthState,
  fromAuth.getIsAuth
);
