import React from 'react';
import PropTypes from 'prop-types';
import { Table } from "antd";

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
        render: (text, record) => {
          return text + ' %';
        }
      },
      {
        title: 'Memory',
        dataIndex: 'pmem',
        render: (text, record) => {
          return text + ' %';
        }
      }
    ];
    return <Table dataSource={this.props.processes.list} columns={columns} rowKey="pid" />
  }
}