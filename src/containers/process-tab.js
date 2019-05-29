import { connect } from "react-redux";
import ProcessTab from '../components/process-tab';

const mapStateToProps = (state, ownProps) => {
  return {
    className: ownProps.className,
    processes: state.processTab.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

const ProcessTabContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessTab);

export default ProcessTabContainer;