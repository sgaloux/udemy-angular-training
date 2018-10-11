import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class UIService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(message, action, duration) {
    this.snackBar.open(message, action, { duration });
  }
}
