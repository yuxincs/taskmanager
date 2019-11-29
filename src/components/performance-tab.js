import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from "antd";
import ReactEcharts from "echarts-for-react";

function copy(o) {
  let output, v, key;
  output = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    output[key] = (typeof v === "object") ? copy(v) : v;
  }
  return output;
}

export default class PerformanceTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    cpuLoad: PropTypes.number,
    memLoad: PropTypes.number
  };

  static defaultProps = {
    cpuLoad: 0,
    memLoad: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      option: {
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
          data: Array.from({length: 60}, () => Math.floor(Math.random() * 100)),
          type: 'line',
          areaStyle: {},
          showSymbol: false,
          hoverAnimation: false,
          animation: false
        }]
      }
    };
  }

  componentDidMount() {
    setInterval(() => {
      var option = copy(this.state.option);
      option.series[0].data.shift();
      option.series[0].data.push(Math.floor(Math.random() * 100));
      this.setState({
        option: option
      });
    }, 1000);
  }

  render() {
    let cpuChart = <ReactEcharts ref='echarts_react' option={this.state.option} />;
    let memoryChart = <ReactEcharts ref='echarts_react' option={this.state.option} />;
    return <Tabs defaultActiveKey="1" tabPosition="left" size="large">
      <Tabs.TabPane tab="CPU" key="1"> {cpuChart} </Tabs.TabPane>
      <Tabs.TabPane tab="Memory" key="2"> {memoryChart}</Tabs.TabPane>
    </Tabs>
  }
}