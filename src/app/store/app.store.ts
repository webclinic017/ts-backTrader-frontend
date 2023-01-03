import {Injectable} from '@angular/core';
import {ComponentStore} from "@ngrx/component-store";

@Injectable()
export class AppComponentStore extends ComponentStore<any>{

  constructor() {
    super({});
  }
}
