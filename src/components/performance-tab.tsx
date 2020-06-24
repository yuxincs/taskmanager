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
  chartKey: number,
  data: number[],
  rgb: number[],
  cornerTexts: string[],
  showExtras: boolean,
  height: string
}

const Chart: React.FC<ChartProps> = (props) => {
  // colors for border/line, area, grid
  const colors = [1, 0.4, 0.1].map((alpha) => `rgba(${props.rgb.join(',')},${alpha})`);
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

  let topLine = null;
  let bottomLine = null;
  if(props.showExtras){
    topLine = (
      <Row justify="space-between">
        <Col>{props.cornerTexts[0]}</Col>
        <Col>{props.cornerTexts[1]}</Col>
      </Row>
    );
    bottomLine = (
      <Row justify="space-between">
        <Col>{props.cornerTexts[2]}</Col>
        <Col>{props.cornerTexts[3]}</Col>
      </Row>
    );
  }

  return (
    <div>
      {topLine}
      <div style={{border: '1px solid ' + colors[0]}}>
        <ReactEcharts
          style={{height: props.height}}
          key={props.chartKey}
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
  const cpuCurrentSpeed = useSelector((state: RootState) => state.cpu.currentSpeed);
  const memoryLoad = useSelector((state: RootState) => state.memory.load);
  const memoryInfo = useSelector((state: RootState) => state.memory.info);

  type resizeOption = 'auto' | 'B' | 'KB' | 'MB' | 'GB';
  const memorySizeToString = (size: number, resize: resizeOption = 'auto'): [string, string] => {
    if(size === 0) {
      return ['0', 'B'];
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = size;
    // iteratively divide 1024 to find the best suitable memory unit
    while(value > 1024 && unitIndex < units.length) {
      value /= 1024;
      unitIndex ++;
      if(resize !== 'auto' && resize === units[unitIndex])
        break;
    }

    return [value.toFixed(1), units[unitIndex]];
  };


  // generate large charts and small charts to display in tab and in pane
  const [charts, smallCharts] = [[true, '250px'], [false, '45px']].map((extraArgs, index) => {
    const showExtras = extraArgs[0] as boolean;
    const height = extraArgs[1] as string;
    return [
      <Chart
        chartKey={index * 2}
        data={cpuLoadHistory}
        rgb={[17, 125, 187]}
        cornerTexts={['% Utilization', '100 %', '0', '60 Seconds']}
        showExtras={showExtras}
        height={height}
      />,
      <Chart
        chartKey={index * 2 + 1}
        data={memoryLoadHistory}
        rgb={[139, 18, 174]}
        cornerTexts={['Memory Usage', memorySizeToString(memoryLoad.total).join(' '), '0', '60 Seconds']}
        showExtras={showExtras}
        height={height}
      />
    ];
  });

  // find a slot that has memory information to display memory information
  const pluggedMemories = memoryInfo.filter((value) => value.size !== 0);

  const [totalMemory, unit] = memorySizeToString(memoryLoad.total);
  const activeMemory = memorySizeToString(memoryLoad.active, unit as resizeOption)[0];
  const cpuCurrentLoad = cpuLoadHistory[cpuLoadHistory.length - 1].toFixed(0);
  const memoryCurrentLoad = memoryLoadHistory[memoryLoadHistory.length - 1].toFixed(0);
  return (
    <Tabs
      className={styles['performance-tab']}
      defaultActiveKey="1"
      tabPosition="left"
      size="large"
      tabBarStyle={{width: '30%', height: '100vh'}}
    >
      <Tabs.TabPane
        className={styles['pane']}
        tab={
          <SideTab
            icon={smallCharts[0]}
            title="CPU"
            subtitle={`${cpuCurrentLoad}%\t${cpuCurrentSpeed} GHz`}
          />
        }
        key="1"
      >
        <Row justify="space-between">
          <Col className={styles['big-title']}>CPU</Col>
          <Col className={styles['title']}>
            {`${cpuInfo.manufacturer} ${cpuInfo.brand} CPU @ ${cpuInfo.speed} GHz`}
          </Col>
        </Row>
        <div className={styles['chart']} >
          {charts[0]}
        </div>
        <Row justify="space-between" gutter={20}>
          <Col span={12}>
            <Row justify="space-between">
              <Col>
                <Statistic
                title="Utilization"
                value={`${cpuCurrentLoad}%`}
                />
              </Col>
              <Col><Statistic title="Speed" value={cpuSpeed} suffix="GHz" /></Col>
            </Row>
            <Row justify="space-between">
              <Col><Statistic title="Processes" value={processCount} /></Col>
              {/*<Col><Statistic title="Threads" value={'TODO'} /></Col>*/}
            </Row>
            <Row justify="space-between">
              <Col>
                <Statistic
                  title="Up Time"
                  value={new Date(upTime * 1000).toISOString().substr(11, 8)}
                />
              </Col>
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
            <div>{`${cpuInfo.speed } GHz`}</div>
            <div>{cpuInfo.socket === '' ? 'Not Available' : cpuInfo.socket}</div>
            <div>{cpuInfo.physicalCores}</div>
            <div>{cpuInfo.cores}</div>
            <div>{cpuInfo.flags.includes('vmx') ? 'Enabled' : 'Disabled'}</div>
            <div>{memorySizeToString((cpuInfo.cache.l1d + cpuInfo.cache.l1i) * cpuInfo.physicalCores).join(' ')}</div>
            <div>{memorySizeToString(cpuInfo.cache.l2 * cpuInfo.physicalCores).join(' ')}</div>
            <div>{memorySizeToString(cpuInfo.cache.l3).join(' ')}</div>
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane
        className={styles['pane']}
        tab={
          <SideTab
            icon={smallCharts[1]}
            title="Memory"
            subtitle={`${activeMemory} / ${totalMemory} ${unit} (${memoryCurrentLoad} %)`}/>
        }
        key="2"
      >
        <Row justify="space-between">
          <Col className={styles['big-title']}>Memory</Col>
          <Col className={styles['big-title']}>{`${memorySizeToString(memoryLoad.total).join(' ')} DRAM`}</Col>
        </Row>
        <div className={styles['chart']} >
          {charts[1]}
        </div>
        <Row justify="space-between" gutter={20}>
          <Col span={6}>
            <Row><Statistic title="In Use" value={memorySizeToString(memoryLoad.used).join(' ')} /></Row>
            <Row><Statistic title="Buffers" value={memorySizeToString(memoryLoad.buffers).join(' ')} /></Row>
            <Row><Statistic title="Swap Used" value={memorySizeToString(memoryLoad.swapused).join(' ')} /></Row>
          </Col>
          <Col span={6}>
            <Row><Statistic title="Available" value={memorySizeToString(memoryLoad.free).join(' ')}/></Row>
            <Row><Statistic title="Cached" value={memorySizeToString(memoryLoad.cached).join(' ')} /></Row>
            <Row><Statistic title="Swap Available" value={memorySizeToString(memoryLoad.swapfree).join(' ')} /></Row>
          </Col>
          <Col className={styles['static-title']} span={6}>
            <div>Speed:</div>
            <div>Slots used:</div>
            <div>Form factor:</div>
          </Col>
          <Col className={styles['static-value']} span={5}>
            <div>{pluggedMemories.length >= 1 ? `${pluggedMemories[0].clockSpeed} MHz`: 'N/A'}</div>
            <div>{`${pluggedMemories.length} of ${memoryInfo.length}`}</div>
            <div>{pluggedMemories.length >= 1 ? (pluggedMemories[0].formFactor === '' ? 'N/A' : pluggedMemories[0].formFactor) : 'N/A'}</div>
          </Col>
        </Row>
      </Tabs.TabPane>
    </Tabs>
  );
}
