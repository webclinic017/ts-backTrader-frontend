import {EChartsOption} from "echarts";
import {buyColor} from "../chart-data/chart-colors";

export const initOptions: EChartsOption = {
  animation: false,
  title: {
    text: '创业板',
    left: '50%'
  },
  tooltip: {
    trigger: 'item',
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    data: [],
    boundaryGap: false,
    axisLine: {onZero: false},
    splitLine: {show: false},
    min: 'dataMin',
    max: 'dataMax'
  },
  yAxis: {
    position: 'right',
    min: 'dataMin',
    max: 'dataMax',
    animationDelay: 1000,
  },
  dataZoom: [
    {
      type: 'inside',
      start: 50,
      end: 100,
    },
  ],
  series: [
    {
      name: '日K',
      type: 'candlestick',
      selectedMode: 'single',
      data: [],
      tooltip: {
        show: true,
        formatter: function (param) {
          const Height = param.data[4];
          const Low = param.data[3];
          const maxRang = ((Height - Low) / Height) * 100;
          // const
          return `振幅:${maxRang.toFixed(2)}%`;
        },
        position: function (pos, params, el, elRect, size) {
          const obj = {top: 10};
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        }
      },
      markPoint: {
        label: {
          formatter: (param: any) => param !== null ? param.value + '' : ''
        },
        data: [],
        tooltip: {
          formatter(param) {
            const text = param.color === buyColor ? 'b' : 's';
            return param.name + '<br>' + `${text}: ` + '<b>' + (param?.data?.coord?.at(1) || '') + '</b>';
          }
        }
      },
      markLine: {
        symbol: ['none', 'none'],
        precision: 3,
        lineStyle: {
          type: 'solid',
          width: 2
        },
        data: [],
        label: {
          show: false,
        },
        tooltip: {
          formatter(param) {
            // console.log(param);
            return `收益率: <b>${(param?.data?.value * 100).toFixed(2)}%</b>`;
          }
        },
      }
    },
  ]
};
