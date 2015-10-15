var path = require('path');
var webpack = require('webpack');

var JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './example/src/scripts/App'
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
    extensions: ['', '.js', '.jsx', '.sass'],
    modulesDirectories: ['node_modules', 'src']
  },
  module: {
    loaders: [
      {
        test: JS_REGEX,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'example/src')
        ],
        loader: 'babel',
        query: {
          stage: 0,
          plugins: ['react-class-display-name', 'react-transform'],
          extra: {
            'react-transform': [{
              'target': 'react-transform-hmr',
              'imports': ['react'],
              'locals': ['module']
            }, {
              'target': 'react-transform-catch-errors',
              'imports': ['react', 'redbox-react']
            }]
          }
        }
      },
      {
        test: /\.sass$/,
        loaders: [
          'style-loader',
          'css-loader',
          'autoprefixer-loader?browsers=last 2 version',
          'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, 'example/src')
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/,
        loader: 'file-loader',
        exclude: /node_modules/
      }
    ]
  }
};
