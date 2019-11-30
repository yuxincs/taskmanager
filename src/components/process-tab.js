import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Badge } from "antd";
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

  normalCellRenderer = text => {
    return {
      props: {
        style: { borderBottom: 'none' }
      },
      children: text
    }
  };

  processCellRenderer = (text, record) => {
    const stateBadge = {
      'running': <Badge status="success" />,
      'sleeping': <Badge status="warning" />
    };
    const badge = stateBadge[record.state];
    let normal = this.normalCellRenderer(text);
    normal.children = <div>{badge} <span>{text}</span></div>;
    return normal;
  };

  percentageCellRenderer = (text, record) => {
    let normal = this.normalCellRenderer(text);
    normal.props.className = styles['num-cell'];

    if(this.state.selectedPID !== record.pid) {
      normal.props.className += ' ' + styles['level-' + Math.min(Math.ceil((parseFloat(text) + 0.001) / 20), 5)];
    }
    normal.children = text + ' %';
    return normal;
  };

  render() {
    const columns = [
      {
        title: <div>
          <br />
          <span className={styles.subtitle}>Processes</span>
        </div>,
        dataIndex: 'command',
        width: '350px',
        sorter: (a, b) => a.command.localeCompare(b.command),
        render: this.processCellRenderer
      },
      {
        title: <div>
          <span className={styles.title}>{Math.round( this.props.cpuLoad * 10) / 10 + ' %'}</span><br />
          <span className={styles.subtitle}>CPU</span>
        </div>,
        dataIndex: 'pcpu',
        sorter: (a, b) => a.pcpu - b.pcpu,
        width: '100px',
        render: this.percentageCellRenderer
      },
      {
        title: <div>
          <span className={styles.title}>{Math.round( this.props.memLoad * 10) / 10 + ' %'}</span><br />
          <span className={styles.subtitle}>Memory</span>
        </div>,
        dataIndex: 'pmem',
        width: '100px',
        sorter: (a, b) => a.pmem - b.pmem,
        render: this.percentageCellRenderer
      },
      {
        title: <div>
          <br />
          <span className={styles.subtitle}>PID</span>
        </div>,
        dataIndex: 'pid',
        sorter: (a, b) => a.pid - b.pid,
        render: this.normalCellRenderer,
        width: '80px'
      },
      {
        title: <div>
          <br />
          <span className={styles.subtitle}>User</span>
        </div>,
        dataIndex: 'user',
        sorter: (a, b) => a.user.localeCompare(b.user),
        render: this.normalCellRenderer,
        width: '120px'
      },
    ];

    return <div className={styles.processTab}>
        <Table
          className={styles.table}
          loading={this.props.processes.list.length === 0}
          dataSource={this.props.processes.list}
          columns={columns}
          bordered={false}
          scroll={{ x: true, y: 'calc(100vh - 80px - 20px - 61px)' }} // minus footer(80px) / tablist(20px) / table header(61px)
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