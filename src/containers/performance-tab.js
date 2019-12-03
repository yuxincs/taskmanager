import { connect } from "react-redux";
import PerformanceTab from '../components/performance-tab';

const mapStateToProps = (state, ownProps) => {
  return {
    className: ownProps.className,
    cpuLoadHistory: state.performanceTab.cpuLoadHistory,
    memLoadHistory: state.performanceTab.memLoadHistory,
    cpuStatic: state.performanceTab.cpuStatic,
    memoryStatic: state.performanceTab.memoryStatic,
    cpuDynamic: state.performanceTab.cpuDynamic,
    memoryDynamic: state.performanceTab.memoryDynamic
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