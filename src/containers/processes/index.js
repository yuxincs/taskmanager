import { connect } from "react-redux";
import ProcessTab from '../../components/processes';

const mapStateToProps = (state, ownProps) => {
  return {
    className: ownProps.className,
    processes: state.processes.data
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