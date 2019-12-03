import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Row, Col, Statistic } from "antd";
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

  memorySizeToString(size) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = parseInt(size);
    // iteratively divide 1024 to find the best suitable memory unit
    while(value > 1024 && unitIndex < units.length) {
      value /= 1024;
      unitIndex ++;
    }
    return value + ' ' + units[unitIndex];
  }

  generateOneLineText(left, right, leftClassName=styles['chart-text'], rightClassName=styles['chart-text']) {
    return <Row type="flex" justify="space-between">
      <Col className={leftClassName}>{left}</Col>
      <Col className={rightClassName}>{right}</Col>
    </Row>;
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
          ['Memory Usage', this.memorySizeToString(this.props.memoryDynamic.total), '0', '60 Seconds'], ...extraArgs)
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
        {this.generateOneLineText('CPU',
          this.props.cpuStatic.manufacturer + ' ' +
          this.props.cpuStatic.brand + ' CPU @ ' +
          this.props.cpuStatic.speed + ' GHz',
          styles['big-title'], styles['title'])}
        <div className={styles['chart']} >
          {charts[0]}
        </div>
        <Row type="flex" justify="space-between" gutter={10}>
          <Col span={12}>
            <Row type="flex" justify="space-between">
              <Col><Statistic title="Utilization" value={'TODO'} /></Col>
              <Col><Statistic title="Speed" value={'TODO'} suffix="GHz"/></Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col><Statistic title="Processes" value={'TODO'} /></Col>
              <Col><Statistic title="Threads" value={'TODO'} /></Col>
              <Col><Statistic title="Handles" value={'TODO'} /></Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col><Statistic title="Up Time" value={'TODO'} /></Col>
            </Row>
          </Col>
          <Col className={styles['static-title']} span={6}>
            <div>Base speed:</div>
            <div>Sockets:</div>
            <div>Cores:</div>
            <div>Logical processors:</div>
            <div>Virtualization:</div>
            <div>L1 Cache:</div>
            <div>L2 Cache:</div>
            <div>L3 Cache:</div>
          </Col>
          <Col className={styles['static-value']} span={5}>
            <div>{this.props.cpuStatic.speed + ' GHz'}</div>
            <div>{this.props.cpuStatic.socket === '' ? 'Not Available' : this.props.cpuStatic.socket}</div>
            <div>{this.props.cpuStatic.physicalCores}</div>
            <div>{this.props.cpuStatic.cores}</div>
            <div>Not Available</div>
            <div>{this.memorySizeToString(this.props.cpuStatic.cache.l1d + this.props.cpuStatic.cache.l1i)}</div>
            <div>{this.memorySizeToString(this.props.cpuStatic.cache.l2)}</div>
            <div>{this.memorySizeToString(this.props.cpuStatic.cache.l3)}</div>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane
        className={styles['pane']}
        tab={this.generateTab(smallCharts[1],
          'Memory', this.props.memLoadHistory[this.props.memLoadHistory.length - 1].toFixed(0) + '%')
        }
        key="2">
        {this.generateOneLineText('Memory', this.memorySizeToString(this.props.memoryDynamic.total) + ' DRAM', styles['big-title'], styles['big-title'])}
        <div className={styles['chart']} >
          {charts[1]}
        </div>
        <Row type="flex" justify="space-between" gutter={10}>
          <Col span={12}>
            <Row type="flex" justify="space-between">
              <Col><Statistic title="In Use" value={'TODO'} /></Col>
              <Col><Statistic title="Avaliable" value={'TODO'}/></Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span={5}><Statistic title="Committed" value={'TODO'} /></Col>
              <Col span={7}><Statistic title="Cached" value={'TODO'} /></Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col><Statistic title="Page pool" value={'TODO'} /></Col>
              <Col><Statistic title="Non-paged pool" value={'TODO'} /></Col>
            </Row>
          </Col>
          <Col className={styles['static-title']} span={6}>
            <div>Speed:</div>
            <div>Slots used:</div>
            <div>Form factor:</div>
            <div>Hardware reserved</div>
          </Col>
          <Col className={styles['static-value']} span={4}>
            <div>TODO</div>
            <div>TODO</div>
            <div>TODO</div>
            <div>TODO</div>
          </Col>
        </Row>
      </Tabs.TabPane>
    </Tabs>
  }
}