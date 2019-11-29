import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from "antd";
import './process-tab.css';

export default class ProcessTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    processes: PropTypes.object,
    cpuLoad: PropTypes.number,
    memLoad: PropTypes.number,
    killProcess: PropTypes.func
  };

  static defaultProps = {
    processes: []
  };

  constructor(props) {
    super(props);
    this.state = {
      'selectedPID': ''
    };
  }

  onSelectRow = record =>  {
    this.setState({'selectedPID': record.pid});
  };

  percentageCellRenderer = (text, record) => {
    let className = 'right';

    if(this.state.selectedPID !== record.pid) {
      className += ' cell';
      className += ' level-' + Math.min(Math.ceil((parseFloat(text) + 0.001) / 20), 5);
    }
    return {
      props: {
        className: className
      },
      children: text + ' %'
    };
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
        title: <span className="center">PID</span>,
        dataIndex: 'pid',
        sorter: (a, b) => a.pid - b.pid,
        render: text => {
          return {
            props: {
              className: "center"
            },
            children: text
          };
        },
        width: '15%'
      },
      {
        title: <div>
          <span>{Math.round( this.props.cpuLoad * 10) / 10 + ' %'}</span><br />
          <span>CPU</span>
        </div>,
        dataIndex: 'pcpu',
        sorter: (a, b) => a.pcpu - b.pcpu,
        width: '18%',
        render: this.percentageCellRenderer
      },
      {
        title: <div>
          <span>{Math.round( this.props.memLoad * 10) / 10 + ' %'}</span><br />
          <span>Memory</span>
        </div>,
        dataIndex: 'pmem',
        width: '18%',
        sorter: (a, b) => a.pmem - b.pmem,
        render: this.percentageCellRenderer
      }
    ];

    return <div className="process-tab">
        <Table
          className="table"
          loading={this.props.processes.list.length === 0}
          dataSource={this.props.processes.list}
          columns={columns}
          bordered={false}
          scroll={{ y: 'calc(100vh - 80px - 36px - 61px)' }} // minus footer(80px) / tablist(36px) / table header(61)
          rowKey="pid"
          rowClassName={record => 'row' + (this.state.selectedPID === record.pid ? ' selected' : '')}
          pagination={false}
          size="small"
          onRow={(record, rowIndex) => {
            return {
              onClick: event => this.onSelectRow(record)
            };
          }}
        />
        <div className="footer">
          <Button className="endtask" type="primary" disabled={this.state.selectedPID === ''}
                  onClick={() => {
                    this.setState({selectedPID: ''});
                    this.props.killProcess(this.state.selectedPID);
                  }}>
            End Task
          </Button>
        </div>
      </div>
  }
}