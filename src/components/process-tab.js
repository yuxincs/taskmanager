import React from 'react';
import PropTypes from 'prop-types';
import { Table } from "antd";
import './process-tab.css';

export default class ProcessTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    processes: PropTypes.object,
    cpuLoad: PropTypes.number,
    memLoad: PropTypes.number
  };

  static defaultProps = {
    processes: []
  };

  render() {
    const columns = [
      {
        title: 'Processes',
        dataIndex: 'command',
        sorter: (a, b) => a.command.localeCompare(b.command)
      },
      {
        title: 'PID',
        dataIndex: 'pid',
        sorter: (a, b) => a.pid - b.pid,
      },
      {
        title: 'CPU',
        dataIndex: 'pcpu',
        sorter: (a, b) => a.pcpu - b.pcpu,
        render: (text) => {
          return {
            props: {
              className: "cell level-" + Math.ceil((parseFloat(text) + 0.001) / 20)
            },
            children: text + ' %'
          };
        }
      },
      {
        title: 'Memory',
        dataIndex: 'pmem',
        sorter: (a, b) => a.pmem - b.pmem,
        render: (text) => {
          return {
            props: {
              className: "cell level-" + Math.ceil((parseFloat(text) + 0.001) / 20)
            },
            children: text + ' %'
          };
        }
      }
    ];
    return <Table
      dataSource={this.props.processes.list}
      columns={columns}
      rowKey="pid"
    />
  }
}