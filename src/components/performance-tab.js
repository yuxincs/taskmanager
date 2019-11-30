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

  render() {
    let option1 = {
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
        }
      },
      series: [{
        data: this.props.cpuLoadHistory,
        type: 'line',
        areaStyle: {},
        showSymbol: false,
        hoverAnimation: false,
        animation: false
      }]
    };
    let option2 = {
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
        }
      },
      series: [{
        data: this.props.memLoadHistory,
        type: 'line',
        areaStyle: {},
        showSymbol: false,
        hoverAnimation: false,
        animation: false
      }]
    };
    let cpuChart = <ReactEcharts className="chart" ref='echarts_react' option={option1} key="1" />;
    let memoryChart = <ReactEcharts className="chart" ref='echarts_react' option={option2} key="2"/>;
    return <Tabs
      className="performance-tab"
      defaultActiveKey="1"
      tabPosition="left"
      size="large"
    >
      <Tabs.TabPane tab="CPU" key="1"> {cpuChart} </Tabs.TabPane>
      <Tabs.TabPane tab="Memory" key="2"> {memoryChart} </Tabs.TabPane>
    </Tabs>
  }
}