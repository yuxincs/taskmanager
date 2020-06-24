import React, {useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
// TODO: remove ignore mark when react-base-table releases TS version
// @ts-ignore
import BaseTable, { AutoResizer, SortOrder } from 'react-base-table';
import 'react-base-table/styles.css';
import { Button, Badge, Row } from "antd";
import { CheckCircleOutlined, DiffTwoTone } from "@ant-design/icons";
import styles from './process-tab.module.scss';
import { killProcess } from "../actions/process";
import {RootState} from "../reducers";
import { toLevel, isSelected, toMemoryString } from './utils';
import {Systeminformation} from 'systeminformation';
import classNames from "classnames";

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


type ProcessState = 'running' | 'sleeping' | 'blocked' | 'zombie';

interface StatePriority {
  readonly 'running': number,
  readonly 'sleeping': number,
  readonly 'blocked': number,
  readonly 'zombie': number
}

const statePriority: StatePriority = {
  'running': 3,
  'sleeping': 2,
  'blocked': 1,
  'zombie': 0
};


const ProcessTab: React.FC = () => {
  const cpuLoad = useSelector((state: RootState) => state.cpu.loadHistory[state.cpu.loadHistory.length - 1]);
  const memoryLoad = useSelector((state: RootState) => state.memory.loadHistory[state.memory.loadHistory.length - 1]);
  const processes = useSelector((state: RootState) => state.process.processes);
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState({from: -1, to: -1});
  const [sortBy, setSortBy] = useState({key: 'addedDate', order: SortOrder.DESC});

  const processCellRenderer = ({cellData}: {cellData: string}): JSX.Element => {
    return <span><DiffTwoTone />&emsp;{cellData}</span>;
  }

  const stateCellRenderer = ({rowData}: {rowData: ProcessesProcessData}): JSX.Element => {
    switch(rowData.state) {
      case 'running': return <Badge status="success" />;
      case 'sleeping': return <Badge status="warning" />;
      case 'blocked': return <Badge status="error" />;
      case 'zombie': return <Badge status="default" />;
      default: console.error('Process state unknown: ' + rowData.state); return <Badge status="default" />;
    }
  }

  const cpuCellRenderer = ({cellData}: {cellData: string}): string => `${parseFloat(cellData).toFixed(1)}%`;

  const memoryCellRenderer = ({cellData}: {cellData: string}): string => toMemoryString(parseFloat(cellData) * 1024).join(' ');

  const columns: any[] = [
    {
      key: 'command',
      dataKey: 'command',
      title: 'Name',
      width: 350,
      midWidth: 300,
      resizable: true,
      sortable: true,
      className: styles['command-cell'],
      cellRenderer: processCellRenderer,
      headerRenderer: () => <Header subtitle="Name" />
    },
    {
      key: 'state',
      dataKey: 'state',
      title: '',
      sortable: true,
      width: 35,
      cellRenderer: stateCellRenderer,
      align: 'center',
      headerRenderer: () => <Header subtitle={<CheckCircleOutlined />} />
    },
    {
      key: 'pid',
      title: 'PID',
      dataKey: 'pid',
      width: 80,
      minWidth: 80,
      sortable: true,
      resizable: true,
      align: 'center',
      headerRenderer: () => <Header subtitle="PID" />
    },
    {
      key: 'user',
      dataKey: 'user',
      title: 'User',
      width: 80,
      minWidth: 80,
      sortable: true,
      resizable: true,
      headerRenderer: () => <Header subtitle="User" />
    },
    {
      key: 'pcpu',
      dataKey: 'pcpu',
      title: `${cpuLoad} CPU`,
      width: 100,
      minWidth: 100,
      className: ({cellData}: {cellData: string}) =>
        classNames(styles[`level-${toLevel(parseFloat(cellData))}`],
          {[styles['busy-num-cell']]: cpuLoad > 80}
          ),
      cellRenderer: cpuCellRenderer,
      sortable: true,
      resizable: true,
      align: 'right',
      headerClassName: () => classNames({[styles['busy-header-cell'] ]: cpuLoad > 80}),
      headerRenderer: () => <Header title={Math.round( cpuLoad * 10) / 10 + ' %'} subtitle="CPU" />
    },
    {
      key: 'mem_rss',
      dataKey: 'mem_rss',
      title: `${memoryLoad} Memory`,
      width: 100,
      minWidth: 100,
      className: ({rowData}: {rowData: ProcessesProcessData}) =>
        classNames(
          styles[`level-${toLevel(rowData.pmem)}`],
          {[styles['busy-num-cell']]: memoryLoad > 80}
        ),
      cellRenderer: memoryCellRenderer,
      sortable: true,
      align: 'right',
      headerClassName: () => classNames({[styles['busy-header-cell'] ]: memoryLoad > 80}),
      headerRenderer: () => <Header title={Math.round( memoryLoad * 10) / 10 + ' %'} subtitle="Memory" />
    }
  ]

  const sortFunc = ({key, order}: {key: string, order: SortOrder}) => (a: any, b: any) => {
    switch(key) {
      case 'command': return order === SortOrder.ASC ? b[key].localeCompare(a[key]) : a[key].localeCompare(b[key]);
      case 'user': return order === SortOrder.ASC ? b[key].localeCompare(a[key]) : a[key].localeCompare(b[key]);
      case 'state': return order === SortOrder.ASC ?
        statePriority[a[key] as ProcessState] - statePriority[b[key] as ProcessState] :
        statePriority[b[key] as ProcessState] - statePriority[a[key] as ProcessState];
      default: return order === SortOrder.ASC ? a[key] - b[key] : b[key] - a[key];
    }
  };

  const sorted = processes.sort(sortFunc(sortBy));

  return (
    <div className={styles['process-tab']}>
      <Row className={styles['table']}>
        <AutoResizer>
          {({ width, height }: { width: number, height: number }): JSX.Element => (
            <BaseTable
              className={styles['table']}
              data={sorted}
              width={width}
              height={height}
              columns={columns}
              rowHeight={40}
              rowKey="pid"
              rowClassName={
                ({ rowIndex }: { rowIndex: number }) =>
                  isSelected(rowIndex, selectedRows) ? styles['selected-row'] : styles['normal-row']
              }
              rowEventHandlers={{
                onClick: ({ rowIndex, event }: { rowIndex: any, event: any }) => {
                  const { from, to } = selectedRows;
                  if(event.shiftKey && from !== -1 && to !== -1) {
                    setSelectedRows({ from: from, to: rowIndex })
                  } else {
                    if(from === to && to === rowIndex) {
                      setSelectedRows({from: -1, to: -1});
                    } else {
                      setSelectedRows({ from: rowIndex, to: rowIndex });
                    }
                  }
                }
              }}
              sortBy={sortBy}
              onColumnSort={({ key, order }: { key: any, order: any }) => { setSortBy({key, order}); }}
              headerClassName={styles['header-cell']}
              headerHeight={60}
            />)}
        </AutoResizer>
      </Row>
      <Row className={styles['footer']} justify="end">
        <Button
          type="primary"
          disabled={(selectedRows.to === selectedRows.from) && selectedRows.to === -1}
          onClick={() => {
            if(selectedRows.to === -1 || selectedRows.from === -1) {
              return;
            }
            let selectedPIDs = sorted.slice(
              Math.min(selectedRows.from, selectedRows.to),
              Math.max(selectedRows.from, selectedRows.to) + 1
            ).map((element: ProcessesProcessData) => element.pid);
            console.log(selectedPIDs);
            selectedPIDs.forEach((pid: number) => dispatch(killProcess(pid)));
            setSelectedRows({from: -1, to: -1});
          }}
        >
          End Task
        </Button>
      </Row>
  </div>
  );
}

export default ProcessTab;
