import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as puzzleActions from '../../actions/puzzleActions';
import * as webSocketActions from '../../actions/webSocketActions';
import Cell from '../shared/Cell';
import Slider from '../shared/Slider';
import _ from 'lodash';

class PuzzleComponent extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      cells: [],
      downHints: [],
      acrossHints: [],
      puzzleGrid: [],
      sliderCount: 1
    };

    this.onCellInput = this.onCellInput.bind(this);
    this.initializePuzzleArray = this.initializePuzzleArray.bind(this);
    this.convertPuzzleGridToPuzzleArray = this.convertPuzzleGridToPuzzleArray.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.submitConsecutiveRequests = this.submitConsecutiveRequests.bind(this);
    this.submitConcurrentRequests = this.submitConcurrentRequests.bind(this);
    this.reloadPuzzle = this.reloadPuzzle.bind(this);
    this.clearPuzzle = this.clearPuzzle.bind(this);
    this.submitPuzzle = this.submitPuzzle.bind(this);
  }

  componentWillMount () {
    this.props.puzzleActions.getPuzzleData();
  }

  componentWillReceiveProps (newProps) {
    if (this.props.puzzleData !== newProps.puzzleData) {
      this.initializePuzzleArray(newProps.puzzleData);
    }
  }

  initializeGrid () {
    const puzzleGrid = [];
    const maxRows = 12;
    const maxColumns = 11;

    for (var i = 0; i < maxColumns; i++) {
      puzzleGrid.push(new Array(maxRows).fill(''));
    }

    return puzzleGrid;
  }

  initializePuzzleArray (puzzleArray) {
    const downHintsArray = puzzleArray.filter((word) => {
      return (word.wordOrientation === 'down');
    });
    const acrossHintsArray = puzzleArray.filter((word) => {
      return (word.wordOrientation === 'across');
    });

    const downHints = this.buildHints(downHintsArray);
    const acrossHints = this.buildHints(acrossHintsArray);

    let puzzleGrid = [...this.initializeGrid()];
    puzzleArray.forEach((wordObj, index) => {
      const lettersArray = wordObj.word.split('');
      const enteredValueArray = wordObj.enteredValue.split('');
      lettersArray.forEach((letter, index) => {
        puzzleGrid = this.addLetterToPuzzleArray(puzzleGrid, wordObj, letter, enteredValueArray[index], index);
      });
    });

    const cells = this.buildCells(puzzleGrid);

    this.setState({
      downHints,
      acrossHints,
      puzzleGrid,
      cells
    });
  }

  addLetterToPuzzleArray (puzzleGrid, wordObj, letter, enteredValue, index) {
    const letterObj = {
      word: wordObj.word,
      wordNbr: wordObj.wordNbr,
      positionInWord: index,
      cellLetter: letter,
      currentValue: enteredValue,
      wordOrientation: wordObj.wordOrientation,
      x: wordObj.wordOrientation === 'across' ? wordObj.startx + index : wordObj.startx,
      y: wordObj.wordOrientation === 'across' ? wordObj.starty : wordObj.starty + index
    };

    puzzleGrid[letterObj.y][letterObj.x] = letterObj;

    return puzzleGrid;
  }

  buildCells (puzzleGrid) {
    return puzzleGrid.map((column, index) => {
      return column.map((cell, i) => {
        return (
          <Cell
            key={index + i}
            id={'cell'.concat('-', index, '-', i)}
            orientation={cell.wordOrientation}
            letter={cell.cellLetter}
            value={cell.currentValue}
            isEmpty={!_.isInteger(cell.positionInWord)}
            positionInWord={cell.positionInWord}
            wordNbr={cell.wordNbr}
            onCellInput={this.onCellInput}
          />
        );
      });
    });
  }

  onCellInput (e) {
    const cellData = e.target.name.split('-');
    const row = cellData[1];
    const col = cellData[2];

    const puzzleGrid = this.state.puzzleGrid.map((colData, rowIndex) => {
      return colData.map((cell, colIndex) => {
        if (rowIndex == row && colIndex == col) {
          return Object.assign({}, cell, {
            currentValue: e.target.value
          });
        } else {
          return cell;
        }
      });
    });

    const cells = this.buildCells(puzzleGrid);

    this.setState({
      puzzleGrid,
      cells
    });
  }

  buildHints (hintsArray) {
    return _.sortBy(hintsArray, 'wordNbr').map((word, index) => {
      return (
        <li key={index}>
          <p className="bold inline">{word.wordNbr}.</p> <p className="inline">{word.hint}</p>
        </li>
      );
    });
  }

  handleSlider (e, v) {
    this.setState({
      sliderCount: v
    });
  }

  submitConcurrentRequests () {
    this.props.webSocketActions.submitConcurrentRequests(this.state.sliderCount);
  }

  submitConsecutiveRequests () {
    this.props.webSocketActions.submitConsecutiveRequests(this.state.sliderCount);
  }

  convertPuzzleGridToPuzzleArray () {
    const submission = this.props.puzzleData.map((word) => {
      const startx = word.startx;
      const starty = word.starty;
      const length = word.word.length;
      const direction = word.wordOrientation;

      const enteredLetters = this.state.puzzleGrid.map((colData, row) => {
        return colData.map((cell, col) => {
          if (startx === col && starty === row) {
            return cell.currentValue || '*';
          }

          for (let i = 1; i < length; i++) {
            if (direction === 'down' && startx === col && starty + i === row) {
              return cell.currentValue || '*';
            } else if (direction === 'across' && startx + i === col && starty === row) {
              return cell.currentValue || '*';
            }
          }
        });
      });

      const enteredValue = enteredLetters.reduce((arr, val) => {
        return arr.concat(val);
      }).join('');

      return Object.assign({}, word, {
        enteredValue
      });
    });

    return submission;
  }

  reloadPuzzle () {
    this.props.puzzleActions.sendingData();
    this.props.puzzleActions.getPuzzleData();
  }

  clearPuzzle () {
    let submission = [...this.props.puzzleData];
    submission = submission.map(obj => {
      const letters = obj.enteredValue.length;
      obj.enteredValue = new Array(letters).fill('*').join('');
      return obj;
    });

    this.props.puzzleActions.sendingData();
    console.log('component', submission);
    this.props.puzzleActions.submitPuzzleData(this.props.puzzleId, submission);
  }

  submitPuzzle (e) {
    e.preventDefault();
    const submission = this.convertPuzzleGridToPuzzleArray();

    this.props.puzzleActions.sendingData();
    this.props.puzzleActions.submitPuzzleData(this.props.puzzleId, submission);
  }

  render () {
    const sliderProperties = {
      min: 1,
      max: 50,
      step: 1,
      defaultValue: this.state.sliderCount,
      onChange: this.handleSlider
    };

    return (
      <div className="crossword-container">
        <div className="puzzle-container">
          <form onSubmit={this.submitPuzzle}>
            <div className="puzzle">
              {this.state.cells}
            </div>
            <div className="request-slider">
              <Slider properties={sliderProperties}/>
              <div className="button-row center">
                <button className="primary compact" type="button" onClick={this.submitConcurrentRequests}><strong>Concurrent</strong> Requests {this.state.sliderCount}</button>
                <button className="primary compact" type="button" onClick={this.submitConsecutiveRequests}><strong>Consecutive</strong> Requests {this.state.sliderCount}</button>
              </div>
            </div>
            <div className="button-row">
              <button className="secondary" type="button" onClick={this.reloadPuzzle}>Reload</button>
              <button className="secondary" type="button" onClick={this.clearPuzzle}>Clear</button>
              <input className="button primary" type="submit" />
            </div>
          </form>
        </div>
        <div className="puzzle-hints">
          <div className="hint-container">
            <div className="hint-category down">
              <h6 className="bold">Down</h6>
              <ul>
                  {this.state.downHints}
              </ul>
            </div>
            <div className="hint-category across">
              <h6 className="bold">Across</h6>
              <ul>
                  {this.state.acrossHints}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PuzzleComponent.propTypes = {
  puzzleActions: PropTypes.objectOf(PropTypes.func),
  webSocketActions: PropTypes.objectOf(PropTypes.func),
  state: PropTypes.object,
  puzzleData: PropTypes.array,
  puzzleId: PropTypes.string
};

function mapStateToProps (state) {
  return {
    puzzleId: state.puzzle.id,
    puzzleData: state.puzzle.puzzleData
  };
}

function mapDispatchToProps (dispatch) {
  return {
    puzzleActions: bindActionCreators(puzzleActions, dispatch),
    webSocketActions: bindActionCreators(webSocketActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PuzzleComponent);
