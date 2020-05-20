import React from 'react';
import { Tabs, Row, Col, Statistic } from "antd";
import ReactEcharts from "echarts-for-react";
import styles from './performance-tab.module.css';
import { useSelector } from "react-redux";
import {RootState} from "../reducers";


interface SideTabProps {
  icon: JSX.Element,
  title: string,
  subtitle: string
}

const SideTab: React.FC<SideTabProps> = (props) => {
  return (
    <div className={styles['tab']}>
      <div className={styles['tab-chart']}>{props.icon}</div>
      <div className={styles['tab-text']}>
        <span className={styles.title}>{props.title}</span><br />
        <span className={styles.subtitle}>{props.subtitle}</span>
      </div>
    </div>
  );
}

interface ChartProps {
  key: number,
  data: number[],
  rgb: number[],
  cornerTexts: string[],
  showExtras: boolean,
  height: string
}

const generateOneLineText = (left: React.ReactNode, right: React.ReactNode, leftClassName=styles['chart-text'], rightClassName=styles['chart-text']) => {
  return <Row justify="space-between">
    <Col className={leftClassName}>{left}</Col>
    <Col className={rightClassName}>{right}</Col>
  </Row>;
};

const Chart: React.FC<ChartProps> = (props) => {
  // colors for border/line, area, grid
  const colors = [1, 0.4, 0.1].map((alpha) => 'rgba(' + props.rgb.join(', ') + ', ' + alpha + ')');
  const xdata = Array.from(Array(props.data.length).keys());
  const option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xdata,
      splitLine: {
        show: props.showExtras,
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
        show: props.showExtras,
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
      data: props.data,
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

  const topLine = props.showExtras ? generateOneLineText(props.cornerTexts[0], props.cornerTexts[1]) : null;
  const bottomLine = props.showExtras ? generateOneLineText(props.cornerTexts[3], props.cornerTexts[2]) : null;

  return (
    <div>
      {topLine}
      <div style={{border: '1px solid ' + colors[0]}}>
        <ReactEcharts
          style={{height: props.height}}
          key={props.key}
          option={option}
        />
      </div>
      {bottomLine}
    </div>
  );
}


export default function PerformanceTab() {

  const upTime = useSelector((state: RootState) => state.general.uptime);
  const processCount = useSelector((state: RootState) => state.process.processes.length);
  const cpuLoadHistory = useSelector((state: RootState) => state.cpu.loadHistory);
  const memoryLoadHistory = useSelector((state: RootState) => state.memory.loadHistory);
  const cpuInfo = useSelector((state: RootState) => state.cpu.info);
  const cpuSpeed = useSelector((state: RootState) => state.cpu.currentSpeed);
  const memoryLoad = useSelector((state: RootState) => state.memory.load);
  const memoryInfo = useSelector((state: RootState) => state.memory.info);

  const memorySizeToString = (size: number): string => {
    if(size === 0) {
      return '0';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = size;
    // iteratively divide 1024 to find the best suitable memory unit
    while(value > 1024 && unitIndex < units.length) {
      value /= 1024;
      unitIndex ++;
    }
    return value.toFixed(1) + ' ' + units[unitIndex];
  };


  // generate large charts and small charts to display in tab and in pane
  let [charts, smallCharts] = [[true, '250px'], [false, '45px']].map((extraArgs, index) => {
    let showExtras = extraArgs[0] as boolean;
    let height = extraArgs[1] as string;
    return [
      <Chart
        key={index * 2}
        data={cpuLoadHistory}
        rgb={[17, 125, 187]}
        cornerTexts={['% Utilization', '100 %', '0', '60 Seconds']}
        showExtras={showExtras}
        height={height} />,
      <Chart
        key={index * 2 + 1}
        data={memoryLoadHistory}
        rgb={[139, 18, 174]}
        cornerTexts={['Memory Usage', memorySizeToString(memoryLoad.total), '0', '60 Seconds']}
        showExtras={showExtras}
        height={height} />
    ];
  });

  // find a slot that has memory information to display memory information
  let pluggedMemories = memoryInfo.filter((value) => value.size !== 0);

  return (
    <Tabs
      className={styles['performance-tab']}
      defaultActiveKey="1"
      tabPosition="left"
      size="large"
      tabBarStyle={{width: '25%', height: '100vh'}}
    >
      <Tabs.TabPane
        className={styles['pane']}
        tab={<SideTab
          icon={smallCharts[0]}
          title="CPU"
          subtitle={cpuLoadHistory[cpuLoadHistory.length - 1].toFixed(0) + '%'} />
        }
        key="1">
        {generateOneLineText('CPU',
          cpuInfo.manufacturer + ' ' + cpuInfo.brand + ' CPU @ ' + cpuInfo.speed + ' GHz',
          styles['big-title'], styles['title'])}
        <div className={styles['chart']} >
          {charts[0]}
        </div>
        <Row justify="space-between" gutter={20}>
          <Col span={12}>
            <Row justify="space-between">
              <Col><Statistic title="Utilization" value={
                cpuLoadHistory[cpuLoadHistory.length - 1].toFixed(1) + '%'
              } /></Col>
              <Col><Statistic title="Speed" value={cpuSpeed} suffix="GHz"/></Col>
            </Row>
            <Row justify="space-between">
              <Col><Statistic title="Processes" value={processCount} /></Col>
              {/*<Col><Statistic title="Threads" value={'TODO'} /></Col>*/}
            </Row>
            <Row justify="space-between">
              <Col><Statistic title="Up Time" value={
                new Date(upTime * 1000).toISOString().substr(11, 8)
              } /></Col>
            </Row>
          </Col>
          <Col className={styles['static-title']} span={7}>
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
            <div>{cpuInfo.speed + ' GHz'}</div>
            <div>{cpuInfo.socket === '' ? 'Not Available' : cpuInfo.socket}</div>
            <div>{cpuInfo.physicalCores}</div>
            <div>{cpuInfo.cores}</div>
            <div>{cpuInfo.flags.includes('vmx') ? 'Enabled' : 'Disabled'}</div>
            <div>{memorySizeToString((cpuInfo.cache.l1d + cpuInfo.cache.l1i) * cpuInfo.physicalCores)}</div>
            <div>{memorySizeToString(cpuInfo.cache.l2 * cpuInfo.physicalCores)}</div>
            <div>{memorySizeToString(cpuInfo.cache.l3)}</div>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane
        className={styles['pane']}
        tab={<SideTab
          icon={smallCharts[1]}
          title="Memory"
          subtitle={memoryLoadHistory[memoryLoadHistory.length - 1].toFixed(0) + '%'} />
        }
        key="2">
        {generateOneLineText('Memory', memorySizeToString(memoryLoad.total) + ' DRAM', styles['big-title'], styles['big-title'])}
        <div className={styles['chart']} >
          {charts[1]}
        </div>
        <Row justify="space-between" gutter={20}>
          <Col span={6}>
            <Row><Statistic title="In Use" value={memorySizeToString(memoryLoad.used)} /></Row>
            <Row><Statistic title="Buffers" value={memorySizeToString(memoryLoad.buffers)} /></Row>
            <Row><Statistic title="Swap Used" value={memorySizeToString(memoryLoad.swapused)} /></Row>
          </Col>
          <Col span={6}>
            <Row><Statistic title="Avaliable" value={memorySizeToString(memoryLoad.free)}/></Row>
            <Row><Statistic title="Cached" value={memorySizeToString(memoryLoad.cached)} /></Row>
            <Row><Statistic title="Swap Available" value={memorySizeToString(memoryLoad.swapfree)} /></Row>
          </Col>
          <Col className={styles['static-title']} span={6}>
            <div>Speed:</div>
            <div>Slots used:</div>
            <div>Form factor:</div>
          </Col>
          <Col className={styles['static-value']} span={5}>
            <div>{pluggedMemories.length >= 1 ? pluggedMemories[0].clockSpeed + ' MHz': 'N/A'}</div>
            <div>{pluggedMemories.length + ' of ' + memoryInfo.length}</div>
            <div>{pluggedMemories.length >= 1 ? (pluggedMemories[0].formFactor === '' ? 'N/A' : pluggedMemories[0].formFactor) : 'N/A'}</div>
          </Col>
        </Row>
      </Tabs.TabPane>
    </Tabs>
  );
}
