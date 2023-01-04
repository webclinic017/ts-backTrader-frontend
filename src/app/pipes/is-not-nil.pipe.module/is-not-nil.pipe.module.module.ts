import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IsNotNilPipePipe} from './is-not-nil.pipe.pipe';


@NgModule({
  declarations: [
    IsNotNilPipePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IsNotNilPipePipe
  ]
})
export class IsNotNilPipeModuleModule {
}
