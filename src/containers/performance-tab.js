import { connect } from "react-redux";
import PerformanceTab from '../components/performance-tab';

const mapStateToProps = (state, ownProps) => {
  return {
    className: ownProps.className,
    processCount: state.process.processes.length,
    cpuLoadHistory: state.cpu.loadHistory,
    cpuInfo: state.cpu.info,
    cpuSpeed: state.cpu.currentSpeed,
    memoryLoadHistory: state.memory.loadHistory,
    memoryLoad: state.memory.load,
    memoryInfo: state.memory.info
  };
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

const PerformanceTabContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformanceTab);

export default PerformanceTabContainer;