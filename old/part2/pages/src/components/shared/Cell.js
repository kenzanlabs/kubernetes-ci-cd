import React, {PropTypes} from 'react';
import classNames from 'classnames';

function Cell (props) {
  const cellClass = classNames({
    cell: true,
    isEmpty: props.isEmpty
  });

  const currentVal = props.value === '*' ? '' : props.value;
  const inputClass = classNames({
    incorrect: currentVal && currentVal.toLowerCase() !== props.letter.toLowerCase()
  });

  return (
    <div className={cellClass}>
      <div className="superscript-number">{props.positionInWord === 0 ? props.wordNbr : ''}</div>
      <input
        name={props.id}
        type="text"
        maxLength="1"
        size="1"
        onChange={props.onCellInput}
        className={inputClass}
        value={currentVal}
        disabled={props.isEmpty}
      />
    </div>
  );
}

Cell.propTypes = {
  id: PropTypes.string.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  positionInWord: PropTypes.number,
  wordNbr: PropTypes.number,
  letter: PropTypes.string,
  value: PropTypes.string,
  onCellInput: PropTypes.func
};

export default Cell;
