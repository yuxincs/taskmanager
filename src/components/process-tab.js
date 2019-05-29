import React from 'react';
import PropTypes from 'prop-types';
import { Table } from "antd";
import './process-tab.css';

export default class ProcessTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    processes: PropTypes.object
  };

  static defaultProps = {
    processes: []
  };

  render() {
    const columns = [
      {
        title: 'Process',
        dataIndex: 'command'
      },
      {
        title: 'PID',
        dataIndex: 'pid'
      },
      {
        title: 'CPU',
        dataIndex: 'pcpu',
        render: (text) => {
          return text + ' %';
        }
      },
      {
        title: 'Memory',
        dataIndex: 'pmem',
        render: (text) => {
          return text + ' %';
        }
      }
    ];
    return <Table dataSource={this.props.processes.list} columns={columns} rowKey="pid" />
  }
}