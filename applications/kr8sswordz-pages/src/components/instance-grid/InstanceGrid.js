import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Slider from '../shared/Slider';

function InstanceGrid (props) {
  const instances = props.pods.map((pod, index) => {
    const instanceClass = classNames({
      instance: true,
      active: pod === props.activeInstance
    });

    return <div key={pod} className={instanceClass}>{pod}</div>;
  });

  const sliderProps = Object.assign({}, props.properties, {
    value: props.instanceCount
  });

  return (
    <div>
      <div className="instance-grid">
        {instances}
      </div>
      <div className="button-row instance-buttons">
        <Slider properties={sliderProps} />
        <button className="primary" onClick={props.properties.onScale}>Scale {props.instanceCount}</button>
      </div>
      <div className="scale-hints">
        <p>Choose the number of instances you want to scale in your cluster and click "Scale".
          This will call our service and scale up the number of replicas to the desired size. </p>
      </div>
    </div>
  );
}

InstanceGrid.propTypes = {
  properties: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    defaultValue: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func,
    getSliderValue: PropTypes.func,
    onScale: PropTypes.func
  }),
  instanceCount: PropTypes.number,
  pods: PropTypes.array,
  activeInstance: PropTypes.string
};

export default InstanceGrid;
