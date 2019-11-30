import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from "antd";
import styles from './process-tab.module.css';

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
    let className = styles['num-cell'];

    if(this.state.selectedPID !== record.pid) {
      className += ' ' + styles['level-' + Math.min(Math.ceil((parseFloat(text) + 0.001) / 20), 5)];
    }
    return {
      props: {
        className: className,
        style: { borderBottom: 'none' }
      },
      children: text + ' %'
    };
  };

  render() {
    const columns = [
      {
        title: <div>
          <br />
          <span className={styles.subtitle}>Processes</span>
        </div>,
        dataIndex: 'command',
        width: '60%',
        sorter: (a, b) => a.command.localeCompare(b.command),
        render: text => {
          return {
            props: {
              style: { borderBottom: 'none' }
            },
            children: text
          }
        }
      },
      {
        title: <div>
          <br />
          <span className={styles.subtitle}>PID</span>
        </div>,
        dataIndex: 'pid',
        sorter: (a, b) => a.pid - b.pid,
        render: text => {
          return {
            props: {
              style: { borderBottom: 'none' }
            },
            children: text
          };
        },
        width: '15%'
      },
      {
        title: <div>
          <span className={styles.title}>{Math.round( this.props.cpuLoad * 10) / 10 + ' %'}</span><br />
          <span className={styles.subtitle}>CPU</span>
        </div>,
        dataIndex: 'pcpu',
        sorter: (a, b) => a.pcpu - b.pcpu,
        width: '18%',
        render: this.percentageCellRenderer
      },
      {
        title: <div>
          <span className={styles.title}>{Math.round( this.props.memLoad * 10) / 10 + ' %'}</span><br />
          <span className={styles.subtitle}>Memory</span>
        </div>,
        dataIndex: 'pmem',
        width: '18%',
        sorter: (a, b) => a.pmem - b.pmem,
        render: this.percentageCellRenderer
      }
    ];

    return <div className={styles.processTab}>
        <Table
          className={styles.table}
          loading={this.props.processes.list.length === 0}
          dataSource={this.props.processes.list}
          columns={columns}
          bordered={false}
          scroll={{ y: 'calc(100vh - 80px - 20px - 61px)' }} // minus footer(80px) / tablist(20px) / table header(61px)
          rowKey="pid"
          rowClassName={record => styles.row + (this.state.selectedPID === record.pid ? ' ' + styles.selected : '')}
          pagination={false}
          size="small"
          onRow={(record, rowIndex) => {
            return {
              onClick: event => this.onSelectRow(record)
            };
          }}
        />
        <div className={styles.footer}>
          <Button className={styles.endtask} type="primary" disabled={this.state.selectedPID === ''}
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