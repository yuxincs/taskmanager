import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Badge, Icon } from "antd";
import styles from './process-tab.module.css';
import { killProcess } from "../actions/process";


export default function ProcessTab() {
  const [selectedPID, setSelectedPID] = useState('');
  const cpuLoad = useSelector(state => state.cpu.loadHistory[state.cpu.loadHistory.length - 1]);
  const memoryLoad = useSelector(state => state.memory.loadHistory[state.memory.loadHistory.length - 1]);
  const processes = useSelector(state => state.process.processes);
  const dispatch = useDispatch();

  const statePriority = {
    'running': 3,
    'sleeping': 2,
    'blocked': 1
  };

  const normalCellRenderer = text => {
    return {
      props: {
        style: { borderBottom: 'none', transition: 'none'}
      },
      children: text
    }
  };

  const headerRenderer = (title, subtitle) => {
    return (
      <div>
        <span className={styles.title}>{title}</span>
        <br />
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    );
  };

  const processCellRenderer = (text, record) => {
    let normal = normalCellRenderer(text);
    normal.children = <span><Icon type="profile" theme="twoTone" />&emsp;{text}</span>;
    return normal;
  };

  const stateCellRenderer = (text, record) => {
    let normal = normalCellRenderer(text);
    const stateBadge = {
      'running': <Badge status="success" />,
      'sleeping': <Badge status="warning" />,
      'blocked': <Badge status="error" />
    };
    normal.children = stateBadge[record.state];
    return normal;
  };

  const memoryCellRenderer = (text, record) => {
    let base = percentageCellRenderer(record.pmem, record);
    const units = ['KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = parseInt(text);
    // iteratively divide 1024 to find the best suitable memory unit
    while(value > 1024 && unitIndex < units.length) {
      value /= 1024;
      unitIndex ++;
    }
    base.children = value.toFixed(1) + ' ' + units[unitIndex];
    return base;
  };

  const percentageCellRenderer = (text, record) => {
    let normal = normalCellRenderer(text);
    normal.props.className = styles['num-cell'];

    if(selectedPID !== record.pid) {
      normal.props.className += ' ' + styles['level-' + Math.min(Math.ceil((parseFloat(text) + 0.001) / 12.5), 8)];
    }
    normal.children = text.toFixed(1) + ' %';
    return normal;
  };

  const columns = [
    {
      title: headerRenderer('', 'Name'),
      dataIndex: 'command',
      width: '200px',
      sorter: (a, b) => a.command.localeCompare(b.command),
      render: processCellRenderer,
      ellipsis: true
    },
    {
      title: headerRenderer('', <Icon type="check-circle" />),
      dataIndex: 'state',
      width: '35px',
      sorter: (a, b) => statePriority[a.state] - statePriority[b.state],
      render: stateCellRenderer
    },
    {
      title: headerRenderer('', 'PID'),
      dataIndex: 'pid',
      sorter: (a, b) => a.pid - b.pid,
      render: normalCellRenderer,
      width: '80px',
      ellipsis: true
    },
    {
      title: headerRenderer('', 'User'),
      dataIndex: 'user',
      sorter: (a, b) => a.user.localeCompare(b.user),
      render: normalCellRenderer,
      width: '80px',
      ellipsis: true
    },
    {
      title: headerRenderer(Math.round( cpuLoad * 10) / 10 + ' %', 'CPU'),
      dataIndex: 'pcpu',
      sorter: (a, b) => a.pcpu - b.pcpu,
      width: '100px',
      render: percentageCellRenderer,
      defaultSortOrder: 'descend'
    },
    {
      title: headerRenderer(Math.round( memoryLoad * 10) / 10 + ' %', 'Memory'),
      dataIndex: 'mem_rss',
      width: '100px',
      sorter: (a, b) => a.mem_rss - b.mem_rss,
      render: memoryCellRenderer
    }
  ];

  return (
    <div className={styles.processTab}>
    <Table
      className={styles.table}
      loading={processes.length === 0}
      dataSource={processes}
      columns={columns}
      bordered={false}
      scroll={{ y: 'calc(100vh - 80px - 20px - 61px)' }} // minus footer(80px) / tablist(20px) / table header(61px)
      rowKey="pid"
      rowClassName={record => styles.row + (selectedPID === record.pid ? ' ' + styles.selected : '')}
      pagination={false}
      size="small"
      onRow={(record, rowIndex) => {
        return { onClick: () => setSelectedPID(record.pid) };
      }}
    />
    <div className={styles.footer}>
      <Button className={styles.endtask} type="primary" disabled={selectedPID === ''}
              onClick={() => {
                dispatch(killProcess(selectedPID));
                setSelectedPID('');
              }}>
        End Task
      </Button>
    </div>
  </div>
  );
}
