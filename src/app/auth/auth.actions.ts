import { Action } from '@ngrx/store';

export const SET_AUTHENTICATED = '[AUTH] Set authenticated';
export const SET_UNAUTHENTICATED = '[UI] Set unauthenticated';

export class SetAuthenticated implements Action {
  readonly type = SET_AUTHENTICATED;
}

export class SetUnauthenticated implements Action {
  readonly type = SET_UNAUTHENTICATED;
}

export type AuthActions = SetAuthenticated | SetUnauthenticated;
