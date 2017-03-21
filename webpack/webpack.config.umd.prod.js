var webpack = require('webpack');
var merge = require('deep-assign');
var defaultConfig = require('./webpack.umd.default');

module.exports = merge({}, defaultConfig, {
  output: {
    filename: 'react-notification-system.min.js'
  },
  devtool: 'source-map',
  plugins: [
    // set env
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: false
      },
      output: {
        comments: false
      }
    })
  ]
});
