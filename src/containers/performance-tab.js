import { connect } from "react-redux";
import PerformanceTab from '../components/performance-tab';

const mapStateToProps = (state, ownProps) => {
  return {
    className: ownProps.className,
    cpuLoadHistory: state.performanceTab.cpuLoadHistory,
    memLoadHistory: state.performanceTab.memLoadHistory,
    staticInfo: state.performanceTab.staticInfo
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