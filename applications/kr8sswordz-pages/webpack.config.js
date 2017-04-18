var path = require('path');

module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
    react: './src/index'
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'bundle.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [
      // required to write 'require('./style.css')'
      { test: /\.css$/, loader: 'style-loader!css-loader' },

      // required for react jsx
      { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel'] },

      // "file" loader for svg
      { test: /\.svg$/, loader: 'file-loader' },

      // json loader
      { test: /\.json$/, loader: 'json' }
    ]
  }
};
