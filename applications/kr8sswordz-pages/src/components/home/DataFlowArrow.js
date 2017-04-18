import React, { PropTypes } from 'react';
import classNames from 'classnames';

function DataFlowArrow (props) {
  const activeClass = classNames({
    bottom: true,
    active: props.active
  });

  const arrowUrlParam = props.reverse ? '-reverse' : '';

  return (
    <div className={props.className}>
      <img className="top" src={`../../assets/arrow${arrowUrlParam}.png`} />
      <img className={activeClass} src={`../../assets/arrow-blue${arrowUrlParam}.png`} />
    </div>
  );
}

DataFlowArrow.propTypes = {
  className: PropTypes.string.isRequired,
  active: PropTypes.bool,
  reverse: PropTypes.bool.isRequired
};

export default DataFlowArrow;
