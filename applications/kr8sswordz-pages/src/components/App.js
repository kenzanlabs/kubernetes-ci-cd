import React, { PropTypes } from 'react';
import Header from './shared/Header';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  slider: {
    selectionColor: '#326de6'
  },
});

/**
 * The App component for the project.
 */
class App extends React.Component {
  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header />
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  /**
   * The child elements of the app.
   */
  children: PropTypes.element
};

export default App;
