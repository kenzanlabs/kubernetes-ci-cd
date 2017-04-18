import React, { PropTypes } from 'react';
import Slider from 'material-ui/Slider';

function SliderComponent (props) {
  return (
    <div className="slider-container">
      {props.title &&
        <p className="slider-title inline bold">{props.title}</p>}
      <div className="slider">
        <Slider
          min={props.properties.min}
          max={props.properties.max}
          step={props.properties.step}
          defaultValue={props.properties.defaultValue}
          onChange={props.properties.onChange}
          sliderStyle={{'margin': 0}}
          />
      </div>
    </div>
  );
}

SliderComponent.propTypes = {
  title: PropTypes.string,
  properties: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func
  }).isRequired
};

export default SliderComponent;
