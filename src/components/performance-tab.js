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

  generateOneLineText(left, right, leftClassName=styles['chart-text'], rightClassName=styles['chart-text']) {
    let leftName = leftClassName + ' ' + styles['align-left'];
    let rightName = rightClassName + ' ' + styles['align-right'];
    return <div><span className={leftName}>{left}<span className={rightName}>{right}</span></span></div>;
  }

  generateChart(key, data, rgb, cornerTexts, showGrid=true) {
    // colors for border/line, area, grid
    let colors = [1, 0.4, 0.1].map((alpha) => 'rgba(' + rgb.join(', ') + ', ' + alpha + ')');
    let xdata = Array.from(Array(data.length).keys());
    let option =  {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xdata,
        splitLine: {
          show: showGrid,
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
          show: showGrid,
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
    return <div className={styles.chart}>
      {this.generateOneLineText(cornerTexts[0], cornerTexts[1])}
      <div style={{border: '1px solid ' + colors[0]}}>
        <ReactEcharts
          ref={'echarts_react' + key}
          key={key}
          option={option}
        />
      </div>
      {this.generateOneLineText(cornerTexts[3], cornerTexts[2])}
    </div>
  }

  render() {
    return <Tabs
      className={styles['performance-tab']}
      defaultActiveKey="1"
      tabPosition="left"
      size="large"
      tabBarStyle={{width: '30%'}}
    >
      <Tabs.TabPane
        tab={
          <div>
            <span className={styles.title}>CPU</span><br />
            <span className={styles.subtitle}>{parseInt(this.props.cpuLoadHistory[this.props.cpuLoadHistory.length - 1]) + '%'}</span>
          </div>
        }
        key="1">
        {
          this.generateChart('1', this.props.cpuLoadHistory, [17, 125, 187],
          ['% Utilization', '100 %', '0', '60 Seconds'])
        }
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <div>
            <span className={styles.title}>Memory</span><br />
            <span className={styles.subtitle}>{parseInt(this.props.memLoadHistory[this.props.memLoadHistory.length - 1]) + '%'}</span>
          </div>
        }
        key="2">
        {
          this.generateChart('2', this.props.memLoadHistory, [139, 18, 174],
            ['Memory Usage', 'X GB', '0', '60 Seconds'])
        }
      </Tabs.TabPane>
    </Tabs>
  }
}