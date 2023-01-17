import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {AppStore} from '../store/app.store';
import {ECharts} from 'echarts';

@Component({
  selector: 'candle-chart',
  template: `
    <div
      [merge]="echartOptions$|ngrxPush"
      [options]="initOptions$|ngrxPush"
      class="demo-chart"
      theme="dark"
      echarts
      fxFill
      (chartInit)="onChartInit($event)"
    ></div>
  `,
  styles: [
    `
      host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandleChartComponent implements OnInit {
  initOptions$ = this.appStore.initOptions$;
  echartOptions$ = this.appStore.echartOptions$;

  constructor(private appStore: AppStore) {
  }

  ngOnInit(): void {
  }


  /*
  * 监听键盘左键
  * */
  @HostListener('window:keyup.ArrowLeft', ['$event'])
  onArrowLeft() {
    console.log('onArrowLeft');
    this.appStore.moveChartLeft();
  }

  // 监听键盘右键
  @HostListener('window:keyup.ArrowRight', ['$event'])
  onArrowRight() {
    console.log('onArrowRight');
    this.appStore.moveChartRight();
  }

  // 监听键盘上键
  @HostListener('window:keyup.ArrowUp', ['$event'])
  onArrowUp() {
    console.log('onArrowUp');
    this.appStore.scaleChartLarge();
  }

  // 监听键盘下键
  @HostListener('window:keyup.ArrowDown', ['$event'])
  onArrowDown() {
    console.log('onArrowDown');
    this.appStore.scaleChartSmall();
  }

  onChartInit($event: ECharts) {
    this.appStore.initChart($event);
  }


}
