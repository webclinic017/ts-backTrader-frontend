import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {AppComponentStore} from "../store/app.store";
import {ECharts} from "echarts";
import {ECBasicOption} from 'echarts/types/dist/shared';

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
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandleChartComponent implements OnInit {
  initOptions$ = this.appStore.initOptions$;
  echartOptions$ = this.appStore.echartOptions$;
  private chartInstance: ECharts;
  private readonly horizontalMoveSize = 1 / 2; //水平方向移动尺寸
  private readonly verticalMoveSize = 4; //垂直方向移动尺寸

  constructor(private appStore: AppComponentStore) {

  }

  ngOnInit(): void {
  }

  onChartMouseOver($event: unknown) {
    console.log('onChartMouseOver', $event);
    // console.log($event);
  }

  /*
  * 监听键盘左键
  * */
  @HostListener('window:keyup.ArrowLeft', ['$event'])
  onArrowLeft() {
    console.log('onArrowLeft');
    this.moveChartLeft();
  }

  // 监听键盘右键
  @HostListener('window:keyup.ArrowRight', ['$event'])
  onArrowRight() {
    console.log('onArrowRight');
    this.moveChartRight()
  }

  // 监听键盘上键
  @HostListener('window:keyup.ArrowUp', ['$event'])
  onArrowUp() {
    console.log('onArrowUp');
    this.scaleChartLarge();
  }

  // 监听键盘下键
  @HostListener('window:keyup.ArrowDown', ['$event'])
  onArrowDown() {
    console.log('onArrowDown');
    this.scaleChartSmall()
  }

  onChartInit($event: ECharts) {
    this.chartInstance = $event;
    // 监听鼠标移入显示预测点
    this.registerMouseHover()
    //   监听鼠标移除,隐藏预测点
    this.registerMouseLeave()

  }

  private registerMouseHover() {
    this.chartInstance.on('mousemove', (params) => {
      if (params.componentType !== 'series') {
        return
      }
      console.log(this.registerMouseHover.name, params.name);

      /*
      * 将对应时间的预测点,显示出来
      * 1.获取options数据,
      * 2.获取hover数据时间,
      * 3. 在options -> series -> markLine -> data -> name中,找到对应的时间
      * 4. 将对应的markLine -> data -> lineStyle->width 设置1
      * 5, 更新options
      */
      const option: ECBasicOption = this.chartInstance.getOption();
      const candleTime = params.name;
      const indexes = option['series'][0]['markLine']['data'].reduce((pre, cur, index) => {
        if (cur.name === candleTime) {
          pre.push(index)
        }
        return pre;
      }, []);
      console.log(this.registerMouseHover.name, indexes);
      indexes.forEach(index => {
        if (index === -1!) {
          return
        }
        option['series'][0]['markLine']['data'][index]['lineStyle']['width'] = 2;
        this.chartInstance.setOption(option);
      })
    });
  }

  /**
   * 移动图表到左边
   * @private
   */
  private moveChartLeft() {
    const option = this.chartInstance.getOption();
    const start = option["dataZoom"][0].start;
    const end = option["dataZoom"][0].end;
    const distance = end - start;

    this.chartInstance.dispatchAction(
      {
        type: 'dataZoom',
        start: start - this.horizontalMoveSize > 0 ? start - this.horizontalMoveSize : 0,
        end: start - this.horizontalMoveSize > 0 ? end - this.horizontalMoveSize : distance,
      }
    )

  }

  private moveChartRight() {
    const option = this.chartInstance.getOption();
    const start = option["dataZoom"][0].start;
    const end = option["dataZoom"][0].end;
    const distance = end - start;

    this.chartInstance.dispatchAction(
      {
        type: 'dataZoom',
        start: end + this.horizontalMoveSize < 100 ? start + this.horizontalMoveSize : 100 - distance,
        end: end + this.horizontalMoveSize < 100 ? end + this.horizontalMoveSize : 100,
      }
    )
  }

  private scaleChartLarge() {
    const option = this.chartInstance.getOption();
    const startValue = option["dataZoom"][0].startValue;
    const endValue = option["dataZoom"][0].endValue;
    const scaleDistance = endValue - startValue;
    const distSize = (scaleDistance <= (this.verticalMoveSize * 2)) ? 1 : this.verticalMoveSize;
    const distStartValue = startValue + (scaleDistance > 0 ? distSize : 0);
    const distEndValue = (endValue - distSize) > distStartValue ? (endValue - distSize) : distStartValue;
    console.log(distStartValue, distEndValue);
    this.chartInstance.dispatchAction(
      {
        type: 'dataZoom',
        startValue: distStartValue,
        endValue: distEndValue,
      }
    )
  }

  private scaleChartSmall() {
    const option = this.chartInstance.getOption();
    const maxSize = option["series"][0].data.length;
    console.log(maxSize);
    const startValue = option["dataZoom"][0].startValue;
    const endValue = option["dataZoom"][0].endValue;
    const scaleDistance = endValue - startValue;
    const distSize = (scaleDistance <= (this.verticalMoveSize * 2)) ? 1 : this.verticalMoveSize;
    const distStartValue = startValue - distSize > 0 ? startValue - distSize : 0;
    const distEndValue = endValue + distSize > maxSize ? maxSize : endValue + distSize;
    console.log(distStartValue, distEndValue);
    this.chartInstance.dispatchAction(
      {
        type: 'dataZoom',
        startValue: distStartValue,
        endValue: distEndValue,
      }
    )
  }

  private registerMouseLeave() {
    this.chartInstance?.on('mouseout', params => {
      if (params.componentType !== 'series') {
        return
      }
      console.log(this.registerMouseLeave.name, params.name);
      const option: ECBasicOption = this.chartInstance.getOption();
      const candleTime = params.name;
      const indexes = option['series'][0]['markLine']['data'].reduce((pre, cur, index) => {
          if (cur.name === candleTime) {
            pre.push(index)
          }
          return pre;
        }
        , []);
      console.log('registerMouseLeave', indexes);
      indexes.forEach(index => {
        if (index === -1) {
          return
        }
        option['series'][0]['markLine']['data'][index]['lineStyle']['width'] = 0;
        this.chartInstance.setOption(option);
      })
    })
  }
}
