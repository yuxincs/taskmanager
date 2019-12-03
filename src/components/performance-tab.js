import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from "antd";
import ReactEcharts from "echarts-for-react";
import styles from './performance-tab.module.css';


export default class PerformanceTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    cpuLoadHistory: PropTypes.arrayOf(PropTypes.number),
    memLoadHistory: PropTypes.arrayOf(PropTypes.number)
  };

  static defaultProps = {
    cpuLoadHistory: Array.from({length: 60}, () => 0),
    memLoadHistory: Array.from({length: 60}, () => 0)
  };

  constructor(props) {
    super(props);
    this.chartNum = 0;
  }

  generateOneLineText(left, right, leftClassName=styles['chart-text'], rightClassName=styles['chart-text']) {
    let leftName = leftClassName + ' ' + styles['align-left'];
    let rightName = rightClassName + ' ' + styles['align-right'];
    return <div><span className={leftName}>{left}<span className={rightName}>{right}</span></span></div>;
  }

  generateTab(chart, title, subtitle) {
    return <div className={styles['tab']}>
      <div className={styles['tab-chart']}>{chart}</div>
      <div className={styles['tab-text']}>
        <span className={styles.title}>{title}</span><br />
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </div>
  }

  generateChart(data, rgb, cornerTexts, showExtras, height) {
    // colors for border/line, area, grid
    let colors = [1, 0.4, 0.1].map((alpha) => 'rgba(' + rgb.join(', ') + ', ' + alpha + ')');
    let xdata = Array.from(Array(data.length).keys());
    let option =  {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xdata,
        splitLine: {
          show: showExtras,
          lineStyle: { color: colors[2] }
        },
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: showExtras,
          lineStyle: { color: colors[2] },
        },
        max: 100,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false }
      },
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      series: [{
        data: data,
        type: 'line',
        areaStyle: {
          color: colors[1]
        },
        lineStyle: {
          color: colors[0],
          width: 1
        },
        showSymbol: false,
        hoverAnimation: false,
        animation: false
      }]
    };

    let topLine = showExtras ? this.generateOneLineText(cornerTexts[0], cornerTexts[1]) : null;
    let bottomLine = showExtras ? this.generateOneLineText(cornerTexts[3], cornerTexts[2]) : null;

    this.chartNum ++;
    return <div>
      {topLine}
      <div style={{border: '1px solid ' + colors[0]}}>
        <ReactEcharts
          style={{height: height}}
          ref={'echarts_react' + this.chartNum}
          key={this.chartNum}
          option={option}
        />
      </div>
      {bottomLine}
    </div>
  }

  render() {
    let [charts, smallCharts] = [[true, '250px'], [false, '45px']].map((extraArgs) => {
      return [
        this.generateChart(
          this.props.cpuLoadHistory,
          [17, 125, 187],
          ['% Utilization', '100 %', '0', '60 Seconds'], ...extraArgs),
        this.generateChart(
          this.props.memLoadHistory,
          [139, 18, 174],
          ['Memory Usage', 'X GB', '0', '60 Seconds'], ...extraArgs)
      ];
    });

    return <Tabs
      className={styles['performance-tab']}
      defaultActiveKey="1"
      tabPosition="left"
      size="large"
      tabBarStyle={{width: '30%', height: '100vh'}}
    >
      <Tabs.TabPane
        className={styles['pane']}
        tab={this.generateTab(smallCharts[0],
          'CPU', this.props.cpuLoadHistory[this.props.cpuLoadHistory.length - 1].toFixed(0) + '%')}
        key="1">
        {this.generateOneLineText('CPU', 'TODO', styles['big-title'], styles['big-title'])}
        <div className={styles['chart']} >
          {charts[0]}
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane
        className={styles['pane']}
        tab={this.generateTab(smallCharts[1],
          'Memory', this.props.memLoadHistory[this.props.memLoadHistory.length - 1].toFixed(0) + '%')
        }
        key="2">
        <div className={styles['chart']} >
          {charts[1]}
        </div>
      </Tabs.TabPane>
    </Tabs>
  }
}