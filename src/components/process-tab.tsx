import React, {useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { VList } from 'virtuallist-antd';
import { Table, Button, Badge } from "antd";
import { CheckCircleOutlined, DiffTwoTone } from "@ant-design/icons";
import styles from './process-tab.module.css';
import { killProcess } from "../actions/process";
import {RootState} from "../reducers";
import classNames from 'classnames';
import {Systeminformation} from 'systeminformation';

type ProcessesProcessData = Systeminformation.ProcessesProcessData;

interface HeaderProps {
  title?: string | JSX.Element,
  subtitle: string | JSX.Element
}

const Header: React.FC<HeaderProps> = props => {
  return (
    <div>
      <span className={styles['title']}>{props.title}</span>
      <br />
      <span className={styles['subtitle']}>{props.subtitle}</span>
    </div>
  );
}

Header.defaultProps = {
  title: '',
  subtitle: ''
}

const statePriority = {
  'running': 3,
  'sleeping': 2,
  'blocked': 1,
  'zombie': 0
};

const ProcessTab: React.FC = () => {
  const [selectedPID, setSelectedPID] = useState(-1);
  const cpuLoad = useSelector((state: RootState) => state.cpu.loadHistory[state.cpu.loadHistory.length - 1]);
  const memoryLoad = useSelector((state: RootState) => state.memory.loadHistory[state.memory.loadHistory.length - 1]);
  const processes = useSelector((state: RootState) => state.process.processes);
  const dispatch = useDispatch();

  const processCellRenderer = (text: string, record: ProcessesProcessData): JSX.Element => {
    return <span><DiffTwoTone />&emsp;{text}</span>;
  }

  const stateCellRenderer = (text: string, record: ProcessesProcessData): JSX.Element => {
    switch(record.state) {
      case 'running': return <Badge status="success" />;
      case 'sleeping': return <Badge status="warning" />;
      case 'blocked': return <Badge status="error" />;
      case 'zombie': return <Badge status="default" />;
      default: console.error('Process state unknown: ' + record.state); return <Badge status="default" />;
    }
  }

  // helper function to generate correct class names (background colors, etc.) for percentage cells
  const percentageClassName = (selected: boolean, percent: number): string => {
    let className = styles['num-cell'];
    if(!selected) {
      className = classNames(className, styles['level-' + Math.min(Math.ceil((percent + 0.001) / 12.5), 8)])
    }
    return className;
  }

  const cpuCellRenderer = (text: string, record: ProcessesProcessData) => {
    let className = percentageClassName(selectedPID === record.pid, record.pcpu);
    return {
      props: {className: className},
      children: parseFloat(text).toFixed(1) + ' %'
    }
  }

  const memoryCellRenderer = (text: string, record: ProcessesProcessData) => {
    let className = percentageClassName(selectedPID === record.pid, record.pmem);
    let value = record.mem_rss;
    const units = ['KB', 'MB', 'GB'];
    let unitIndex = 0;
    // iteratively divide 1024 to find the best suitable memory unit
    while(value > 1024 && unitIndex < units.length) {
      value /= 1024;
      unitIndex ++;
    }
    return {
      props: {className: className},
      children: value.toFixed(1) + ' ' + units[unitIndex]
    }
  }

  const columns = [
    {
      title: <Header subtitle={'Name'} />,
      dataIndex: 'command',
      width: '200px',
      sorter: (a: ProcessesProcessData, b: ProcessesProcessData) => a.command.localeCompare(b.command),
      render: processCellRenderer,
      ellipsis: true
    },
    {
      title: <Header subtitle={<CheckCircleOutlined/>} />,
      dataIndex: 'state',
      width: '35px',
      // @ts-ignore
      sorter: (a: ProcessesProcessData, b: ProcessesProcessData) => statePriority[a.state] - statePriority[b.state],
      render: stateCellRenderer
    },
    {
      title: <Header subtitle="PID" />,
      dataIndex: 'pid',
      sorter: (a: ProcessesProcessData, b: ProcessesProcessData) => a.pid - b.pid,
      width: '80px',
      ellipsis: true
    },
    {
      title: <Header subtitle="User" />,
      dataIndex: 'user',
      sorter: (a: ProcessesProcessData, b: ProcessesProcessData) => a.user.localeCompare(b.user),
      //render: (text: string) => <NormalCell>{text}</NormalCell>,
      width: '80px',
      ellipsis: true
    },
    {
      title: <Header title={Math.round( cpuLoad * 10) / 10 + ' %'} subtitle="CPU" />,
      dataIndex: 'pcpu',
      sorter: (a: ProcessesProcessData, b: ProcessesProcessData) => a.pcpu - b.pcpu,
      width: '100px',
      render: cpuCellRenderer,
      defaultSortOrder: 'descend' as 'descend'
    },
    {
      title: <Header title={Math.round( memoryLoad * 10) / 10 + ' %'} subtitle="Memory" />,
      dataIndex: 'mem_rss',
      width: '100px',
      sorter: (a: any, b: any) => a.mem_rss - b.mem_rss,
      render: memoryCellRenderer
    }
  ];

  return (
    <div className={styles['process-tab']}>
    <Table
      className={styles['table']}
      loading={processes.length === 0}
      dataSource={processes}
      columns={columns}
      bordered={false}
      scroll={{ y: 'calc(100vh - 80px - 20px - 61px)' }} // minus footer(80px) / tablist(20px) / table header(61px)
      rowKey="pid"
      rowClassName={record => styles['row'] + (selectedPID === record.pid ? ' ' + styles['selected'] : '')}
      pagination={false}
      size="small"
      onRow={(record, rowIndex) => {
        return { onClick: () => setSelectedPID(record.pid) };
      }}
      components={VList({
        height: 'calc(100vh - 80px - 20px - 61px)'
      })}
    />
    <div className={styles['footer']}>
      <Button className={styles['endtask']} type="primary" disabled={selectedPID === -1}
              onClick={() => {
                dispatch(killProcess(selectedPID));
                setSelectedPID(-1);
              }}>
        End Task
      </Button>
    </div>
  </div>
  );
}

export default ProcessTab;
