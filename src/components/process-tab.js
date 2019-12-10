import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Badge, Icon } from "antd";
import { VTComponents } from 'virtualizedtableforantd';
import styles from './process-tab.module.css';


export default class ProcessTab extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    processes: PropTypes.arrayOf(PropTypes.object),
    cpuLoad: PropTypes.number,
    memoryLoad: PropTypes.number,
    killProcess: PropTypes.func
  };

  static defaultProps = {
    processes: []
  };

  static statePriority = {
    'running': 3,
    'sleeping': 2,
    'blocked': 1
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
        style: { borderBottom: 'none', transition: 'none', padding: '8px 8px'} // TODO: padding fix is for VTComponent
      },
      children: text
    }
  };

  headerRenderer = (title, subtitle) => {
    return <div>
      <span className={styles.title}>{title}</span>
      <br />
      <span className={styles.subtitle}>{subtitle}</span>
    </div>;
  };

  processCellRenderer = (text, record) => {
    let normal = this.normalCellRenderer(text);
    normal.children = <span><Icon type="profile" theme="twoTone" />&emsp;{text}</span>;
    return normal;
  };

  stateCellRenderer = (text, record) => {
    let normal = this.normalCellRenderer(text);
    const stateBadge = {
      'running': <Badge status="success" />,
      'sleeping': <Badge status="warning" />,
      'blocked': <Badge status="error" />
    };
    normal.children = stateBadge[record.state];
    return normal;
  };

  memoryCellRenderer = (text, record) => {
    let base = this.percentageCellRenderer(record.pmem, record);
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

  percentageCellRenderer = (text, record) => {
    let normal = this.normalCellRenderer(text);
    normal.props.className = styles['num-cell'];

    if(this.state.selectedPID !== record.pid) {
      normal.props.className += ' ' + styles['level-' + Math.min(Math.ceil((parseFloat(text) + 0.001) / 12.5), 8)];
    }
    normal.children = text.toFixed(1) + ' %';
    return normal;
  };

  render() {
    const columns = [
      {
        title: this.headerRenderer('', 'Name'),
        dataIndex: 'command',
        width: '200px',
        sorter: (a, b) => a.command.localeCompare(b.command),
        render: this.processCellRenderer,
        ellipsis: true
      },
      {
        title: this.headerRenderer('', <Icon type="check-circle" />),
        dataIndex: 'state',
        width: '35px',
        sorter: (a, b) => ProcessTab.statePriority[a.state] - ProcessTab.statePriority[b.state],
        render: this.stateCellRenderer
      },
      {
        title: this.headerRenderer('', 'PID'),
        dataIndex: 'pid',
        sorter: (a, b) => a.pid - b.pid,
        render: this.normalCellRenderer,
        width: '80px',
        ellipsis: true
      },
      {
        title: this.headerRenderer('', 'User'),
        dataIndex: 'user',
        sorter: (a, b) => a.user.localeCompare(b.user),
        render: this.normalCellRenderer,
        width: '80px',
        ellipsis: true
      },
      {
        title: this.headerRenderer(Math.round( this.props.cpuLoad * 10) / 10 + ' %', 'CPU'),
        dataIndex: 'pcpu',
        sorter: (a, b) => a.pcpu - b.pcpu,
        width: '100px',
        render: this.percentageCellRenderer,
        defaultSortOrder: 'descend'
      },
      {
        title: this.headerRenderer(Math.round( this.props.memoryLoad * 10) / 10 + ' %', 'Memory'),
        dataIndex: 'mem_rss',
        width: '100px',
        sorter: (a, b) => a.mem_rss - b.mem_rss,
        render: this.memoryCellRenderer
      }
    ];

    return <div className={styles.processTab}>
        <Table
          className={styles.table}
          loading={this.props.processes.length === 0}
          dataSource={this.props.processes}
          /* use VTComponents for virtualized lists for now */
          /* TODO: replace this with cleaner methods when antd 4.0 is released which has built-in support for
          *   virtualized tables */
          components={VTComponents({
            id: 1,
            destroy: true
          })}
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