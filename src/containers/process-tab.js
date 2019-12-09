import { connect } from "react-redux";
import ProcessTab from '../components/process-tab';
import { killProcess } from "../actions/process";

const mapStateToProps = (state, ownProps) => {
  return {
    className: ownProps.className,
    processes: state.processTab.processes,
    cpuLoad: state.processTab.cpuLoad.currentload,
    memLoad: (state.processTab.memLoad.active / state.processTab.memLoad.total) * 100
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    killProcess: (pid) => { dispatch(killProcess(pid)); }
  }
};

const ProcessTabContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessTab);

export default ProcessTabContainer;