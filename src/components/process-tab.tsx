import React, { MouseEvent, SyntheticEvent, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import BaseTable, { AutoResizer, SortOrder } from 'react-base-table';
import 'react-base-table/styles.css';
// @ts-ignore
import Text from 'react-texty';
import 'react-texty/styles.css';
import { Button, Badge, Row } from "antd";
import { CheckCircleOutlined, DiffTwoTone } from "@ant-design/icons";
import styles from './process-tab.module.scss';
import { killProcess } from "../actions/process";
import {RootState} from "../reducers";
import { toLevel, toMemoryString } from './utils';
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

  const [sortBy, setSortBy] = useState({key: 'addedDate', order: 'asc' as SortOrder});
  const [selectedPIDs, setSelectedPIDS] = useState<Set<number>>(new Set());

  const processCellRenderer = ({cellData}: {cellData: string}): JSX.Element => {
    return <Text tooltip={cellData}><DiffTwoTone />&emsp;{cellData}</Text>;
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
      minWidth: 300,
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
      width: 110,
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
      width: 110,
      minWidth: 110,
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
      case 'command': return order === 'asc' ? b[key].localeCompare(a[key]) : a[key].localeCompare(b[key]);
      case 'user': return order === 'asc' ? b[key].localeCompare(a[key]) : a[key].localeCompare(b[key]);
      case 'state': return order === 'asc' ?
        statePriority[a[key] as ProcessState] - statePriority[b[key] as ProcessState] :
        statePriority[b[key] as ProcessState] - statePriority[a[key] as ProcessState];
      default: return order === 'asc' ? a[key] - b[key] : b[key] - a[key];
    }
  };

  const sorted = processes.sort(sortFunc(sortBy));
  // TODO: selection should only include PIDs instead of table rows
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
                ({ rowData }: { rowData: ProcessesProcessData }) =>
                  selectedPIDs.has(rowData.pid) ? styles['selected-row'] : styles['normal-row']
              }
              rowEventHandlers={{
                onClick: ({ rowData, rowIndex, event }:
                            { rowData: ProcessesProcessData, rowIndex: number, event: React.SyntheticEvent}) => {
                  const curPID = rowData.pid;
                  let newSelected = new Set(selectedPIDs);
                  // TODO: change when a new solution to cast from SyntheticEvent to MouseEvent is found
                  let mouseEvent = event as MouseEvent;
                  if(mouseEvent.shiftKey && selectedPIDs.size > 0) {
                    const minIndex = sorted.findIndex(process => selectedPIDs.has(process.pid));
                    const left = Math.min(rowIndex, minIndex);
                    const right = Math.max(rowIndex, minIndex);
                    newSelected.clear();
                    // select all items from left to right
                    sorted.slice(left, right + 1).forEach(process => newSelected.add(process.pid));
                  } else if(mouseEvent.metaKey) {
                    if(selectedPIDs.has(curPID)) {
                      newSelected.delete(curPID);
                    } else {
                      newSelected.add(curPID);
                    }
                  } else {
                    if(newSelected.size == 1 && newSelected.has(curPID)) {
                      newSelected.clear();
                    } else {
                      newSelected.clear();
                      newSelected.add(curPID);
                    }
                  }
                  setSelectedPIDS(newSelected);
                }
              }}
              sortBy={sortBy}
              onColumnSort={({ key, order }: { key: any, order: SortOrder }) => { setSortBy({key, order}); }}
              headerClassName={styles['header-cell']}
              headerHeight={60}
            />)}
        </AutoResizer>
      </Row>
      <Row className={styles['footer']} justify="end">
        <Button
          type="primary"
          disabled={selectedPIDs.size === 0}
          onClick={() => {
            if(selectedPIDs.size === 0) {
              return;
            }
            selectedPIDs.forEach((pid: number) => dispatch(killProcess(pid)));
            setSelectedPIDS(new Set());
            /*
            let selectedPIDs = sorted.slice(
              Math.min(selectedRows.from, selectedRows.to),
              Math.max(selectedRows.from, selectedRows.to) + 1
            ).map((element: ProcessesProcessData) => element.pid);
            selectedPIDs.forEach((pid: number) => dispatch(killProcess(pid)));
            setSelectedRows({from: -1, to: -1});
            setSelectedPIDS(new Set());*/
          }}
        >
          End Task
        </Button>
      </Row>
  </div>
  );
}

export default ProcessTab;
