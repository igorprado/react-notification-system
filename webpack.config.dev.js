var path = require('path');
var webpack = require('webpack');

var JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './example/src/app'
  ],
  output: {
    path: path.join(__dirname, 'example/build'),
    filename: 'app.js',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.es6', '.babel'],
    modulesDirectories: ['node_modules', 'src']
  },
  module: {
    loaders: [{
      test: JS_REGEX,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'example/src')
      ],
      loader: 'babel'
    }]
  }
};
