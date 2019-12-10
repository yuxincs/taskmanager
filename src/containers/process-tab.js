import { connect } from "react-redux";
import ProcessTab from '../components/process-tab';
import { killProcess } from "../actions/process";

const mapStateToProps = (state, ownProps) => {
  return {
    className: ownProps.className,
    processes: state.process.processes,
    cpuLoad: state.cpu.loadHistory[state.cpu.loadHistory.length - 1],
    memoryLoad: state.memory.loadHistory[state.memory.loadHistory.length - 1]
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