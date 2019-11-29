import { connect } from "react-redux";
import PerformanceTab from '../components/performance-tab';

const mapStateToProps = (state, ownProps) => {
  return {
    className: ownProps.className,
    cpuLoad: state.processTab.cpuLoad.currentload,
    memLoad: (state.processTab.memLoad.active / state.processTab.memLoad.total) * 100
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