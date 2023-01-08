import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from "lodash-es";

@Pipe({
  name: 'isNotNilPipe'
})
export class IsNotNilPipePipe implements PipeTransform {

  transform(value: any): any {
    if (isNil(value)) {
      throw new Error('isNotNilPipePipe: value is nil');
    }
    return value!;
  }

}
