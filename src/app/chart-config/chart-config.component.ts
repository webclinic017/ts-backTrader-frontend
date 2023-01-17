import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppStore} from '../store/app.store';

@Component({
  selector: 'chart-config',
  template: `
    <div class="chart-config" fxLayout="row" fxLayoutAlign="center center">
      <ng-container *ngIf="configs$|ngrxPush as configs">
        <!--交易记录线,-->
        <nz-form-item>
          <nz-form-label>
            <span>交易记录线</span>
          </nz-form-label>
          <nz-form-control>
            <nz-switch
              [ngModel]="configs.showTradeLog"
              (ngModelChange)="toggleTradeLogVisible($event)"
            ></nz-switch>
          </nz-form-control>
        </nz-form-item>
      </ng-container>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartConfigComponent implements OnInit {
  configs$ = this.appStore.configs$;

  constructor(private appStore: AppStore) {
  }

  ngOnInit(): void {
  }

  onConfigChange(configs: { [key: string]: any }) {
    this.appStore.modifyConfig(configs);
  }

  /*切换交易记录线*/
  toggleTradeLogVisible($event: boolean) {
    // this.onConfigChange({showTradeLog: $event});
    this.appStore.toggleTradeLogVisible($event);

  }
}
