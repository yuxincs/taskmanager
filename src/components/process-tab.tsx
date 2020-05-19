import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { VList } from 'virtuallist-antd';
import { Table, Button, Badge } from "antd";
import { CheckCircleOutlined, DiffTwoTone } from "@ant-design/icons";
import styles from './process-tab.module.css';
import { killProcess } from "../actions/process";
import {RootState} from "../reducers";


export default function ProcessTab() {
  const [selectedPID, setSelectedPID] = useState('');
  const cpuLoad = useSelector((state: RootState) => state.cpu.loadHistory[state.cpu.loadHistory.length - 1]);
  const memoryLoad = useSelector((state: RootState) => state.memory.loadHistory[state.memory.loadHistory.length - 1]);
  const processes = useSelector((state: RootState) => state.process.processes);
  const dispatch = useDispatch();

  const statePriority = {
    'running': 3,
    'sleeping': 2,
    'blocked': 1
  };

  const normalCellRenderer = (text: string): React.ReactNode => {
    return {
      props: {
        style: { borderBottom: 'none', transition: 'none'}
      },
      children: text
    }
  };

  const headerRenderer = (title: string, subtitle: React.ReactNode | string) => {
    return (
      <div>
        <span className={styles.title}>{title}</span>
        <br />
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    );
  };

  const processCellRenderer = (text: string, record: React.ReactNode): React.ReactNode => {
    let normal = normalCellRenderer(text);
    // @ts-ignore
    normal.children = <span><DiffTwoTone />&emsp;{text}</span>;
    return normal;
  };

  const stateCellRenderer = (text: string, record: any): React.ReactNode => {
    let normal = normalCellRenderer(text);
    const stateBadge = {
      'running': <Badge status="success" />,
      'sleeping': <Badge status="warning" />,
      'blocked': <Badge status="error" />
    };
    // @ts-ignore
    normal.children = stateBadge[record.state];
    return normal;
  };

  const memoryCellRenderer = (text: string, record: any) => {
    let base = percentageCellRenderer(record.pmem, record);
    const units = ['KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = parseInt(text);
    // iteratively divide 1024 to find the best suitable memory unit
    while(value > 1024 && unitIndex < units.length) {
      value /= 1024;
      unitIndex ++;
    }
    // @ts-ignore
    base.children = value.toFixed(1) + ' ' + units[unitIndex];
    return base;
  };

  const percentageCellRenderer = (text: string, record: any) => {
    let normal = normalCellRenderer(text);
    // @ts-ignore
    normal.props.className = styles['num-cell'];

    if(selectedPID !== record.pid) {
      // @ts-ignore
      normal.props.className += ' ' + styles['level-' + Math.min(Math.ceil((parseFloat(text) + 0.001) / 12.5), 8)];
    }
    // @ts-ignore
    normal.children = text.toFixed(1) + ' %';
    return normal;
  };

  const columns = [
    {
      title: headerRenderer('', 'Name'),
      dataIndex: 'command',
      width: '200px',
      sorter: (a: any, b: any) => a.command.localeCompare(b.command),
      render: processCellRenderer,
      ellipsis: true
    },
    {
      title: headerRenderer('', <CheckCircleOutlined />),
      dataIndex: 'state',
      width: '35px',
      // @ts-ignore
      sorter: (a: any, b: any) => statePriority[a.state] - statePriority[b.state],
      render: stateCellRenderer
    },
    {
      title: headerRenderer('', 'PID'),
      dataIndex: 'pid',
      sorter: (a: any, b: any) => a.pid - b.pid,
      render: normalCellRenderer,
      width: '80px',
      ellipsis: true
    },
    {
      title: headerRenderer('', 'User'),
      dataIndex: 'user',
      sorter: (a: any, b: any) => a.user.localeCompare(b.user),
      render: normalCellRenderer,
      width: '80px',
      ellipsis: true
    },
    {
      title: headerRenderer(Math.round( cpuLoad * 10) / 10 + ' %', 'CPU'),
      dataIndex: 'pcpu',
      sorter: (a: any, b: any) => a.pcpu - b.pcpu,
      width: '100px',
      render: percentageCellRenderer,
      defaultSortOrder: 'descend'
    },
    {
      title: headerRenderer(Math.round( memoryLoad * 10) / 10 + ' %', 'Memory'),
      dataIndex: 'mem_rss',
      width: '100px',
      sorter: (a: any, b: any) => a.mem_rss - b.mem_rss,
      render: memoryCellRenderer
    }
  ];

  return (
    <div className={styles.processTab}>
    <Table
      className={styles.table}
      loading={processes.length === 0}
      dataSource={processes}
      // @ts-ignore
      columns={columns}
      bordered={false}
      scroll={{ y: 'calc(100vh - 80px - 20px - 61px)' }} // minus footer(80px) / tablist(20px) / table header(61px)
      rowKey="pid"
      // @ts-ignore
      rowClassName={record => styles.row + (selectedPID === record.pid ? ' ' + styles.selected : '')}
      pagination={false}
      size="small"
      onRow={(record, rowIndex) => {
        // @ts-ignore
        return { onClick: () => setSelectedPID(record.pid) };
      }}
      components={VList({
        height: 'calc(100vh - 80px - 20px - 61px)'
      })}
    />
    <div className={styles.footer}>
      <Button className={styles.endtask} type="primary" disabled={selectedPID === ''}
              onClick={() => {
                // @ts-ignore
                dispatch(killProcess(selectedPID));
                setSelectedPID('');
              }}>
        End Task
      </Button>
    </div>
  </div>
  );
}
