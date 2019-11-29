import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from "antd";
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
        width: '60%',
        sorter: (a, b) => a.command.localeCompare(b.command)
      },
      {
        title: 'PID',
        dataIndex: 'pid',
        sorter: (a, b) => a.pid - b.pid,
        width: '10%'
      },
      {
        title: <div>
          <span>{Math.round( this.props.cpuLoad * 10) / 10 + ' %'}</span><br />
          <span>{'CPU'}</span>
        </div>,
        dataIndex: 'pcpu',
        sorter: (a, b) => a.pcpu - b.pcpu,
        width: '15%',
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
        title: <div>
          <span>{Math.round( this.props.memLoad * 10) / 10 + ' %'}</span><br />
          <span>{'Memory'}</span>
        </div>,
        dataIndex: 'pmem',
        width: '15%',
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
    return <div>
        <Table
          loading={this.props.processes.list.length === 0}
          dataSource={this.props.processes.list}
          columns={columns}
          bordered={false}
          scroll={{ y: "calc(100vh - 200px)" }}
          rowKey="pid"
          rowClassName={() => 'row'}
          pagination={false}
          size="small"
        />
        <div className="footer">
          <Button
            className="endtask"
            type="primary"
          >End Task
          </Button>
        </div>
      </div>
  }
}