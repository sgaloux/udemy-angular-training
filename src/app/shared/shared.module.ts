import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [CommonModule, MaterialModule, FlexLayoutModule, FormsModule],
  exports: [CommonModule, MaterialModule, FlexLayoutModule, FormsModule]
})
export class SharedModule {}
