import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from "antd";
import ReactEcharts from "echarts-for-react";
import './performance-tab.css';


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

  generateChart(key, data, color, cornerTexts) {
    let option =  {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: false
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        },
        max: 100,
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series: [{
        data: data,
        type: 'line',
        areaStyle: {},
        showSymbol: false,
        hoverAnimation: false,
        animation: false
      }]
    };
    return <ReactEcharts
      className="chart"
      ref="echarts_react"
      key={key}
      option={option}
    />
  }

  render() {
    return <Tabs
      className="performance-tab"
      defaultActiveKey="1"
      tabPosition="left"
      size="large"
      tabBarStyle={{width: '30%'}}
    >
      <Tabs.TabPane
        tab={
          <div>
            <span className="title">CPU</span><br />
            <span className="subtitle">{parseInt(this.props.cpuLoadHistory[this.props.cpuLoadHistory.length - 1]) + '%'}</span>
          </div>
        }
        key="1">
        {
          this.generateChart('1', this.props.cpuLoadHistory, null,
          ['% Utilization', '100 %', '0', '60 Seconds'])
        }
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <div>
            <span className="title">Memory</span><br />
            <span className="subtitle">{parseInt(this.props.memLoadHistory[this.props.memLoadHistory.length - 1]) + '%'}</span>
          </div>
        }
        key="2">
        {
          this.generateChart('2', this.props.memLoadHistory, null,
            ['Memory Usage', 'X GB', '0', '60 Seconds'])
        }
      </Tabs.TabPane>
    </Tabs>
  }
}