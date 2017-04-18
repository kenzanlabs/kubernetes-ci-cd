import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/webSocketActions';
import InstanceGrid from '../instance-grid/InstanceGrid';
import { instanceConfig } from './instanceConfig';

class InstancesComponent extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      instanceCount: props.pods.length
    };

    this.handleSlider = this.handleSlider.bind(this);
    this.onScale = this.onScale.bind(this);
  }

  componentWillMount () {
    this.props.actions.getPods();
    this.props.actions.connectToSocket();
  }

  componentWillReceiveProps (newProps) {
    if (newProps.pods !== this.props.pods) {
      this.setState({
        instanceCount: newProps.pods.length
      });
    }
  }

  componentWillUnmount () {
    this.props.actions.disconnectFromSocket();
  }

  handleSlider (event, value) {
    this.setState({
      instanceCount: value
    });
  }

  onScale () {
    this.props.actions.scale(this.state.instanceCount);
  }

  render () {
    const instanceProps = Object.assign({}, instanceConfig, {
      onChange: this.handleSlider,
      onScale: this.onScale
    });

    return (
      <InstanceGrid
        properties={instanceProps}
        instanceCount={this.state.instanceCount}
        pods={this.props.pods}
        activeInstance={this.props.activeInstance}>
      </InstanceGrid>
    );
  }
}

InstancesComponent.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func),
  state: PropTypes.object,
  pods: PropTypes.array,
  activeInstance: PropTypes.string
};

function mapStateToProps (state) {
  return {
    pods: state.webSocket.pods,
    activeInstance: state.webSocket.activePod
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InstancesComponent);
