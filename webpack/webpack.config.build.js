var path = require('path');
var webpack = require('webpack');

var JS_REGEX = /\.js$|\.jsx$/;

module.exports = {
  entry: [
    './src/NotificationSystem'
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'NotificationSystem.js',
    library: 'react-notification-system',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'src']
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module: {
    loaders: [
      {
        test: JS_REGEX,
        include: [
          path.resolve(__dirname, '../src')
        ],
        exclude: /node_modules/,
        loader: 'babel?presets=airbnb'
      }
    ]
  }
};
